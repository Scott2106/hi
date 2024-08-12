import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  CircularProgress, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Container
} from '@mui/material';
import Navbar from './Navbar';

const FormFieldsDisplay = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [siteId, setSiteId] = useState('');
  const [siteIdError, setSiteIdError] = useState('');

  const validateSiteId = () => {
    if (!siteId.trim()) {
      setSiteIdError('Site ID is required');
      return false;
    }
    if (isNaN(Number(siteId))) {
      setSiteIdError('Site ID must be a number');
      return false;
    }
    setSiteIdError('');
    return true;
  };

  const fetchFormFields = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:8081/api/fmbd/s/${id}`;
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch form fields: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Received data:', JSON.stringify(data, null, 2));
      setFormData(data);
    } catch (error) {
      console.error('Error fetching form fields:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateSiteId()) {
      fetchFormFields(siteId);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Paper sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h4" gutterBottom>Form Fields Display</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Enter Site ID"
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              fullWidth
              margin="normal"
              error={!!siteIdError}
              helperText={siteIdError}
            />
            <Button type="submit" variant="contained" color="primary">
              View Form Fields
            </Button>
          </form>

          {loading && <CircularProgress sx={{ marginTop: 2 }} />}
          
          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              Error: {error}
            </Typography>
          )}

          {formData && formData.fields && (
            <div>
              <Typography variant="h5" sx={{ marginTop: 2 }}>
                Site ID: {formData.siteId}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                Number of fields: {formData.fields.length}
              </Typography>
              <List>
                {formData.fields.map((field, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${field.field_label}`}
                      secondary={`Value: ${field.field_value || 'N/A'}`}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default FormFieldsDisplay;