/**
 * Sign-in for the moderation page, using the owner's existing account in the
 * shared `tigersndragons-users` pool (the same one webtop and the Deutsch app
 * use), so there is no separate moderator account. Commenters sign in through
 * their own pool in `auth.ts`.
 *
 * SRP auth sends the password straight to the sign-in service, never to this
 * site's API. The pool id, public client id and allowed `sub` are not secrets;
 * the API's authorizer checks the token signature and the Lambda re-checks the
 * `sub`, because the pool has other users.
 */
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  type CognitoUserSession,
} from "amazon-cognito-identity-js";

const USER_POOL_ID = "us-west-2_OMwj6Yfpn";
const CLIENT_ID = "5p01qepq8kh9qfuji1occiud19";
const OWNER_SUB = "c831f380-7071-7082-6ecc-6110e068d744";

const pool = new CognitoUserPool({ UserPoolId: USER_POOL_ID, ClientId: CLIENT_ID });

function subOf(session: CognitoUserSession): string {
  return session.getIdToken().decodePayload().sub as string;
}

/** Sign in; resolves only if the account is the owner's. */
export function signIn(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email.trim(), Pool: pool });
    const details = new AuthenticationDetails({ Username: email.trim(), Password: password });
    user.authenticateUser(details, {
      onSuccess: (session) => {
        if (subOf(session) === OWNER_SUB) resolve();
        else {
          user.signOut();
          reject(new Error("This page is for moderators."));
        }
      },
      onFailure: (err) => reject(err instanceof Error ? err : new Error(String(err))),
      newPasswordRequired: () => reject(new Error("This account needs a new password before it can sign in here.")),
    });
  });
}

/** The owner's ID token, or null without a valid cached session. Refreshes as needed. */
export function getIdToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const user = pool.getCurrentUser();
    if (!user) return resolve(null);
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid() || subOf(session) !== OWNER_SUB) return resolve(null);
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

export function signOut(): void {
  pool.getCurrentUser()?.signOut();
}
