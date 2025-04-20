import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from '../UserContext.js';
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
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CreateCapsule() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [memberOptions, setMemberOptions] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      const token = localStorage.getItem("authToken");
  
      const capsuleRes = await fetch('http://localhost:5001/api/get_all_capsules', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const userCapsules = await capsuleRes.json();
      const friendEmailsSet = new Set();
      for (const capsule of userCapsules) {
        for (const email of capsule.members) {
          if (email !== user.email) {
            friendEmailsSet.add(email);
          }
        }
      }
      const friendEmails = Array.from(friendEmailsSet);
  
      const friendsInfo = await Promise.all(
        friendEmails.map(async (email) => {
          const friendRes = await fetch(`http://localhost:5001/api/retrieve_user_by_email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          if (!friendRes.ok) return null;
  
          const friendInfo = await friendRes.json();
          return {
            name: friendInfo.username,
            email: friendInfo.email,
          };
        })
      );
  
      const memberOptions = friendsInfo.filter(Boolean);
      setMemberOptions(memberOptions);
    };
  
    fetchFriends();
  }, [user]);

  const handleClickAdd = () => {
    const isValidGmail = /^[^\s@]+@gmail\.com$/.test(newMember.trim());
    if (isValidGmail) {
      handleAddMember(newMember.trim());
      setError(false);
    } else {
      setError(true);
    }
  };

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
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("User not authenticated");
        return;
    }

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
          "Content-Type": "application/json", // Specify content type
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
        body: JSON.stringify(capsuleData),
      });

      console.log("Response Status:", response.status);
      const result = await response.json();
      if (response.ok) {
        alert("Capsule created successfully!");
        navigate("/home");
      } else {
        alert(`${result.message}`); 
      }

    } catch (error) {
      console.error("Error creating capsule:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(to bottom right, #7c3aed, rgb(183, 124, 239), #7c3aed)", }}>
      <Card style={{ width: "100%", maxWidth: 600, padding: 16, boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"}}>
        <CardHeader
          title={<Typography variant="h5" sx={{ color: "#702b9d" , fontWeight: "bold"}}> Create a capsule </Typography>}
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
              <Typography variant="subtitle1" color="#702b9d" >Add Members</Typography>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {/* <TextField
                  label="Enter email address"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  fullWidth
                  variant="outlined"
                /> */}

                <Autocomplete
                  freeSolo
                  options={memberOptions.map((option) => `${option.name} (${option.email})`)}
                  onInputChange={(event, value) => {
                    const emailMatch = value.match(/\(([^)]+)\)$/);
                    setNewMember(emailMatch ? emailMatch[1] : value);
                    setError(false); // reset error while typing
                  }}
                  inputValue={newMember}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Select or enter Gmail" 
                      variant="outlined" 
                      fullWidth 
                      error={error}
                      helperText={error ? "Please enter a valid Gmail address." : ""}
                    />
                  )}
                  sx={{ width: '100%' }}
                />

                <Button 
                  sx={{
                    backgroundColor: 'white',
                    color: '#702b9d',
                    paddingX: 3,
                    paddingY: 1.5,
                    borderRadius: 5,
                    textTransform: 'none',
                    fontSize: 17,
                    '&:hover': { 
                      backgroundColor: '#702b9d', 
                      color: 'white'
                    }
                  }}
                  onClick={handleClickAdd}>
                  Add
                </Button>
              </div>
              <List style={{ marginTop: 16 }}>
                {members.map((member) => (
                  <ListItem
                  key={member}
                  sx={{
                    backgroundColor: "#fbf2ff",
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
              <Button 
                sx={{
                  backgroundColor: 'white',
                  color: '#702b9d',
                  paddingX: 3,
                  paddingY: 1.5,
                  borderRadius: 5,
                  textTransform: 'none',
                  fontSize: 17,
                  '&:hover': { 
                    backgroundColor: '#702b9d', 
                    color: 'white'
                  }
                }}
                onClick={() => navigate("/home")}
              >
                Cancel
              </Button>
              <Button
                sx={{
                  backgroundColor: 'white',
                  color: '#702b9d',
                  paddingX: 3,
                  paddingY: 1.5,
                  borderRadius: 5,
                  textTransform: 'none',
                  fontSize: 17,
                  '&:hover': { 
                    backgroundColor: '#702b9d', 
                    color: 'white'
                  }
                }}
                onClick={handleSubmit}>
                Create Capsule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


