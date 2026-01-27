import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import {
  TrophyIcon,
  UsersIcon,
  ClockIcon,
  DocumentTextIcon,
  BookOpenIcon,
  ChartBarIcon,
  SpeakerWaveIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  PencilIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

const CompetitionPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("problems");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [competition, setCompetition] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [editingPoints, setEditingPoints] = useState({});
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/comp/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch competition data");
        }
        const data = await response.json();
        setCompetition(data.competition);
      } catch (err) {
        setError(err.message);
        toast.error("Error fetching competition data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [id]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/comp/${id}/participants/leaderboard`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const xdata = await response.json();
        setLeaderboard(xdata.participants || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        toast.error("Error fetching leaderboard data");
      }
    };

    if (activeTab === "leaderboard") {
      fetchLeaderboard();
    }
  }, [id, activeTab]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/comp/${id}/announcements`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        toast.error("Error fetching announcements");
      }
    };

    if (activeTab === "announcements") {
      fetchAnnouncements();
    }
  }, [id, activeTab]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/comp/${id}/registrations`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch registrations");
        }
        const data = await response.json();
        setRegistrations(data.registrations);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (activeTab === "applications") {
      fetchRegistrations();
    }
  }, [id, activeTab]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/comp/${id}/submissions`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        toast.error("Error fetching submissions data");
      }
    };

    if (activeTab === "submissions") {
      fetchSubmissions();
    }
  }, [id, activeTab]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    setUploadLoading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Uploading:", selectedFile);
      toast.success("File uploaded successfully!");
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/comp/${id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve user");
      }

      const data = await response.json();
      toast.success(data.message);

      // Refresh the registrations after approval
      const refreshResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/comp/${id}/registrations`
      );
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setRegistrations(refreshData.registrations);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Add function to get current user ID from cookie
  const getCurrentUserId = () => {
    const uidCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('userID='));
    return uidCookie ? uidCookie.split('=')[1] : null;
  };

  // Create tabs array based on user ownership
  const getTabs = () => {
    const baseTabs = [
      { key: "problems", label: "Problems", icon: DocumentTextIcon },
      { key: "rulebook", label: "Rulebook", icon: BookOpenIcon },
      { key: "leaderboard", label: "Leaderboard", icon: ChartBarIcon },
      { key: "announcements", label: "Announcements", icon: SpeakerWaveIcon },
      { key: "submissions", label: "Submissions", icon: PaperAirplaneIcon },
    ];

    const currentUserId = getCurrentUserId();
    
    // Add applications tab only if current user is the owner
    if (competition && currentUserId === competition.compOwnerUserId._id) {
      baseTabs.unshift({ key: "applications", label: "Applications", icon: UserGroupIcon });
    }

    return baseTabs;
  };

  // Add this new function to handle points update
  const handlePointsUpdate = async (submissionId, newPoints) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/comp/${id}/submissions/${submissionId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ points: newPoints }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update points');
      }

      // Update local state
      setSubmissions(submissions.map(sub => 
        sub._id === submissionId ? { ...sub, points: newPoints } : sub
      ));
      setEditingPoints({ ...editingPoints, [submissionId]: false });
      toast.success('Points updated successfully');
    } catch (err) {
      toast.error('Failed to update points');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="font-['Poppins',sans-serif] flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading competition...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-['Poppins',sans-serif] flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-white text-xl mb-2">Error loading competition</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="font-['Poppins',sans-serif] flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">🔍</div>
          <p className="text-white text-xl">Competition not found</p>
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

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-lg border border-red-900/30 p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <TrophyIcon className="w-8 h-8 text-red-400" />
                  <span className="text-red-400 font-medium">Competition</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {competition.compName}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {competition.compDescription}
                </p>
                <div className="flex items-center space-x-6 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-5 h-5" />
                    <span>Admin: {competition.compOwnerUserId.username}</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-80">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                           text-white rounded-lg transition-all duration-300 font-semibold text-lg
                           transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25
                           flex items-center justify-center space-x-2"
                >
                  <CloudArrowUpIcon className="w-6 h-6" />
                  <span>Submit Solution</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative z-10 px-4 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-lg border border-red-900/20 p-2">
            <div className="flex flex-wrap gap-2">
              {getTabs().map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative z-10 px-4 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-lg border border-red-900/30 p-8 shadow-2xl">
            
            {activeTab === "problems" && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <DocumentTextIcon className="w-6 h-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Problem Statement</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {competition.problemStatement}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "rulebook" && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <BookOpenIcon className="w-6 h-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Competition Rules</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {competition.compRuleBook}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "leaderboard" && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <ChartBarIcon className="w-6 h-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
                </div>
                <div className="space-y-4">
                  {leaderboard.length > 0 ? (
                    leaderboard.map((entry, index) => (
                      <div key={entry.participant._id} 
                           className="flex items-center justify-between p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-700 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-white font-medium">{entry.participant.username}</span>
                        </div>
                        <div className="text-red-400 font-bold text-lg">{entry.points} pts</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <ChartBarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No leaderboard data available yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "announcements" && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <SpeakerWaveIcon className="w-6 h-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Announcements</h2>
                </div>
                <div className="space-y-4">
                  {announcements.length > 0 ? (
                    announcements.map((announcement, index) => (
                      <div key={index} className="p-6 bg-black/30 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {competition.compOwnerUserId.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">{competition.compOwnerUserId.username}</p>
                            <p className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{announcement}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <SpeakerWaveIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No announcements yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "applications" && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <UserGroupIcon className="w-6 h-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Applications</h2>
                </div>
                <div className="space-y-4">
                  {registrations.length > 0 ? (
                    registrations.map((registration) => (
                      <div key={registration._id} 
                           className="p-6 bg-black/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {registration.userId.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">{registration.userId.username}</h3>
                                <p className="text-gray-400 text-sm">{registration.userId.email}</p>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{registration.competitionId.compDescription}</p>
                            <p className="text-gray-500 text-xs">
                              Applied on {new Date(registration.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleAccept(registration.userId._id)}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg 
                                     transition-colors font-medium flex items-center space-x-2"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>Accept</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <UserGroupIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No applications yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "submissions" && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <PaperAirplaneIcon className="w-6 h-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Submissions</h2>
                </div>
                <div className="space-y-4">
                  {submissions.length > 0 ? (
                    submissions.map((submission) => (
                      <div key={submission._id} 
                           className="p-6 bg-black/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {submission.userId.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">{submission.userId.username}</h3>
                                <p className="text-gray-400 text-sm">Submission</p>
                              </div>
                            </div>
                            
                            {submission.zipFile ? (
                              <a
                                href={submission.zipFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <EyeIcon className="w-4 h-4" />
                                <span>View Submission</span>
                              </a>
                            ) : (
                              <span className="text-gray-500">No file submitted</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {editingPoints[submission._id] ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  defaultValue={submission.points}
                                  className="w-20 px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white 
                                           focus:outline-none focus:border-red-500"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handlePointsUpdate(submission._id, e.target.value);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    const input = document.querySelector(`input[type="number"]`);
                                    handlePointsUpdate(submission._id, input.value);
                                  }}
                                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg 
                                           transition-colors text-sm font-medium"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  <p className="text-white font-semibold">
                                    {submission.points ?? 'Pending'} {submission.points && 'pts'}
                                  </p>
                                </div>
                                {competition?.compOwnerUserId?._id === getCurrentUserId() && (
                                  <button
                                    onClick={() => setEditingPoints({ 
                                      ...editingPoints, 
                                      [submission._id]: true 
                                    })}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                                             transition-colors"
                                  >
                                    <PencilIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <PaperAirplaneIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No submissions yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-lg p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <CloudArrowUpIcon className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Submit Your Solution</h2>
            </div>
            
            {competition.submissionRules && (
              <div className="mb-6 p-4 bg-black/30 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Submission Guidelines</h3>
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {competition.submissionRules}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select your solution file
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white 
                           focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
                           transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg 
                           file:border-0 file:bg-red-600 file:text-white file:font-medium 
                           hover:file:bg-red-700 file:transition-colors"
                />
              </div>
              {selectedFile && (
                <p className="mt-2 text-sm text-green-400">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedFile(null);
                }}
                disabled={uploadLoading}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                         transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadLoading || !selectedFile}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                         text-white rounded-lg transition-all duration-300 font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {uploadLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-5 h-5" />
                    <span>Upload Solution</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionPage;
