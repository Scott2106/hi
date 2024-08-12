import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, CircularProgress, Button } from '@mui/material';
import FieldComponent from './FieldComponents';

const FormDisplay = () => {
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const { formId } = useParams();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/fmfd/${formId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch form');
        }
        const data = await response.json();
        setForm(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching form:', error);
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleFieldChange = (fieldId, value) => {
    setFormData({ ...formData, [fieldId]: value });
  };

  const validateForm = () => {
    let tempErrors = {};
    form.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        tempErrors[field.id] = `${field.label} is required`;
      }
      // Add more specific validations based on field types
      if (field.type === 'email' && formData[field.id] && !/\S+@\S+\.\S+/.test(formData[field.id])) {
        tempErrors[field.id] = 'Invalid email format';
      }
      // Add more validations as needed
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('/api/fmbd/sbfm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields: form.fields, formData }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        const result = await response.json();
        console.log('Form submitted successfully:', result);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!form) {
    return <Typography>Form not found</Typography>;
  }

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h4" gutterBottom>{form.name}</Typography>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field) => (
          <div key={field.id}>
            <FieldComponent
              field={field}
              value={formData[field.id] || ''}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
            {errors[field.id] && <Typography color="error">{errors[field.id]}</Typography>}
          </div>
        ))}
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Submit
        </Button>
      </form>
    </Paper>
  );
};

export default FormDisplay;