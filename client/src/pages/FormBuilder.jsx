import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FieldComponent from './FieldComponents';
import Navbar from './Navbar';

const FormBuilder = () => {
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const [siteId, setSiteId] = useState('');
    const [siteList, setSiteList] = useState([]);
    const [availableFields] = useState([
      { id: "first_name", label: "First Name", type: "textfield" },
      { id: "last_name", label: "Last Name", type: "textfield" },
      { id: "home_address", label: "Home Address", type: "textfield" },
      { id: "date_of_birth", label: "Date of Birth", type: "datetime" },
      { id: "gender", label: "Gender", type: "textfield" },
      { id: "nationality", label: "Nationality", type: "textfield" },
      { id: "alt_email", label: "Alternate Email", type: "email" },
      { id: "job_title", label: "Job Title", type: "textfield" },
      { id: "department", label: "Department", type: "textfield" },
      { id: "hire_date", label: "Hire Date", type: "textfield" },
      { id: "end_date", label: "End Date", type: "textfield" },
      { id: "work_location", label: "Work Location", type: "textfield" },
      { id: "monthly_salary", label: "Monthly Salary", type: "number" },
      { id: "benefits_enrollment", label: "Benefits Enrollment", type: "textfield" },
      { id: "bonus", label: "Bonus", type: "number" },
      { id: "work_schedule", label: "Work Schedule", type: "textfield" },
      { id: "overtime_hours", label: "Overtime Hours", type: "number" },
    ]);

    const [errors, setErrors] = useState({});

    useEffect(() => {
      fetchSiteList();
    }, []);

    const fetchSiteList = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/fmbd/s');
        if (!response.ok) {
          throw new Error('Failed to fetch site list');
        }
        const data = await response.json();
        setSiteList(data);
      } catch (error) {
        console.error('Error fetching site list:', error);
        // You might want to set an error state here and display it to the user
      }
    };

    const onDragEnd = (result) => {
      if (!result.destination) return;

      const newFields = Array.from(fields);
      const [reorderedItem] = newFields.splice(result.source.index, 1);
      newFields.splice(result.destination.index, 0, reorderedItem);

      setFields(newFields);
    };

    const addField = (field) => {
      const newField = { ...field, id: `${field.type}-${Date.now()}` };
      setFields([...fields, newField]);
      setFormData({ ...formData, [newField.id]: '' });
    };

    const handleFieldChange = (fieldId, value) => {
      setFormData({ ...formData, [fieldId]: value });
    };

    const validateForm = () => {
      let tempErrors = {};
      
      if (fields.length === 0) {
        tempErrors.fields = "At least one field is required";
      }

      if (!siteId) {
        tempErrors.siteId = "Site selection is required";
      }

      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateForm()) {
        console.log('Submitting form with data:', { fields, formData, siteId });
        try {
            const response = await fetch('http://localhost:8081/api/fmbd/sbfm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fields, formData, siteId: parseInt(siteId) }),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Form submitted, server response:', result);
            alert(`Form configuration and data saved successfully! Site ID: ${siteId}`);
            navigate(`/fmfd/${siteId}`);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(error.message || 'Failed to save form configuration and data');
        }
      }
    };

    return (
      <>
        <Navbar />
        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={3}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Available Fields</Typography>
              {availableFields.map((field) => (
                <Button
                  key={field.id}
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: 1 }}
                  onClick={() => addField(field)}
                >
                  {field.label}
                </Button>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Form Preview</Typography>
              <form onSubmit={handleSubmit}>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="form-fields">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <FieldComponent 
                                  field={field} 
                                  value={formData[field.id]}
                                  onChange={(value) => handleFieldChange(field.id, value)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <FormControl fullWidth margin="normal" error={!!errors.siteId}>
                  <InputLabel id="site-select-label">Select Site</InputLabel>
                  <Select
                    labelId="site-select-label"
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    label="Select Site"
                    required
                  >
                    {siteList.map((site) => (
                      <MenuItem key={site.site_id} value={site.site_id}>
                        {site.site_name} (ID: {site.site_id})
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.siteId && <Typography color="error">{errors.siteId}</Typography>}
                </FormControl>
                {errors.fields && <Typography color="error">{errors.fields}</Typography>}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  Submit Form
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

export default FormBuilder;