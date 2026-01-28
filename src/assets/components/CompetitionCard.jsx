import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react"; 
import { LockClosedIcon, UserGroupIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { useUser } from "../../context/UserContext";
import { useGlobalStats } from "../../context/GlobalStatsContext";

const CompetitionCard = ({ comp }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUserData, joinedCompetitions } = useUser();
  const { refreshGlobalStats } = useGlobalStats();
  
  const getUserId = () => {
    const uidCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('userID='));
    return uidCookie ? uidCookie.split('=')[1] : null;
  };

  // Check if already joined
  const isAlreadyJoined = joinedCompetitions && joinedCompetitions.includes(comp.id);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleJoinCompetition = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please login to join competitions");
      navigate('/login');
      return;
    }

    if (isAlreadyJoined) {
      toast.info("You've already joined this competition!");
      navigate(`/competition-page/${comp.id}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (comp.isPrivate) {
        if (!selectedFile) {
          toast.error("Please select a file to upload");
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/comp/${comp.id}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error('Failed to register for private competition');
        }
        
        toast.success('Successfully joined private competition!');
        setIsModalOpen(false);
        setSelectedFile(null);
      } else {
        // Add to user's joined competitions
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${userId}/${comp.id}/myJoinComp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to join competition');
        }

        // Also update the competition's participant list
        await fetch(`${import.meta.env.VITE_API_URL}/comp/${comp.id}/participants`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        // Refresh user data to update sidebar stats
        await refreshUserData();
        await refreshGlobalStats();

        toast.success('Successfully joined competition!');
        navigate(`/competition-page/${comp.id}`);
      }
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = () => {
    if (isAlreadyJoined) {
      navigate(`/competition-page/${comp.id}`);
      return;
    }
    
    if (comp.isPrivate) {
      setIsModalOpen(true);
    } else {
      handleJoinCompetition();
    }
  };

  return (
    <>
      <div className="group relative">
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-lg border border-red-900/30 
                        shadow-2xl hover:shadow-red-500/10 transition-all duration-500 overflow-hidden
                        hover:border-red-500/50 transform hover:-translate-y-2">
          
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Private indicator */}
          {comp.isPrivate && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-red-600/20 backdrop-blur-sm rounded-full p-2 border border-red-500/30">
                <LockClosedIcon className="w-5 h-5 text-red-400" />
              </div>
            </div>
          )}

          <div className="p-6 relative z-10">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-100 transition-colors">
                {comp.name}
              </h3>
              <div className="flex items-center text-gray-400 text-sm">
                <UserGroupIcon className="w-4 h-4 mr-1" />
                <span>Admin: {comp.admin}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {comp.description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="w-5 h-5 text-red-400" />
                <span className="text-white font-semibold">
                  {comp.entryFee}
                </span>
                {comp.entryFee === 'Free' && (
                  <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                    FREE
                  </span>
                )}
              </div>

              <button
                onClick={handleJoinClick}
                disabled={loading}
                className={`px-6 py-2 ${isAlreadyJoined 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'} 
                         text-white rounded-lg transition-all duration-300 font-semibold
                         transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg hover:shadow-red-500/25`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Joining...</span>
                  </div>
                ) : isAlreadyJoined ? (
                  'View Competition'
                ) : (
                  'Join Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {comp.isPrivate && (
        <Modal 
          isOpen={isModalOpen} 
          onOpenChange={setIsModalOpen} 
          className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30"
          classNames={{
            backdrop: "bg-black/80 backdrop-blur-sm",
            base: "border border-red-900/30",
            header: "border-b border-red-900/30",
            footer: "border-t border-red-900/30",
          }}
        >
          <ModalContent>
            <ModalHeader className="text-white">
              <div className="flex items-center space-x-2">
                <LockClosedIcon className="w-5 h-5 text-red-400" />
                <span>Private Competition Upload</span>
              </div>
            </ModalHeader>
            <ModalBody className="text-white">
              <p className="text-gray-300 mb-4">
                This is a private competition. Please select a file to upload for review.
              </p>
              <Input 
                type="file" 
                onChange={handleFileChange}
                className="bg-black/50 border-gray-700 text-white"
                classNames={{
                  input: "text-white",
                  inputWrapper: "bg-black/50 border-gray-700 hover:border-red-500 focus-within:border-red-500",
                }}
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="light" 
                onClick={() => {
                  setIsModalOpen(false);
                  setError(null);
                }}
                disabled={loading}
                className="text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleJoinCompetition}
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Upload & Join'
                )}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default CompetitionCard;
