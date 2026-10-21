/**
 * Cognito auth gate for the private forum-questions view.
 *
 * Reading submitted questions is unlocked only when signed in as one specific
 * Cognito identity in the shared `tigersndragons-users` pool — the same pool,
 * public SPA app client and sign-in used by webtop and the Deutsch app, so
 * there is one password to remember rather than three. SRP auth means the
 * password goes straight to Cognito and never through this site's API.
 *
 * These IDs are not secrets: the pool id and public client id ship in every
 * Cognito SPA's JS bundle, and the allowed `sub` is just an allow-list
 * identifier. The signature on the ID token is what grants access, and the
 * Lambda re-checks both the signature and the `sub` server-side.
 */
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  type CognitoUserSession,
} from "amazon-cognito-identity-js";

const USER_POOL_ID = "us-west-2_OMwj6Yfpn";
const CLIENT_ID = "5p01qepq8kh9qfuji1occiud19";
/** Only this Cognito identity (iowatiger08@gmail.com) may read submissions. */
const ALLOWED_SUB = "c831f380-7071-7082-6ecc-6110e068d744";

const pool = new CognitoUserPool({ UserPoolId: USER_POOL_ID, ClientId: CLIENT_ID });

function subOf(session: CognitoUserSession): string {
  return session.getIdToken().decodePayload().sub as string;
}

/** Sign in with SRP; resolves only if the authenticated user is the allowed one. */
export function signIn(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email.trim(), Pool: pool });
    const details = new AuthenticationDetails({
      Username: email.trim(),
      Password: password,
    });
    user.authenticateUser(details, {
      onSuccess: (session) => {
        if (subOf(session) === ALLOWED_SUB) resolve();
        else {
          user.signOut();
          reject(new Error("That account cannot read the questions."));
        }
      },
      onFailure: (err) => reject(err instanceof Error ? err : new Error(String(err))),
      newPasswordRequired: () =>
        reject(new Error("This account needs a new password — set it in the Cognito console first.")),
    });
  });
}

/**
 * True if there is a valid cached session for the allowed user, so returning to
 * the page on a phone does not mean typing the password again. No network call
 * while the cached token is still valid.
 */
export function currentAllowedUser(): Promise<boolean> {
  return new Promise((resolve) => {
    const user = pool.getCurrentUser();
    if (!user) return resolve(false);
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid()) return resolve(false);
      resolve(subOf(session) === ALLOWED_SUB);
    });
  });
}

export function signOut(): void {
  pool.getCurrentUser()?.signOut();
}

/**
 * The owner's Cognito **ID token** (JWT) for authorizing the listing request,
 * or null if there is no valid session. amazon-cognito-identity-js refreshes it
 * from the refresh token if the access token has expired.
 */
export function getIdToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const user = pool.getCurrentUser();
    if (!user) return resolve(null);
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid() || subOf(session) !== ALLOWED_SUB) {
        return resolve(null);
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}
