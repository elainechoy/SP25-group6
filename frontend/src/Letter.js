import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import jsPDF from 'jspdf';
import './LetterEditor.css';
import AppHeader from './HomePageComponents/AppHeader';


export default function LetterEditor() {
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [background, setBackground] = useState('#ffffff');
    const [formats, setFormats] = useState([]);

    const handleFormat = (event, newFormats) => {
        setFormats(newFormats);
    };

    const generatePDFAndSubmit = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("User not authenticated");
                return;
            }
            const doc = new jsPDF();
            const formattedText = text;
            doc.setFillColor(background);
            doc.rect(0, 0, 210, 297, 'F');
            doc.setFontSize(12);
            if (formats.includes('bold')) doc.setFont(undefined, 'bold');
            if (formats.includes('italic')) doc.setFont(undefined, 'italic');
    
            const lines = doc.splitTextToSize(formattedText, 180);
            doc.text(lines, 10, 20);
    
            const pdfBlob = doc.output('blob');
            const formData = new FormData();
            formData.append('file', pdfBlob, `${title || 'letter'}.pdf`);
            formData.append('title', title);
    
            const response = await fetch('http://localhost:5001/api/upload-pdf', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert('PDF uploaded successfully with ID: ' + data.fileId);
            } else {
                alert('Error uploading PDF');
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
            alert('Error uploading PDF');
        }
    };
    

    const getStyle = () => {
        return {
            fontWeight: formats.includes('bold') ? 'bold' : 'normal',
            fontStyle: formats.includes('italic') ? 'italic' : 'normal',
            backgroundColor: background,
            width: '100%',
            minHeight: '300px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            outline: 'none',
            resize: 'none',
            fontSize: '16px'
        };
    };

    return (
        <>
         <AppHeader />
      
        <Box className="letter-editor-container">
           
        <Box  className="letter-editor-box" sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>Write Your Letter</Typography>

            <TextField
                fullWidth
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Box display="flex" gap={2} alignItems="center" mb={2}>
                <ToggleButtonGroup
                    value={formats}
                    onChange={handleFormat}
                    aria-label="text formatting"
                    size="small"
                >
                    <ToggleButton value="bold" aria-label="bold">
                        <FormatBoldIcon />
                    </ToggleButton>
                    <ToggleButton value="italic" aria-label="italic">
                        <FormatItalicIcon />
                    </ToggleButton>
                </ToggleButtonGroup>

                <Select
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    displayEmpty
                    size="small"
                >
                    <MenuItem value="#ffffff">White</MenuItem>
                    <MenuItem value="#f0f0f0">Light Grey</MenuItem>
                    <MenuItem value="#fff99c">Yellow</MenuItem>
                    <MenuItem value="#c8e6c9">Green</MenuItem>
                    <MenuItem value="#bbdefb">Blue</MenuItem>
                    <MenuItem value="#eabfff">Purple</MenuItem>
                    <MenuItem value="#ffc3ec">Pink</MenuItem>
                </Select>
            </Box>

            <textarea
                style={getStyle()}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing your letter here..."
            />

            <Button
                variant="contained"
                //color="primary"
                fullWidth
                onClick={generatePDFAndSubmit}
                sx={{ mt: 2,  backgroundColor: '#c95eff', '&:hover': { backgroundColor: '#d98eff'}}}
            >
                Submit Letter to Database
            </Button>
        </Box>
        </Box>
        </>
    );
}
