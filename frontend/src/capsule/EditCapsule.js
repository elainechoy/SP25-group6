import * as React from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box, Button } from '@mui/material';
import LetterCard from './LetterCard.js';
import { useNavigate, useLocation } from 'react-router-dom';


export default function EditCapsule() {
    const navigate = useNavigate()
    const location = useLocation();
    const capsuleId = location.state?.capsuleId;

    // // fetch capsule info
    // const [capsule, setCapsule] = useState("");
    // console.log(capsule); //placeholder

    // React.useEffect(() => {
    //     const fetchCapsules = async () => {
    //         try {
    //             const response = await fetch('http://localhost:5001/api/get_capsule', {
    //                 method: "POST",
    //                 headers: {
    //                   "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(capsuleId),
    //               });

    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setCapsule(data);

    //         } catch (error) {
    //             console.error("Error fetching capsules:", error);
    //         }
    //     };

    //     fetchCapsules();
    // }, []);
    

    const sealCapsule = async () => {
        const capsuleData = {capsuleId};

        try {
            const response = await fetch("http://localhost:5001/api/seal_capsule", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(capsuleData),
            });
      
            if (response.ok) {
              alert("Capsule sealed!");
              navigate("/home");
            } else {
              alert("Failed to seal capsule.");
            }
      
          } catch (error) {
            console.error("Error sealing capsule:", error);
            alert("An error occurred. Please try again.");
          }
    };

    return (
    <>
        <AppHeader />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 4 }}>
            {/* Capsule Name and Seal Capsule Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* <TextField 
                    label="Capsule Name" 
                    variant="outlined" 
                    sx={{ width: '30%' }}
                /> */}
                capsule name
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick = {sealCapsule}
                >
                    Seal Capsule
                </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                <Box component="section" sx={{ p: 2, border: '1px solid black', width: '30%' }}>
                    This box is for friends
                </Box>

                <Box component="section" sx={{ display: 'flex', flexDirection: 'column', p: 2, width: '30%', border: "1px solid black", alignItems: "center", justifyContent: 'center' }}>
                    Letters
                    <LetterCard />
                    <Button 
                    sx={{ backgroundColor: "pink" }}
                    >
                    Write a Letter
                    </Button>
                </Box>

                <Box component="section" sx={{ p: 2, border: '1px solid black', width: '30%' }}>
                    This box is for displaying images
                </Box>
            </Box>

        </Box>
    </>
  );
}