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
import { LockClosedIcon } from "@heroicons/react/24/solid";

const CompetitionCard = ({ comp }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const getUserId = () => {
    const uidCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('userID='));
    return uidCookie ? uidCookie.split('=')[1] : null;
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleJoinCompetition = async () => {
    const userId = getUserId();
    console.log(userId);
    if (!userId) {
      toast.error("Please login to join competitions");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (comp.isPrivate) {
        if (!selectedFile) {
          toast.error("Please select a file to upload");
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/comp/${comp.id}/participants`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error('Failed to join public competition');
        }

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
    if (comp.isPrivate) {
      setIsModalOpen(true);
    } else {
      handleJoinCompetition();
    }
  };

  return (
    <>
      
      <Card className="relative min-h-[280px] max-w-[350px] bg-dark text-white shadow-lg border-4 border-transparent animate-border rounded-xl 
        transition-all duration-300 ease-in-out hover:shadow-[0px_0px_20px_rgba(255,255,255,0.7)] hover:scale-105 p-4">
      
        
        {comp.isPrivate && (
          <LockClosedIcon className="w-6 h-6 text-red-500 absolute top-3 right-3" />
        )}

        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-bold">{comp.name}</p>
            <p className="text-sm text-gray-400">Admin: {comp.admin}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className="text-sm">{comp.description}</p>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm font-semibold">
            Entry Fee: <span className="text-red font-bold text-md">{comp.entryFee}</span>
          </p>
          <Button 
            className="bg-red rounded-lg" 
            onClick={handleJoinClick}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Join Now'}
          </Button>
        </CardFooter>
      </Card>
      
      {comp.isPrivate && (
        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} className="bg-white rounded-lg">
          <ModalContent>
            <ModalHeader>Upload Your File</ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-600 mb-3">Please select a file to upload for this competition.</p>
              <Input 
                type="file" 
                onChange={handleFileChange} 
                className="border border-gray-300 rounded-md p-2 w-full" 
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
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
              >
                Cancel
              </Button>
              <Button 
                className="bg-red rounded-lg text-white"
                onClick={handleJoinCompetition}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Upload & Join'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default CompetitionCard;
