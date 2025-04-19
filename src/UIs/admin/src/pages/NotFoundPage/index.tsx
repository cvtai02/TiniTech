import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="home-button">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
