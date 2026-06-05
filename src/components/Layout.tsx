import { Link, Outlet } from "react-router-dom";
import SeasonBadge from "./SeasonBadge";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/10 bg-paper">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-baseline justify-between flex-wrap gap-3">
          <Link to="/" className="text-xl font-serif tracking-tight">
            Hope &amp; Truth Ministry
          </Link>
          <div className="flex items-center gap-x-6 gap-y-1 flex-wrap">
            <nav className="flex gap-x-6 gap-y-1 text-sm flex-wrap">
              <Link to="/sermons" className="hover:text-accent">Sermons</Link>
              <Link to="/worship-resources" className="hover:text-accent">Worship</Link>
              <Link to="/care" className="hover:text-accent">Care</Link>
              <Link to="/about" className="hover:text-accent">About</Link>
              <Link to="/give" className="hover:text-accent">Give</Link>
              <Link to="/subscribe" className="hover:text-accent">Subscribe</Link>
            </nav>
            <SeasonBadge />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink/10 mt-16 bg-paper">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-ink/60">
            <div>
              <p className="font-medium text-ink/80 mb-2">Hope &amp; Truth Ministry</p>
              <p>
                A congregation of the whole. Open and affirming; wandering
                and welcomed.
              </p>
            </div>
            <div>
              <p className="font-medium text-ink/80 mb-2">Find your way</p>
              <ul className="space-y-1">
                <li><Link to="/sermons" className="hover:text-accent">Sermons</Link></li>
                <li><Link to="/worship-resources" className="hover:text-accent">Worship resources</Link></li>
                <li><Link to="/care" className="hover:text-accent">Care &amp; support</Link></li>
                <li><Link to="/about" className="hover:text-accent">About this ministry</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-ink/80 mb-2">Stay in touch</p>
              <ul className="space-y-1">
                <li><Link to="/subscribe" className="hover:text-accent">Subscribe by email</Link></li>
                <li><Link to="/give" className="hover:text-accent">Give &amp; volunteer</Link></li>
                <li className="text-ink/50">RSS feed &mdash; coming soon</li>
                <li className="text-ink/50">Video reflections &mdash; coming soon</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-ink/50 mt-8">
            &copy; {new Date().getFullYear()} Hope and Truth Ministry. A
            ministry of people here and now.
          </p>
        </div>
      </footer>
    </div>
  );
}
