import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CreateCapsule() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const navigate = useNavigate();

  const handleAddMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (email) => {
    setMembers(members.filter((member) => member !== email));
  };

  const handleSubmit = async () => {
    if (!title || !description || !unlockDate) {
      alert("Please fill in all required fields.");
      return;
    }

    if(unlockDate < today) {
      alert("Unlock date cannot be in the past.");
      return;
    }

    const capsuleData = {
      title,
      description,
      unlockDate,
      members,
    };

    try {
      const response = await fetch("http://localhost:5001/api/create_capsule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(capsuleData),
      });
      console.log("Response Status:", response.status);
      const errorMessage = await response.text();
      console.log("Error Message:", errorMessage);

      if (response.ok) {
        alert("Capsule created successfully!");
        navigate("/home");
      } else {
        alert("Failed to create capsule.");
      }

    } catch (error) {
      console.error("Error creating capsule:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Card style={{ width: "100%", maxWidth: 600, padding: 16, boxShadow: "0px 4px 10px rgba(0,0,0,0.2)", backgroundColor: "#fbf2ff"}}>
        <CardHeader
          title={<Typography variant="h5">Create your capsule!</Typography>}
        />
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Title Input */}
            <TextField
              label="Title*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
            />

            {/* Description Input */}
            <TextField
              label="Description*"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
            />

            {/* Unlock Date Input */}
            <TextField
                label="Unlock Date*"
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                fullWidth
                variant="outlined"
                inputProps={{ min: today }}
                sx={{
                    '& .MuiInputLabel-root': {
                    transform: 'translate(14px, 20px) scale(1)', // Ensures label is correctly positioned for date inputs
                    },
                    '& .MuiInputBase-root': {
                    padding: '16.5px 14px', // Adjust padding if needed for consistency with date input
                    },
                }}
            />

            {/* Add Members */}
            <div>
              <Typography variant="subtitle1">Add Members</Typography>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <TextField
                  label="Enter email address"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <Button variant="contained" sx={{color: "white", backgroundColor: '#c95eff'}} onClick={handleAddMember}>
                  Add
                </Button>
              </div>
              <List style={{ marginTop: 16 }}>
                {members.map((member) => (
                  <ListItem
                  key={member}
                  sx={{
                    backgroundColor: "#eabfff",
                    marginBottom: 1,
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between', // Spaces out the text and the icon button
                    alignItems: 'center', // Centers content vertically
                  }}
                >
                  <ListItemText primary={member} />
                  <IconButton edge="end" onClick={() => handleRemoveMember(member)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItem>
                ))}
              </List>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button sx={{ borderColor: '#c95eff', color: '#c95eff'}} onClick={() => navigate("/home")}>
                Cancel
              </Button>
              <Button variant="contained" sx={{color: "white", backgroundColor: '#c95eff'}} onClick={handleSubmit}>
                Create Capsule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


