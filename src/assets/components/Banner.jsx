import React from 'react';
import '../css/Banner.css'; // Importing the external CSS file

const Banner = () => {
  return (
    <div className="banner-container bg-gray-900">
      {/* Overlay for better readability */}
      <div className="banner-overlay"></div>

      {/* Content */}
      <div className="banner-content">
        <h1 className="banner-heading">Join & Host Exciting Competitions!</h1>
        <p className="banner-subheading">
          Discover, participate, and compete in global competitions across multiple fields.
        </p>
      </div>
    </div>
  );
};

export default Banner;
