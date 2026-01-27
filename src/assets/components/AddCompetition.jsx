import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";

const AddCompetition = ({ isOpen, onClose }) => {
  const [competitionData, setCompetitionData] = useState({
    name: "",
    description: "",
    type: "coding",
    privacy: "public",
    passcode: "",
    problemStatement: "",
    rulebook: "",
    submissionRules: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompetitionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Competition Data:", competitionData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent className="p-6 bg-white rounded-lg max-h-[80vh] overflow-hidden">
        <ModalHeader className="text-xl font-bold">Add Competition</ModalHeader>

        <ModalBody className="space-y-4 overflow-y-auto max-h-[60vh] px-2">
          <Input
            label="Competition Name"
            name="name"
            value={competitionData.name}
            onChange={handleChange}
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={competitionData.description}
            onChange={handleChange}
            className="rounded-lg"
            required
          />
          <Select
            label="Competition Type"
            name="type"
            value={competitionData.type}
            onChange={handleChange}
          >
            <SelectItem value="coding">Coding</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
          </Select>

          {/* Normal Radio Buttons with Red Styling */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Privacy</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={competitionData.privacy === "public"}
                  onChange={handleChange}
                  className="w-4 h-4 appearance-none border-2 border-black rounded-full checked:bg-red-500 checked:border-black "
                />
                Public
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={competitionData.privacy === "private"}
                  onChange={handleChange}
                  className="w-4 h-4 appearance-none border-2 border-black rounded-full checked:bg-red-500 checked:border-black "
                />
                Private
              </label>
            </div>
          </div>

          {competitionData.privacy === "private" && (
            <Input
              label="Passcode"
              name="passcode"
              type="password"
              value={competitionData.passcode}
              onChange={handleChange}
            />
          )}

          <Textarea
            label="Problem Statement"
            name="problemStatement"
            value={competitionData.problemStatement}
            onChange={handleChange}
            className="rounded-lg"
            required
          />
          <Textarea
            label="Rule Book"
            name="rulebook"
            value={competitionData.rulebook}
            onChange={handleChange}
            className="rounded-lg"
          />
          <Textarea
            label="Submission Rules"
            name="submissionRules"
            value={competitionData.submissionRules}
            onChange={handleChange}
            className="rounded-lg"
          />
        </ModalBody>

        <ModalFooter>
          <Button className="bg-gray-500 rounded-lg" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-red-500 text-white rounded-lg" onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCompetition;
