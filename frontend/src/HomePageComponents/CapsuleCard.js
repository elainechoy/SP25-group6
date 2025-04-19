import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import LockIcon from '@mui/icons-material/Lock';
import { Box, Divider } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function CapsuleCard() {
    const [capsules, setCapsules] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchCapsules = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("User not authenticated");
                return;
            }
            try {
                const response = await fetch('http://localhost:5001/api/get_all_capsules', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Network response was not ok');
                }
                const data = await response.json();
                setCapsules(data);
            } catch (error) {
                console.error("Error fetching capsules:", error);
            }
        };

        fetchCapsules();
    }, []);

    const calculateDaysLeft = (unlockDate) => {
        const today = new Date();
        const targetDate = new Date(unlockDate);
        const diffTime = targetDate - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return daysLeft > 0 ? daysLeft : 0;
    };

    const passToday = (unlockDate) => {
        const today = new Date();
        const targetDate = new Date(unlockDate);
        return targetDate < today;
    };

    const handleClick = (isSealed, unlockDate, capsuleId) => {
        if (passToday(unlockDate)) {
            navigate("/capsule", { state: { capsuleId } })
        } else {
            if (!isSealed) {
                navigate("/edit-capsule", { state: { capsuleId } })
            } else {
                alert("Capsule is sealed")
            }
        }
    };

    // Split capsules into categories
    const sealedCapsules = capsules.filter(c => c.isSealed && calculateDaysLeft(c.unlockDate) > 0);
    const unsealedCapsules = capsules.filter(c => !c.isSealed && calculateDaysLeft(c.unlockDate) > 0);
    const unlockedCapsules = capsules.filter(c => passToday(c.unlockDate));

    const renderCapsules = (capsuleList) => capsuleList.map((capsule, index) => {
        const daysLeft = calculateDaysLeft(capsule.unlockDate);
        const creationDate = new Date(capsule.createdAt).toLocaleDateString();

        // Unlocked capsules
        if (passToday(capsule.unlockDate)) {
            return (
                <ButtonBase key={index} onClick={() => handleClick(capsule.isSealed, capsule.unlockDate, capsule._id.toString())}
                    sx={{ width: "100%", display: "block", textAlign: "left", borderRadius: 3 }}>
                    <Card sx={{ minWidth: 300, borderRadius: 3, boxShadow: 3, padding: 2, backgroundColor: "#f5f5f5", mb: 2 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                {capsule.title || "Users Capsule"}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                from
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 1, color: "#702b9d" }}>
                                {creationDate}
                            </Typography>
                        </CardContent>
                    </Card>
                </ButtonBase>
            );
        }

        // Sealed capsules
        if (capsule.isSealed) {
            return (
                <ButtonBase key={index} onClick={() => handleClick(capsule.isSealed, capsule.unlockDate, capsule._id.toString())}
                    sx={{ width: "100%", display: "block", textAlign: "left", borderRadius: 3 }}>
                    <Card sx={{ minWidth: 300, borderRadius: 3, boxShadow: 3, padding: 2, backgroundColor: "#f5f5f5", mb: 2 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Box sx={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)" }}>
                                <LockIcon sx={{ fontSize: 25, color: "#c95eff" }} />
                            </Box>
                            <Typography variant="h5" sx={{ paddingTop: 4, fontWeight: "bold", mt: 1 }}>
                                {capsule.title || "Users Capsule"}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 3 }}>
                                Open in
                            </Typography>
                            <Typography variant="h6" sx={{ pt: 1, color: "red" }}>
                                {daysLeft} days
                            </Typography>
                        </CardContent>
                    </Card>
                </ButtonBase>
            );
        }

        // Unsealed capsules
        return (
            <ButtonBase key={index} onClick={() => handleClick(capsule.isSealed, capsule.unlockDate, capsule._id.toString())}
                sx={{ width: "100%", display: "block", textAlign: "left", borderRadius: 3 }}>
                <Card sx={{
                    minWidth: 300,
                    borderRadius: 3,
                    padding: 2,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 6, backgroundColor: "#f5f5f5" },
                    backgroundColor: '#f5f5f5)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 0 50px 40px rgba(255, 255, 255, 0.05)',
                    mb: 2
                }}>
                    <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h5" sx={{ paddingTop: 2, fontWeight: "bold", mt: 1 }}>
                            {capsule.title || "Users Capsule"}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 3, color: "red" }}>
                            Ready to seal?
                        </Typography>
                    </CardContent>
                </Card>
            </ButtonBase>
        );
    });

    return (
        <Box sx={{ display: 'flex', gap: 2, padding: 2 }}>
            {/* Unlocked */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                📬 Unlocked Capsules
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ maxHeight: '75vh', overflowY: 'auto', pr: 1 }}>
                {renderCapsules(unlockedCapsules)}
                </Box>
            </Box>

            {/* Sealed */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                🔒 Sealed Capsules
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ maxHeight: '75vh', overflowY: 'auto', pr: 1 }}>
                {renderCapsules(sealedCapsules)}
                </Box>
            </Box>
      
          {/* Unsealed */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              📝 Unsealed Capsules
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ maxHeight: '75vh', overflowY: 'auto', pr: 1 }}>
              {renderCapsules(unsealedCapsules)}
            </Box>
          </Box>
        </Box> 
      );
}
