import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

/**
 * The forum is over and its research now lives on Queer Resources. The link
 * that went out still circulates, so this stays a real route (served with a
 * 200) with a short explanation rather than falling through to an S3 error.
 */
export default function Forum() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <PageHead
        title="Page retired"
        description="The forum has finished. Its research is now on the queer resources page."
        path="/forum/"
        noindex
      />
      <h1 className="font-serif text-4xl mb-4">
        Oops, that page doesn&apos;t exist anymore.
      </h1>
      <p className="text-ink/70 mb-6">
        The forum has finished. The research from this page is now on{" "}
        <Link to="/queer-resources" className="text-accent underline">
          Queer Resources
        </Link>
        .
      </p>
      <Link to="/" className="text-accent underline">
        Back to home
      </Link>
    </div>
  );
}
