import React from 'react';
import { TrophyIcon, UsersIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const Banner = ({ 
  title = "Join the Competition Revolution",
  subtitle = "Discover, compete, and win in the most exciting competitions worldwide",
  showCTA = true,
  ctaText = "Explore Competitions",
  ctaLink = "/explore"
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-red-900/20 to-gray-900 rounded-2xl border border-red-900/30">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-gray-300 text-lg max-w-xl">
              {subtitle}
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
              <div className="flex items-center space-x-2">
                <TrophyIcon className="w-5 h-5 text-red-400" />
                <span className="text-white font-semibold">100+ Competitions</span>
              </div>
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Active Community</span>
              </div>
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">Win Prizes</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          {showCTA && (
            <div className="flex-shrink-0">
              <Link
                to={ctaLink}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 
                         hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-300 
                         font-semibold text-lg transform hover:scale-105 active:scale-95 
                         shadow-lg hover:shadow-red-500/25"
              >
                {ctaText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
