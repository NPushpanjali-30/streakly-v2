import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/habits", label: "My Habits" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C9 6 6 9 6 13a6 6 0 0012 0c0-2-1-3.5-2-4.5.3 2-.7 3-1.5 2.5C15 9.5 14 7 12 2z"
              fill="currentColor"
            />
          </svg>
          <span>Streakly</span>
        </NavLink>

        <nav className="navbar-links navbar-links-desktop">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                "navbar-link" + (isActive ? " active" : "")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className={"hamburger" + (open ? " open" : "")}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className={"navbar-links-mobile" + (open ? " open" : "")}>
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              "navbar-link" + (isActive ? " active" : "")
            }
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
