import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <PageHead
        title="Not found"
        description="The page you're looking for doesn't exist on this site."
        path="/404/"
      />
      <h1 className="font-serif text-4xl mb-4">Not found</h1>
      <p className="text-ink/70 mb-6">
        The page you&apos;re looking for doesn&apos;t exist on this site.
      </p>
      <Link to="/" className="text-accent underline">
        Back to home
      </Link>
    </div>
  );
}
