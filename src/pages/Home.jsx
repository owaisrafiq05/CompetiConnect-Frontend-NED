import React, { useState, useEffect } from "react";

import Banner from "../assets/components/Banner";
import Cards from "../assets/components/Cards";
import Title from "../assets/components/Title";
import AddCompetition from "../assets/components/AddCompetition";
import { Button } from "@heroui/react";

const Home = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/comp`);
        if (!response.ok) {
          throw new Error("Failed to fetch competitions");
        }
        const data = await response.json();
        // Transform the API data to match our CompetitionCard props structure
        const transformedData = data.competitions.map((comp) => ({
          id: comp._id,
          name: comp.compName,
          description: comp.compDescription,
          admin: comp.compType,
          entryFee: comp.price === 0 ? "Free" : `$${comp.price}`,
          isPrivate: comp.isPrivate,
        }));
        setCompetitions(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      <Banner />
      <div className="p-6">
        <Title
          subtitle="Join A Competition"
          title="Select a challenge and showcase your skills"
        />
        <Cards competitions={competitions} />
      </div>
    </div>
  );
};

export default Home;
