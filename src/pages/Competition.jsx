import React, { useEffect, useState } from "react";
import JoinCard from "../assets/components/JoinCard";

const Competition = () => {
  const [myJoinedCompetitions, setMyJoinedCompetitions] = useState([]);
  const [myCreatedCompetitions, setMyCreatedCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserId = () => {
    const uidCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('userID='));
    return uidCookie ? uidCookie.split('=')[1] : null;
  };

  useEffect(() => {
    const fetchMyJoinedCompetitions = async () => {
      const userId = getUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/user/${userId}/myJoinComp`);
        if (!response.ok) {
          throw new Error('Failed to fetch joined competitions');
        }
        const data = await response.json();
        const competitionIds = data.myJoinComp;

        const competitions = await Promise.all(
          competitionIds.map(async (compId) => {
            const compResponse = await fetch(`http://localhost:5000/comp/${compId}`);
            if (!compResponse.ok) {
              throw new Error('Failed to fetch competition details');
            }
            const compData = await compResponse.json();
            return compData.competition;
          })
        );

        setMyJoinedCompetitions(competitions);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMyCreatedCompetitions = async () => {
      const userId = getUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/user/${userId}/myCreatedComp`);
        if (!response.ok) {
          throw new Error('Failed to fetch created competitions');
        }
        const data = await response.json();
        const competitionIds = data.myCreatedComp;

        const competitions = await Promise.all(
          competitionIds.map(async (compId) => {
            const compResponse = await fetch(`http://localhost:5000/comp/${compId}`);
            if (!compResponse.ok) {
              throw new Error('Failed to fetch competition details');
            }
            const compData = await compResponse.json();
            return compData.competition;
          })
        );

        setMyCreatedCompetitions(competitions);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCompetitions = async () => {
      await Promise.all([fetchMyJoinedCompetitions(), fetchMyCreatedCompetitions()]);
      setLoading(false); // Set loading to false after both fetches
    };

    fetchCompetitions();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">My Competitions</h1>

      <div className="flex flex-wrap gap-6 justify-center lg:justify-between">
        <div className="border border-gray-300 p-4 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold mb-4 text-center lg:text-left">
            My Joined Competitions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : myJoinedCompetitions.length === 0 ? (
              <div className="text-center text-gray-500">No joined competitions found.</div>
            ) : (
              myJoinedCompetitions.map((competition) => (
                <JoinCard key={competition._id} competition={competition} />
              ))
            )}
          </div>
        </div>

        <div className="border border-gray-300 p-4 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold mb-4 text-center lg:text-left">
            My Created Competitions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myCreatedCompetitions.length === 0 ? (
              <div className="text-center text-gray-500">No created competitions found.</div>
            ) : (
              myCreatedCompetitions.map((competition) => (
                <JoinCard key={competition._id} competition={competition} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Competition;
