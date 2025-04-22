import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, Box, Typography, ToggleButtonGroup, ToggleButton, IconButton } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import jsPDF from 'jspdf';
import './LetterEditor.css';
import AppHeader from './HomePageComponents/AppHeader';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from './UserContext.js'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import paperTexture from './assets/worn-paper.jpg';
import texture from './assets/texture.jpg';
import butterfly from './assets/butterfly.png';
import wrinkle from './assets/wrinkle-paper.jpg';
import { API_URL } from './config.js'



export default function LetterEditor() {
    const { capsuleId } = useParams();
    const { user } = useContext(UserContext);

    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [background, setBackground] = useState('#ffffff');
    const [formats, setFormats] = useState([]);

    // body‐color state
    const [envelopeColor, setEnvelopeColor] = useState('#FFFFFF');
    // flap‐color will be derived from envelopeColor
    const [flapColor, setFlapColor] = useState('#F7F7F7');

    // whenever the body‐color changes, set a matching flap‐color
    useEffect(() => {
        switch (envelopeColor) {
            case '#FFFFFF': setFlapColor('#F7F7F7'); setEnvelopeColor("#FFFFFF"); break; //white
            case '#FFB6C1': setFlapColor('#E393AE'); setEnvelopeColor("#FFB6C1"); break; //pink
            case '#ADD8E6': setFlapColor('#81BFDA'); setEnvelopeColor("#ADD8E6"); break; //blue
            default: setFlapColor(envelopeColor);
        }
    }, [envelopeColor]);


    const navigate = useNavigate();

    const handleFormat = (event, newFormats) => {
        setFormats(newFormats);
    };



    const loadImageAsDataURL = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg'));
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    const generatePDFAndSubmit = async () => {
        if (!title.trim()) {
            alert("Please submit a title");
            return;
          }
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("User not authenticated");
            return;
        }

        // decide if we’re using a color or an image
        const isImageBackground = /\.(jpe?g|png)$/i.test(background);

        // create the PDF
        const doc = new jsPDF();

        // 1) draw background
        if (isImageBackground) {
            const dataUrl = await loadImageAsDataURL(background);
            // A4 is 210×297mm
            doc.addImage(dataUrl, 'JPEG', 0, 0, 210, 297);
        } else {
            doc.setFillColor(background);
            doc.rect(0, 0, 210, 297, 'F');
        }

        // 2) draw text (title + body)
        // Title
        doc.setFont('helvetica', 'bold').setFontSize(20);
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleWidth = doc.getTextWidth(title);
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 20);

        // Body
        doc.setFontSize(12).setFont('helvetica', 'normal');
        if (formats.includes('bold') && formats.includes('italic')) {
            doc.setFont('helvetica', 'bolditalic');
        } else if (formats.includes('bold')) {
            doc.setFont('helvetica', 'bold');
        } else if (formats.includes('italic')) {
            doc.setFont('helvetica', 'italic');
        }

        const lines = doc.splitTextToSize(text, 180);
        doc.text(lines, 10, 40);

        // 3) upload
        const pdfBlob = doc.output('blob');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('envelopeColor', envelopeColor);
        formData.append('flapColor', flapColor);
        formData.append('capsuleId', capsuleId);
        formData.append('file', pdfBlob, `${title || 'letter'}.pdf`);

        const res = await fetch(`${API_URL}/api/upload-pdf`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        if (res.ok) {
            navigate('/edit-capsule', { state: { capsuleId } });
        } else {
            alert('Error uploading PDF');
        }
    };

    const getStyle = () => {
        const isImage = background.endsWith('.png') || background.endsWith('.jpg');
        return {
            fontWeight: formats.includes('bold') ? 'bold' : 'normal',
            fontStyle: formats.includes('italic') ? 'italic' : 'normal',
            width: '100%',
            minHeight: '300px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            outline: 'none',
            resize: 'none',
            fontSize: '16px',

            // **if it's an image URL, use it as backgroundImage**, otherwise backgroundColor
            ...(isImage
                ? {
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center'
                }
                : {
                    backgroundColor: background
                }
            )
        };
    };


    return (
        <>
            <AppHeader user={user} />
            <IconButton
                onClick={() => navigate('/edit-capsule', { state: { capsuleId } })}
                sx={{
                    position: 'absolute',
                    top: '80px',
                    left: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                }}
            >
                <ArrowBackIosNewIcon />
            </IconButton>

            <Box className="letter-editor-container" sx={{ background: "linear-gradient(to bottom right, #7c3aed, rgb(183, 124, 239), #7c3aed)" }}>

                <Box className="letter-editor-box" sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
                    <Typography variant="h4" color="#702b9d" gutterBottom>Write Your Letter</Typography>

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
                            <MenuItem value={paperTexture}>Worn Paper</MenuItem>
                            <MenuItem value={texture}>Textured Paper</MenuItem>
                            <MenuItem value={butterfly}>Butterfly Paper</MenuItem>
                            <MenuItem value={wrinkle}>Wrinkled Paper</MenuItem>
                        </Select>
                        <Typography>Envelope Color:</Typography>
                        <Select
                            value={envelopeColor}
                            onChange={e => setEnvelopeColor(e.target.value)}
                            size="small"
                        >
                            <MenuItem value="#FFFFFF">White</MenuItem>
                            <MenuItem value="#FFB6C1">Pink</MenuItem>
                            <MenuItem value="#ADD8E6">Light Blue</MenuItem>
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
                        sx={{
                            backgroundColor: 'rgba(106, 20, 220, 0.7)',
                            color: 'white',
                            paddingX: 3,
                            paddingY: 1.5,
                            borderRadius: 5,
                            textTransform: 'none',
                            fontSize: 17,
                        }}
                    >
                        Save your letter to the capsule
                    </Button>
                </Box>
            </Box>
        </>
    );
}
