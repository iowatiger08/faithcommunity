import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/10 bg-paper">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-baseline justify-between">
          <Link to="/" className="text-xl font-serif tracking-tight">
            Hope &amp; Truth Ministry
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link to="/sermons" className="hover:text-accent">Sermons</Link>
            <Link to="/worship-resources" className="hover:text-accent">Worship Resources</Link>
            <Link to="/about" className="hover:text-accent">About</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink/10 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-ink/60">
          <p>
            Sermons and reflections from a progressive mainline ministry.
            {" "}&copy; {new Date().getFullYear()}.
          </p>
        </div>
      </footer>
    </div>
  );
}
