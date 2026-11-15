import { vi, describe, it, expect, beforeEach } from "vitest";
import { signIn, getIdToken, signOut } from "./ownerAuth";

const OWNER = "c831f380-7071-7082-6ecc-6110e068d744";

const sdk = vi.hoisted(() => ({
  current: null as null | { getSession: (cb: (err: Error | null, s: unknown) => void) => void; signOut: () => void },
  authenticate: vi.fn(),
  userSignOut: vi.fn(),
}));

const session = (sub: string, valid = true) => ({
  isValid: () => valid,
  getIdToken: () => ({ decodePayload: () => ({ sub }), getJwtToken: () => `jwt-${sub}` }),
});

vi.mock("amazon-cognito-identity-js", () => ({
  CognitoUserPool: class {
    getCurrentUser() {
      return sdk.current;
    }
  },
  AuthenticationDetails: class {},
  CognitoUser: class {
    authenticateUser(_d: unknown, cbs: unknown) {
      sdk.authenticate(cbs);
    }
    signOut() {
      sdk.userSignOut();
    }
  },
}));

type Callbacks = {
  onSuccess: (s: unknown) => void;
  onFailure: (e: unknown) => void;
  newPasswordRequired: () => void;
};
const respond = (fn: (cbs: Callbacks) => void) => sdk.authenticate.mockImplementation(fn);

const cached = (s: unknown, err: Error | null = null) => {
  sdk.current = { getSession: (cb) => cb(err, s), signOut: sdk.userSignOut };
};

beforeEach(() => {
  sdk.current = null;
  sdk.authenticate.mockReset();
  sdk.userSignOut.mockReset();
});

describe("signIn", () => {
  it("accepts the owner's account", async () => {
    respond((cbs) => cbs.onSuccess(session(OWNER)));
    await expect(signIn(" me@example.com ", "pw")).resolves.toBeUndefined();
  });

  it("refuses and signs out any other account in the pool", async () => {
    respond((cbs) => cbs.onSuccess(session("someone-else")));
    await expect(signIn("x@example.com", "pw")).rejects.toThrow("This page is for moderators.");
    expect(sdk.userSignOut).toHaveBeenCalled();
  });

  it("passes on a failed sign-in and a required password change, without naming the provider", async () => {
    respond((cbs) => cbs.onFailure(new Error("Incorrect username or password.")));
    await expect(signIn("x", "pw")).rejects.toThrow("Incorrect username or password.");
    respond((cbs) => cbs.onFailure("odd"));
    await expect(signIn("x", "pw")).rejects.toThrow("odd");
    respond((cbs) => cbs.newPasswordRequired());
    await expect(signIn("x", "pw")).rejects.toThrow(/new password/);
  });
});

describe("getIdToken", () => {
  it("returns the owner's cached token and nothing for anyone else", async () => {
    expect(await getIdToken()).toBeNull();
    cached(session(OWNER));
    expect(await getIdToken()).toBe(`jwt-${OWNER}`);
    cached(session("someone-else"));
    expect(await getIdToken()).toBeNull();
    cached(session(OWNER, false));
    expect(await getIdToken()).toBeNull();
    cached(null, new Error("expired"));
    expect(await getIdToken()).toBeNull();
  });
});

describe("signOut", () => {
  it("ends the cached session, if any", () => {
    signOut();
    cached(session(OWNER));
    signOut();
    expect(sdk.userSignOut).toHaveBeenCalledTimes(1);
  });
});
