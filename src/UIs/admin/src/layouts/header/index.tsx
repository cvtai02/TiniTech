import React from 'react';
import './header.css'; // Assuming you will style the header in a CSS file.
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-title">Admin Dashboard</div>
      <nav className="header-nav">
        <ul>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/settings">Settings</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/logout">Logout</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
