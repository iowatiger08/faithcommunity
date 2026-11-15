import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHead from "~/components/PageHead";
import { completeSignIn } from "~/lib/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    completeSignIn().then(
      (returnTo) => navigate(returnTo, { replace: true }),
      () => setFailed(true),
    );
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <PageHead title="Signing in" path="/auth/callback/" noindex />
      {failed ? (
        <>
          <h1 className="font-serif text-3xl mb-4">Sign-in didn&apos;t finish</h1>
          <p className="text-ink/80">
            The sign-in link may have expired. Go back to the post and choose Sign in again.
          </p>
          <Link to="/" className="text-accent underline mt-4 inline-block">
            Home
          </Link>
        </>
      ) : (
        <p className="text-ink/70">Signing you in…</p>
      )}
    </div>
  );
}
