import { act, renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

const oidc = vi.hoisted(() => {
  const listeners = { loaded: [] as ((u: unknown) => void)[], unloaded: [] as (() => void)[] };
  const um = {
    settings: null as unknown,
    getUser: vi.fn(),
    signinRedirect: vi.fn(),
    signinRedirectCallback: vi.fn(),
    removeUser: vi.fn(),
    events: {
      addUserLoaded: (fn: (u: unknown) => void) => listeners.loaded.push(fn),
      addUserUnloaded: (fn: () => void) => listeners.unloaded.push(fn),
      removeUserLoaded: (fn: (u: unknown) => void) => {
        listeners.loaded = listeners.loaded.filter((f) => f !== fn);
      },
      removeUserUnloaded: (fn: () => void) => {
        listeners.unloaded = listeners.unloaded.filter((f) => f !== fn);
      },
    },
  };
  return { um, listeners };
});

vi.mock("oidc-client-ts", () => ({
  UserManager: class {
    constructor(settings: unknown) {
      oidc.um.settings = settings;
      return oidc.um;
    }
  },
  WebStorageStateStore: class {},
}));

async function load() {
  vi.resetModules();
  return import("./auth");
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("VITE_ENABLE_COMMENTS", "true");
  vi.stubEnv("VITE_COMMENTS_API_URL", "https://api.example");
  vi.stubEnv("VITE_AUTH_POOL_ID", "us-west-2_pool");
  vi.stubEnv("VITE_AUTH_CLIENT_ID", "client");
  vi.stubEnv("VITE_AUTH_DOMAIN", "https://login.example");
  for (const fn of [oidc.um.getUser, oidc.um.signinRedirect, oidc.um.signinRedirectCallback, oidc.um.removeUser]) {
    fn.mockReset();
  }
  oidc.um.getUser.mockResolvedValue(null);
});

describe("commentsEnabled", () => {
  it("is on only with the flag and every setting present", async () => {
    expect((await load()).commentsEnabled).toBe(true);
    vi.stubEnv("VITE_AUTH_CLIENT_ID", "");
    expect((await load()).commentsEnabled).toBe(false);
    vi.stubEnv("VITE_AUTH_CLIENT_ID", "client");
    vi.stubEnv("VITE_ENABLE_COMMENTS", "false");
    expect((await load()).commentsEnabled).toBe(false);
  });
});

describe("sign-in flow", () => {
  it("configures the client for this pool and site, once", async () => {
    const auth = await load();
    const um = await auth.getManager();
    expect(await auth.getManager()).toBe(um);
    expect(oidc.um.settings).toMatchObject({
      authority: "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_pool",
      client_id: "client",
      redirect_uri: `${window.location.origin}/auth/callback/`,
      response_type: "code",
    });
  });

  it("remembers the page to come back to", async () => {
    window.history.pushState({}, "", "/sermons/a-post/");
    await (await load()).signIn();
    expect(oidc.um.signinRedirect).toHaveBeenCalledWith({ state: { returnTo: "/sermons/a-post/" } });
  });

  it("opens the sign-up screen for a new account, with the same callback", async () => {
    window.history.pushState({}, "", "/sermons/b-post/");
    const auth = await load();
    await auth.createAccount();
    expect(oidc.um.settings).toMatchObject({
      redirect_uri: `${window.location.origin}/auth/callback/`,
      metadataSeed: { authorization_endpoint: "https://login.example/signup" },
    });
    expect(oidc.um.signinRedirect).toHaveBeenCalledWith({ state: { returnTo: "/sermons/b-post/" } });
  });

  it("returns to a same-site path after the callback and nowhere else", async () => {
    const auth = await load();
    oidc.um.signinRedirectCallback.mockResolvedValue({ state: { returnTo: "/sermons/x/" } });
    expect(await auth.completeSignIn()).toBe("/sermons/x/");
    oidc.um.signinRedirectCallback.mockResolvedValue({ state: { returnTo: "//evil.example" } });
    expect(await auth.completeSignIn()).toBe("/");
    oidc.um.signinRedirectCallback.mockResolvedValue({ state: undefined });
    expect(await auth.completeSignIn()).toBe("/");
  });

  it("signs out locally and at the login service", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { ...window.location, origin: "https://site.example", assign });
    const auth = await load();
    await auth.signOut();
    expect(oidc.um.removeUser).toHaveBeenCalled();
    expect(assign).toHaveBeenCalledWith(
      "https://login.example/logout?client_id=client&logout_uri=https%3A%2F%2Fsite.example%2F",
    );
    vi.unstubAllGlobals();
  });

  it("forgets the user without leaving the page", async () => {
    await (await load()).forgetUser();
    expect(oidc.um.removeUser).toHaveBeenCalled();
  });
});

describe("useAuth", () => {
  it("reports signed out, then follows sign-in and sign-out events", async () => {
    const { useAuth } = await load();
    const { result, unmount } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.token).toBeNull();

    act(() => {
      oidc.listeners.loaded.forEach((fn) =>
        fn({ expired: false, access_token: "tok", profile: {} }),
      );
    });
    expect(result.current).toEqual({ loading: false, token: "tok" });

    act(() => {
      oidc.listeners.unloaded.forEach((fn) => fn());
    });
    expect(result.current.token).toBeNull();

    unmount();
    expect(oidc.listeners.loaded).toHaveLength(0);
  });

  it("treats an expired session as signed out", async () => {
    oidc.um.getUser.mockResolvedValue({ expired: true, access_token: "old", profile: {} });
    const { useAuth } = await load();
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.token).toBeNull();

    act(() => {
      oidc.listeners.loaded.forEach((fn) => fn({ expired: false, access_token: "t", profile: {} }));
    });
    expect(result.current).toEqual({ loading: false, token: "t" });
  });

  it("can unmount before the sign-in client has loaded", async () => {
    const { useAuth } = await load();
    const { unmount } = renderHook(() => useAuth());
    expect(() => unmount()).not.toThrow();
    await waitFor(() => expect(oidc.um.getUser).toHaveBeenCalled());
  });

  it("ignores events after unmount", async () => {
    let resolve!: (u: null) => void;
    oidc.um.getUser.mockReturnValue(new Promise((r) => (resolve = r)));
    const { useAuth } = await load();
    const { result, unmount } = renderHook(() => useAuth());
    await waitFor(() => expect(oidc.um.getUser).toHaveBeenCalled());
    unmount();
    resolve(null);
    await Promise.resolve();
    expect(result.current.loading).toBe(true);
  });
});
