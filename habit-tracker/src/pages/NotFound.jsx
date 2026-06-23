import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="page not-found-page">
      <span className="eyebrow">404</span>
      <h1>This streak doesn't exist.</h1>
      <p>The page you're looking for never got checked in. Let's get you back on track.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
