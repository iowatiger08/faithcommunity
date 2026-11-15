// Sign-in for commenters. Everything here runs in the browser only: the OIDC
// client is imported on first use, so it never loads during the SSG build or
// on pages without comments.
import { useEffect, useState } from "react";
import type { User, UserManager } from "oidc-client-ts";

const env = import.meta.env;

export const commentsEnabled =
  env.VITE_ENABLE_COMMENTS === "true" &&
  [env.VITE_COMMENTS_API_URL, env.VITE_AUTH_POOL_ID, env.VITE_AUTH_CLIENT_ID].every(
    (v) => typeof v === "string" && v !== "",
  );

let manager: Promise<UserManager> | null = null;

export function getManager(): Promise<UserManager> {
  manager ??= import("oidc-client-ts").then(({ UserManager, WebStorageStateStore }) => {
    const origin = window.location.origin;
    return new UserManager({
      authority: `https://cognito-idp.us-west-2.amazonaws.com/${env.VITE_AUTH_POOL_ID}`,
      client_id: env.VITE_AUTH_CLIENT_ID,
      redirect_uri: `${origin}/auth/callback/`,
      post_logout_redirect_uri: `${origin}/`,
      response_type: "code",
      scope: "openid email",
      // Keeps people signed in across tabs and visits until they sign out.
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      automaticSilentRenew: true,
    });
  });
  return manager;
}

export async function signIn(): Promise<void> {
  const um = await getManager();
  await um.signinRedirect({ state: { returnTo: window.location.pathname } });
}

/** Completes a sign-in on /auth/callback/ and returns the page to go back to. */
export async function completeSignIn(): Promise<string> {
  const um = await getManager();
  const user = await um.signinRedirectCallback();
  const returnTo = (user.state as { returnTo?: unknown } | undefined)?.returnTo;
  // Only same-site paths, so the callback can't be used to send people elsewhere.
  return typeof returnTo === "string" && returnTo.startsWith("/") && !returnTo.startsWith("//")
    ? returnTo
    : "/";
}

export async function signOut(): Promise<void> {
  const um = await getManager();
  await um.removeUser();
  // The managed login keeps its own session; end it too so the next sign-in
  // asks for an email again on a shared computer.
  const params = new URLSearchParams({
    client_id: env.VITE_AUTH_CLIENT_ID,
    logout_uri: `${window.location.origin}/`,
  });
  window.location.assign(`${env.VITE_AUTH_DOMAIN}/logout?${params}`);
}

/** Drops the local session without leaving the page (used after account deletion). */
export async function forgetUser(): Promise<void> {
  const um = await getManager();
  await um.removeUser();
}

export interface AuthState {
  loading: boolean;
  token: string | null;
  isAdmin: boolean;
}

function stateFrom(user: User | null): AuthState {
  if (user === null || user.expired === true) return { loading: false, token: null, isAdmin: false };
  const groups = (user.profile["cognito:groups"] as string[] | undefined) ?? [];
  return { loading: false, token: user.access_token, isAdmin: groups.includes("admin") };
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ loading: true, token: null, isAdmin: false });

  useEffect(() => {
    let active = true;
    let cleanup = () => {};
    void getManager().then(async (um) => {
      const update = (user: User | null) => {
        if (active) setState(stateFrom(user));
      };
      const unload = () => {
        update(null);
      };
      um.events.addUserLoaded(update);
      um.events.addUserUnloaded(unload);
      cleanup = () => {
        um.events.removeUserLoaded(update);
        um.events.removeUserUnloaded(unload);
      };
      update(await um.getUser());
    });
    return () => {
      active = false;
      cleanup();
    };
  }, []);

  return state;
}
