
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        GoalInvest Advisor
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/chat">AI Assistant</Link>
        <Link to="/goal-planner">Goal Planner</Link>
        <Link to="/mutual-funds">Mutual Funds</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
