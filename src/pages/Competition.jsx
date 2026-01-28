import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  TrophyIcon,
  PlusIcon,
  UserGroupIcon,
  StarIcon,
  EyeIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

const Competition = () => {
  const [myJoinedCompetitions, setMyJoinedCompetitions] = useState([]);
  const [myCreatedCompetitions, setMyCreatedCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('joined');
  const navigate = useNavigate();

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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${userId}/myJoinComp`);
        if (!response.ok) {
          throw new Error('Failed to fetch joined competitions');
        }
        const data = await response.json();
        const competitionIds = data.myJoinComp;

        const competitions = await Promise.all(
          competitionIds.map(async (compId) => {
            const compResponse = await fetch(`${import.meta.env.VITE_API_URL}/comp/${compId}`);
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
        toast.error('Failed to load joined competitions');
      }
    };

    const fetchMyCreatedCompetitions = async () => {
      const userId = getUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${userId}/myCreatedComp`);
        if (!response.ok) {
          throw new Error('Failed to fetch created competitions');
        }
        const data = await response.json();
        const competitionIds = data.myCreatedComp;

        const competitions = await Promise.all(
          competitionIds.map(async (compId) => {
            const compResponse = await fetch(`${import.meta.env.VITE_API_URL}/comp/${compId}`);
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
        toast.error('Failed to load created competitions');
      }
    };

    const fetchCompetitions = async () => {
      await Promise.all([fetchMyJoinedCompetitions(), fetchMyCreatedCompetitions()]);
      setLoading(false);
    };

    fetchCompetitions();
  }, []);

  const CompetitionCard = ({ competition, isOwner = false }) => (
    <div className="group">
      <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-lg border border-red-900/30 
                      shadow-2xl hover:shadow-red-500/10 transition-all duration-500 overflow-hidden
                      hover:border-red-500/50 transform hover:-translate-y-2">
        
        {/* Card Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-100 transition-colors line-clamp-2">
                {competition.compName}
              </h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {competition.compDescription}
              </p>
            </div>
            {isOwner && (
              <div className="bg-red-600/20 backdrop-blur-sm rounded-full px-3 py-1 border border-red-500/30">
                <span className="text-red-400 text-xs font-medium">Owner</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <UserGroupIcon className="w-4 h-4" />
              <span>Type: {competition.compType}</span>
            </div>
            {competition.isPrivate && (
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>Private</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {competition.participants?.length || 0}
                </div>
                <div className="text-xs text-gray-500">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {competition.submissions?.length || 0}
                </div>
                <div className="text-xs text-gray-500">Submissions</div>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/competition-page/${competition._id}`)}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                       text-white rounded-lg transition-all duration-300 font-medium
                       transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25
                       flex items-center space-x-2"
            >
              <EyeIcon className="w-4 h-4" />
              <span>View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="font-['Poppins',sans-serif] flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your competitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-['Poppins',sans-serif]">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #dc2626',
          },
        }}
      />
      
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-20 pb-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <TrophyIcon className="w-12 h-12 text-red-400" />
              <h1 className="text-5xl font-bold text-white">
                My <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Competitions</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage and track your competition journey - both as a participant and creator
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-lg border border-red-900/20 p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">{myJoinedCompetitions.length}</div>
              <div className="text-gray-400">Joined Competitions</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-lg border border-red-900/20 p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{myCreatedCompetitions.length}</div>
              <div className="text-gray-400">Created Competitions</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-lg border border-red-900/20 p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{myJoinedCompetitions.length + myCreatedCompetitions.length}</div>
              <div className="text-gray-400">Total Competitions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative z-10 px-4 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-lg border border-red-900/20 p-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('joined')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'joined'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <UserGroupIcon className="w-5 h-5" />
                <span>Joined Competitions</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{myJoinedCompetitions.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('created')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'created'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <StarIcon className="w-5 h-5" />
                <span>Created Competitions</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{myCreatedCompetitions.length}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'joined' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Joined Competitions</h2>
                <button
                  onClick={() => navigate('/explore')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                           text-white rounded-lg transition-all duration-300 font-medium
                           transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/25
                           flex items-center space-x-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Join More</span>
                </button>
              </div>
              
              {myJoinedCompetitions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {myJoinedCompetitions.map((competition) => (
                    <CompetitionCard key={competition._id} competition={competition} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <UserGroupIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No Joined Competitions</h3>
                  <p className="text-gray-400 mb-6">You haven't joined any competitions yet</p>
                  <button
                    onClick={() => navigate('/explore')}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                             text-white rounded-lg transition-all duration-300 font-semibold text-lg
                             transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25
                             flex items-center space-x-2 mx-auto"
                  >
                    <PlusIcon className="w-6 h-6" />
                    <span>Explore Competitions</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'created' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Created Competitions</h2>
                <button
                  onClick={() => navigate('/add-comp')}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
                           text-white rounded-lg transition-all duration-300 font-medium
                           transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/25
                           flex items-center space-x-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Create New</span>
                </button>
              </div>
              
              {myCreatedCompetitions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {myCreatedCompetitions.map((competition) => (
                    <CompetitionCard key={competition._id} competition={competition} isOwner={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <StarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No Created Competitions</h3>
                  <p className="text-gray-400 mb-6">You haven't created any competitions yet</p>
                  <button
                    onClick={() => navigate('/add-comp')}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                             text-white rounded-lg transition-all duration-300 font-semibold text-lg
                             transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25
                             flex items-center space-x-2 mx-auto"
                  >
                    <PlusIcon className="w-6 h-6" />
                    <span>Create Competition</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Competition;
