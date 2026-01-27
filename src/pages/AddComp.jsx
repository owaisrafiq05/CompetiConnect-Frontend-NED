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
  Input,
  Textarea,
} from "@heroui/react"; 

const AddComp = () => {
  const [compData, setCompData] = useState({
    compName: "",
    compDescription: "",
    compType: "",
    isPrivate: false,
    passCode: "",
    problemStatement: "",
    compRuleBook: "",
    submissionRules: "",
  });
  const [competitionTypes, setCompetitionTypes] = useState([]);
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

  useEffect(() => {
    const fetchCompetitionTypes = async () => {
      try {
        const response = await fetch('http://localhost:5000/comp/type');
        if (!response.ok) {
          throw new Error('Failed to fetch competition types');
        }
        const data = await response.json();
        setCompetitionTypes(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchCompetitionTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCompData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAddCompetition = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please login to add competitions");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = {
        compOwnerUserId: userId,
        compName: compData.compName,
        compDescription: compData.compDescription,
        compType: compData.compType,
        isPrivate: compData.isPrivate,
        passCode: compData.isPrivate ? compData.passCode : "",
        problemStatement: compData.problemStatement,
        compRuleBook: compData.compRuleBook,
        submissionRules: compData.submissionRules,
      };

      const response = await fetch('http://localhost:5000/comp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add competition');
      }

      toast.success('Successfully added competition!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster />
      <Card className="w-full bg-dark text-white shadow-lg border-4 border-transparent p-6">
        <CardHeader>
          <h2 className="text-3xl font-bold text-center">Add Competition</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="mb-4">
            <label className="text-sm text-gray-300 mb-1.5 block">Competition Name</label>
            <Input
              type="text"
              name="compName"
              value={compData.compName}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-300 mb-1.5 block">Description</label>
            <Textarea
              name="compDescription"
              value={compData.compDescription}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-300 mb-1.5 block">Competition Type</label>
            <select
              name="compType"
              value={compData.compType}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg text-white py-3 pl-2"
              required
            >
              <option value="">Select Competition Type</option>
              {competitionTypes.map((type) => (
                <option key={type._id} value={type.compTypeName}>
                  {type.compTypeName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPrivate"
                checked={compData.isPrivate}
                onChange={handleChange}
                className="mr-2"
              />
              Private Competition
            </label>
          </div>
          {compData.isPrivate && (
            <div className="mb-4">
              <label className="text-sm text-gray-300 mb-1.5 block">Pass Code (if any)</label>
              <Input
                type="text"
                name="passCode"
                value={compData.passCode}
                onChange={handleChange}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg text-white"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="text-sm text-gray-300 mb-1.5 block">Problem Statement</label>
            <Textarea
              name="problemStatement"
              value={compData.problemStatement}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-300 mb-1.5 block">Competition Rule Book</label>
            <Textarea
              name="compRuleBook"
              value={compData.compRuleBook}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-300 mb-1.5 block">Submission Rules</label>
            <Textarea
              name="submissionRules"
              value={compData.submissionRules}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg text-white"
              required
            />
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          <Button 
            className="bg-red rounded-lg w-full" 
            onClick={handleAddCompetition}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Add Competition'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddComp;
