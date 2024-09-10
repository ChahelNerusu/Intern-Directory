import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardActions, Button, Grid, Typography, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [internships, setInternships] = useState([]);
  const [filter, setFilter] = useState({}); // New state for filters

  useEffect(() => {
    fetch('http://localhost:5000/api/internships')
      .then((response) => response.json())
      .then((data) => setInternships(data))
      .catch((error) => console.error('Error fetching internships:', error));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Summer 2025 Internships
        </Typography>
        
        {/* Job Listings */}
        <Grid container spacing={2}>
          {internships.map((internship, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}> {/* Adjusted grid size for better layout */}
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#ffffff', // Background color for the job card
                  borderRadius: '12px',       // Slightly rounder corners
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Softer shadow for more appeal
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',  // Slightly zoom on hover
                  },
                }}
              >
                <CardHeader
                  title={internship.company}
                  subheader={internship.role}
                  titleTypographyProps={{ align: 'center', fontWeight: 'bold' }} // Bold titles
                  subheaderTypographyProps={{ align: 'center', color: 'textSecondary' }}
                  sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff', // White text for header
                    py: 1,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" align="center" gutterBottom>
                    Location: {internship.location}
                  </Typography>
                  <Typography variant="body2" align="center" color="textSecondary">
                    Posted: {internship.date_posted}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    href={internship.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: '#dc004e',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#b0003a' }, // Hover effect for buttons
                    }}
                  >
                    Apply Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
