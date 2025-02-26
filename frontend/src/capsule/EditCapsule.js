import * as React from 'react';
import AppHeader from '../HomePageComponents/AppHeader';
import { Box, Button } from '@mui/material';
import LetterCard from './LetterCard.js';


export default function EditCapsule() {
    

  return (
    <>
        <AppHeader />
        <Box sx={{ display: 'flex', gap: 2, m: 4 }}> {/* Flex container */}
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
    </>
  );
}

{/* 
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

<Box sx={{ width: '100%' }}>
<Tabs
  value={value}
  onChange={handleChange}
  textColor="secondary"
  indicatorColor="secondary"
  aria-label="secondary tabs example"
>
  <Tab value="one" label="Item One" />
  <Tab value="two" label="Item Two" />
  <Tab value="three" label="Item Three" />
</Tabs>
</Box> */}
