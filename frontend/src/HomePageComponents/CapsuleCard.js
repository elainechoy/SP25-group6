import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';


export default function CapsuleCard() {
    const [capsules, setCapsules] = React.useState([]);

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

    const handleClick = () => {
        console.log("Card clicked! Navigate to capsule details.");
    };

    return (
        <>
            {capsules.map((capsule, index) => (
                <ButtonBase 
                    key={index}
                    onClick={handleClick} 
                    sx={{ width: "100%", display: "block", textAlign: "left", borderRadius: 3 }}
                >
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
                            <Typography sx={{ color: "gray", fontSize: 14, fontWeight: "bold"}}>
                                Unlock on {/* {capsule.description || "Capsule Information"} */}
                                {capsule.unlockDate || "10000000000"}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 1 }}>
                                {capsule.title || "Users Capsule"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: 1, color: "black" }}>
                                Time Left
                            </Typography>
                            <Typography variant="h5" sx={{ paddingTop: 4, color: "red"}}>
                                {capsule.timeLeft || "10000000000"}
                            </Typography>
                        </CardContent>


{/* 
                        <CardContent sx={{ textAlign: "center" }}>
                            <Typography sx={{ color: "gray", fontSize: 14, fontWeight: "bold", textTransform: "uppercase" }}>
                            Users Capsule
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 1 }}>
                            Capsule Information
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: 1, color: "black" }}>
                            Time Left
                            </Typography>
                            <Typography variant="h5" sx={{ paddingTop: 4, color: "red"}}>
                                10000000000
                            </Typography>
                        </CardContent> */}


                    </Card>
                </ButtonBase>
            ))}
        </>
    );
}
