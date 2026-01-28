import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const GlobalStatsContext = createContext(null);

export const useGlobalStats = () => {
  const context = useContext(GlobalStatsContext);
  if (!context) {
    throw new Error('useGlobalStats must be used within a GlobalStatsProvider');
  }
  return context;
};

export const GlobalStatsProvider = ({ children }) => {
  const [globalStats, setGlobalStats] = useState({
    totalCompetitions: 0,
    totalParticipants: 0,
    trendingCompetitions: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchGlobalStats = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/comp`);
      const competitions = response.data?.competitions || [];
      
      // Calculate total competitions
      const totalCompetitions = competitions.length;
      
      // Calculate total participants across all competitions
      const totalParticipants = competitions.reduce((sum, comp) => {
        return sum + (comp.participantCount || comp.participants?.length || 0);
      }, 0);
      
      // Count trending (competitions with > 5 participants or recent ones)
      const trendingCompetitions = competitions.filter(comp => {
        const participantCount = comp.participantCount || comp.participants?.length || 0;
        const isRecent = new Date(comp.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return participantCount > 5 || isRecent;
      }).length;

      setGlobalStats({
        totalCompetitions,
        totalParticipants,
        trendingCompetitions
      });
    } catch (error) {
      console.error('Error fetching global stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  const refreshGlobalStats = useCallback(() => {
    return fetchGlobalStats();
  }, [fetchGlobalStats]);

  const value = {
    globalStats,
    loading,
    refreshGlobalStats
  };

  return (
    <GlobalStatsContext.Provider value={value}>
      {children}
    </GlobalStatsContext.Provider>
  );
};

export default GlobalStatsContext;
