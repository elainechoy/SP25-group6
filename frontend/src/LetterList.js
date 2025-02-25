import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Link } from '@mui/material';

export default function LetterList() {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    // Fetch all PDF metadata from the server
    fetch('http://localhost:5001/api/get-all-pdfs')
      .then((res) => res.json())
      .then((data) => {
        setLetters(data);
      })
      .catch((err) => console.error('Error fetching letters:', err));
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: '600px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        List of Letters
      </Typography>
      <List>
        {letters.map((file) => (
          <ListItem key={file._id}>
            {/* Use either metadata.title or fallback to filename */}
            <Link
              href={`http://localhost:5001/api/download-pdf/${file._id}`}
              // For forced download, you can also use `download` attribute in <a>:
              // download="letter.pdf"
              target="_blank" // open in new tab
              rel="noopener noreferrer"
            >
              {file.metadata && file.metadata.title
                ? file.metadata.title
                : file.filename}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
