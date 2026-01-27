import React, { useState, useEffect } from 'react';
import { toast, Toaster } from "sonner";

const Profile = () => {
  const [user, setUser] = useState({
    username: 'JohnDoe',
    email: 'john.doe@example.com',
    joinDate: '2024-01-15',
    competitions: 12,
    wins: 5,
    points: 2450
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user.username,
    email: user.email
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditForm({
        username: user.username,
        email: user.email
      });
    }
  };

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      username: editForm.username,
      email: editForm.email
    }));
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="font-['Poppins',sans-serif] p-4 lg:p-8">
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
        <div className="absolute top-20 right-20 w-64 h-64 bg-red-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-lg border border-red-900/30 p-8 shadow-2xl">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since {new Date(user.joinDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-300">Competitions</span>
                  <span className="text-red-400 font-semibold">{user.competitions}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-300">Wins</span>
                  <span className="text-red-400 font-semibold">{user.wins}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-300">Points</span>
                  <span className="text-red-400 font-semibold">{user.points.toLocaleString()}</span>
                </div>
              </div>

              {/* Win Rate Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Win Rate</span>
                  <span className="text-red-400">{Math.round((user.wins / user.competitions) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(user.wins / user.competitions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Settings */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-lg border border-red-900/30 p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Account Settings</h3>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white 
                               focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
                               transition-all duration-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white">
                      {user.username}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white 
                               focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
                               transition-all duration-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white">
                      {user.email}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                               text-white rounded-lg transition-all duration-300 font-semibold
                               transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-lg border border-red-900/30 p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Won', competition: 'Web Design Challenge', date: '2 days ago', type: 'win' },
                  { action: 'Participated', competition: 'Code Sprint 2024', date: '1 week ago', type: 'participation' },
                  { action: 'Won', competition: 'UI/UX Contest', date: '2 weeks ago', type: 'win' },
                  { action: 'Participated', competition: 'Algorithm Challenge', date: '3 weeks ago', type: 'participation' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${activity.type === 'win' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                      <div>
                        <p className="text-white font-medium">
                          {activity.action} <span className="text-red-400">{activity.competition}</span>
                        </p>
                        <p className="text-gray-400 text-sm">{activity.date}</p>
                      </div>
                    </div>
                    {activity.type === 'win' && (
                      <div className="text-red-400 font-semibold">🏆</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
