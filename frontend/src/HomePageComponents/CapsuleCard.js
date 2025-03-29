import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import LockIcon from '@mui/icons-material/Lock';
import { Box } from '@mui/material';

import { useNavigate } from "react-router-dom";

export default function CapsuleCard() {
    const [capsules, setCapsules] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchCapsules = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/get_all_capsules');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
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

    return (
        <>
            {capsules.map((capsule, index) => {
                const daysLeft = calculateDaysLeft(capsule.unlockDate);
                const creationDate = new Date(capsule.createdAt).toLocaleDateString();

                let cardContent;
                if (daysLeft > 0) {
                    if (capsule.isSealed) {
                        cardContent = (
                            <ButtonBase
                                key={index}
                                onClick={() => handleClick(capsule.isSealed, capsule.unlockDate, capsule._id.toString())}
                                sx={{ 
                                    width: "100%", 
                                    display: "block", 
                                    textAlign: "left", 
                                    borderRadius: 3,
                                    transition: "all 0.2s ease-in-out", // Smooth transition
                                    '&:active': { 
                                        transform: "scale(0.97)", // Slight shrink effect when clicked
                                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" // Slightly stronger shadow
                                    }
                                }}                            >
                                <Card
                                    sx={{
                                        minWidth: 300,
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        padding: 2,
                                        backgroundColor: "white",
                                        transition: "0.3s",
                                        "&:hover": { boxShadow: 6, backgroundColor: "#f5f5f5" }
                                    }}
                                >
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <Box sx={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)" }}>
                                            <LockIcon sx={{ fontSize: 25, color: "#c95eff" }} />
                                        </Box>

                                        <Typography sx={{ color: "gray", fontSize: 14, fontWeight: "bold"}}>
                                        </Typography>
                                        <Typography variant="h5" sx={{ paddingTop: 4, fontWeight: "bold", marginTop: 1 }}>
                                            {capsule.title || "Users Capsule"}
                                        </Typography>
                                        <Typography variant="body1" sx={{ marginTop: 3, color: "black" }}>
                                            Open in
                                        </Typography>
                                        <Typography variant="h6" sx={{ paddingTop: 1, color: "red"}}>
                                            {daysLeft} days
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </ButtonBase>
                        );
                    } else {
                        cardContent = (
                            <ButtonBase
                                key={index}
                                onClick={() => handleClick(capsule.isSealed, capsule.unlockDate, capsule._id.toString())}
                                sx={{ 
                                    width: "100%", 
                                    display: "block", 
                                    textAlign: "left", 
                                    borderRadius: 3,
                                    // transition: "transform 1s ease-in-out", // Smooth zoom transition
                                    // '&:active': { 
                                    //     transform: "scale(0.97)", // Slight shrink effect when clicked
                                    //     boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" // Slightly stronger shadow
                                    // }
                                }}                                >
                                <Card
                                    sx={{
                                        minWidth: 300,
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        padding: 2,
                                        backgroundColor: "white",
                                        transition: "0.3s",
                                        "&:hover": { boxShadow: 6, backgroundColor: "#f5f5f5" },
                                        // '&.clicked': {
                                        //     // Add a custom animation to simulate opening
                                        //     transform: "scale(1.05)", // Slight expansion
                                        //     opacity: 0.3, // Slight fade effect
                                        //     transition: "transform 10s, opacity 10s", // Smooth transition
                                        // }
                                    }}
                                >
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <Typography sx={{ color: "gray", fontSize: 14, fontWeight: "bold"}}>
                                        </Typography>
                                        <Typography variant="h5" sx={{ paddingTop: 2, fontWeight: "bold", marginTop: 1 }}>
                                            {capsule.title || "Users Capsule"}
                                        </Typography>
                                        <Typography variant="h6" sx={{ marginTop: 3, color: "red" }}>
                                            Ready to seal?
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </ButtonBase>
                        );
                    }
                } else {
                    cardContent = (
                        <ButtonBase
                            key={index}
                            onClick={() => handleClick(capsule.isSealed, capsule.unlockDate, capsule._id.toString())}
                            sx={{ 
                                width: "100%", 
                                display: "block", 
                                textAlign: "left", 
                                borderRadius: 3,
                                '&:active': { 
                                    transform: "scale(0.97)", // Slight shrink effect when clicked
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" // Slightly stronger shadow
                                }
                            }}                            >
                            <Card
                                sx={{
                                    minWidth: 300,
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    padding: 2,
                                    backgroundColor: "white",
                                    transition: "0.3s",
                                    "&:hover": { boxShadow: 6, backgroundColor: "#f5f5f5" }
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <Typography sx={{ color: "green", fontSize: 14, fontWeight: "bold" }}>
                                    </Typography>
                                    <Typography variant="h5" sx={{ paddingTop: 2, fontWeight: "bold", marginTop: 1 }}>
                                        {capsule.title || "Users Capsule"}
                                    </Typography>
                                    <Typography variant="body1" sx={{ marginTop: 3, color: "black" }}>
                                        from
                                    </Typography>
                                    <Typography variant="h6" sx={{ paddingTop: 1, color: "#702b9d" }}>
                                        {creationDate}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </ButtonBase>
                    );
                }

                return (
                    <div key={index}>
                        {cardContent}
                    </div>
                );
            })}
        </>
    );
}