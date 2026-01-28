import { useState, useEffect } from 'react';
import { toast, Toaster } from "sonner";
import { MagnifyingGlassIcon, UsersIcon, ClockIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";

const Explore = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const mockImages = [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop'
    ];

    const controller = new AbortController();

    const fetchCompetitions = async () => {
      try {
        const res = await fetch('http://localhost:5000/comp', { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch competitions');
        const data = await res.json();
        const fetched = (data.competitions || []).map((comp, idx) => ({
          id: comp._id,
          title: comp.compName || 'Untitled Competition',
          description: comp.compDescription || '',
          category: comp.compType?.name || comp.compType || 'General',
          prize: comp.price || 'Free',
          participants: comp.participantCount || 0,
          // Provide a mock future deadline for frontend display
          deadline: new Date(Date.now() + (7 + idx) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          difficulty: ['Beginner', 'Intermediate', 'Advanced'][idx % 3],
          tags: comp.compType ? [comp.compType?.name || comp.compType] : [],
          // Use frontend mock images for now
          image: mockImages[idx % mockImages.length],
          organizer: comp.compOwnerUserId?.username || 'Organizer',
          status: comp.isPrivate ? 'Private' : 'Active'
        }));

        setCompetitions(fetched);
      } catch (err) {
        console.error('Error fetching competitions:', err);
        toast.error('Could not load competitions. Showing no results.');
        setCompetitions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();

    return () => controller.abort();
  }, []);

  const categories = ['all', 'Design', 'Technology', 'Development', 'Data Science', 'Security', 'Gaming'];

  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(id);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/10';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10';
      case 'Advanced': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days left`;
  };

  if (loading) {
    return (
      <div className="font-['Poppins',sans-serif] flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Discovering competitions...</p>
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
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="text-white">Explore </span>
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Competitions
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover amazing competitions, showcase your skills, and compete with talented individuals worldwide
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="relative z-10 px-4 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-lg border border-red-900/20 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar - More Space */}
              <div className="flex-1 lg:flex-[3]">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search competitions, tags, or organizers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white 
                             focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
                             transition-all duration-300 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Category Filter Dropdown */}
              <div className="lg:flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white 
                           focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
                           transition-all duration-300"
                >
                  <option value="all">All Categories</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competition Grid */}
      <div className="relative z-10 px-4 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {filteredCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompetitions.map((competition) => (
                <div key={competition.id} className="group">
                  <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-lg border border-red-900/30 
                                  shadow-2xl hover:shadow-red-500/10 transition-all duration-500 overflow-hidden
                                  hover:border-red-500/50 transform hover:-translate-y-2">
                    
                    {/* Competition Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={competition.image} 
                        alt={competition.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(competition.id)}
                        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full 
                                 hover:bg-black/70 transition-all duration-300"
                      >
                        <HeartIcon 
                          className={`w-5 h-5 ${favorites.has(competition.id) ? 'text-red-500' : 'text-white'}`}
                        />
                      </button>

                      {/* Prize Badge */}
                      <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {competition.prize}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-red-400 text-sm font-medium">{competition.category}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(competition.difficulty)}`}>
                            {competition.difficulty}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-100 transition-colors">
                          {competition.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                          {competition.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {competition.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-800/50 text-gray-300 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <UsersIcon className="w-4 h-4" />
                            <span>{competition.participants.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{formatDeadline(competition.deadline)}</span>
                          </div>
                        </div>
                        <span className="text-gray-500">by {competition.organizer}</span>
                      </div>

                      {/* Action Button */}
                      <button className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                                       text-white rounded-lg transition-all duration-300 font-semibold
                                       transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-red-500/25">
                        Join Competition
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-500 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No competitions found</h3>
              <p className="text-gray-400">Try adjusting your search terms or category filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
