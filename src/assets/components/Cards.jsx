import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import CompetitionCard from "./CompetitionCard";

const Cards = ({ competitions }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompetitions = competitions.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="flex items-center w-full max-w-full mb-6">
        <div className="relative flex-grow mb-1">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-red-800"
          />
        </div>
        <button className="bg-red focus:outline-none ring-1 ring-red-800 text-white px-6 py-2 mb-1 rounded-r-lg">
          Search
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompetitions.length > 0 ? (
          filteredCompetitions.map((comp) => <CompetitionCard key={comp.id} comp={comp} />)
        ) : (
          <p className="text-gray-500 col-span-full text-center">No competitions found.</p>
        )}
      </div>
    </div>
  );
};

export default Cards;
