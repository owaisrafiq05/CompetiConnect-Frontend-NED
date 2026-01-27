import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Input,
} from "@heroui/react"; 
import { LockClosedIcon } from "@heroicons/react/24/solid";
import PropTypes from 'prop-types';

const JoinCard = ({ competition }) => {
  const [passCode, setPassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!competition) {
    return null;
  }

  const handleJoinCompetition = async () => {
    setLoading(true);

    if (competition.isPrivate && passCode !== competition.passCode) {
      toast.error("Invalid passcode. Please try again.");
      setLoading(false);
      return;
    }

    toast.success("Successfully joined the competition!");
    setPassCode("");
    setLoading(false);
    navigate(`/competition-page/${competition._id}`);
  };

  const handleJoinClick = () => {
    handleJoinCompetition();
  };

  return (
    <>
      <Card className="relative min-h-[280px] max-w-[350px] bg-dark text-white shadow-lg border-4 border-transparent animate-border rounded-xl 
        transition-all duration-300 ease-in-out hover:shadow-[0px_0px_20px_rgba(255,255,255,0.7)] hover:scale-105 p-4">
      
        {competition.isPrivate && (
          <LockClosedIcon className="w-6 h-6 text-red-500 absolute top-3 right-3" />
        )}

        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-bold">{competition.compName}</p>
            <p className="text-sm text-gray-400">Admin: {competition.compOwnerUserId.username}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className="text-sm">{competition.compDescription}</p>
          {competition.isPrivate && (
            <Input
              type="text"
              placeholder="Enter passcode"
              value={passCode}
              onChange={(e) => setPassCode(e.target.value)}
              className="mt-2"
            />
          )}
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm font-semibold">
            Entry Fee: <span className="text-red font-bold text-md">{competition.price === 0 ? "Free" : competition.price}</span>
          </p>
          <Button onClick={handleJoinClick} className="bg-blue-500 text-white rounded-lg">
            {competition.isPrivate ? "Join Private" : "Join"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

JoinCard.propTypes = {
  competition: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    compName: PropTypes.string.isRequired,
    compDescription: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    price: PropTypes.number.isRequired,
    passCode: PropTypes.string,
    compOwnerUserId: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default JoinCard;
