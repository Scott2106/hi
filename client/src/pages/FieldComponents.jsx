import React from 'react';
import { TextField } from '@mui/material';

const FieldComponent = ({ field, value, onChange }) => {
  switch (field.type) {
    case 'textfield':
      return (
        <TextField 
          label={field.label} 
          fullWidth 
          margin="normal" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
        />
      );
    case 'number':
      return (
        <TextField 
          label={field.label} 
          type="number" 
          fullWidth 
          margin="normal" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
        />
      );
    case 'datetime':
      return (
        <TextField 
          label={field.label} 
          type="datetime-local" 
          fullWidth 
          margin="normal" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
    case 'email':
      return (
        <TextField 
          label={field.label} 
          type="email" 
          fullWidth 
          margin="normal" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
        />
      );
    default:
      return null;
  }
};

export default FieldComponent;