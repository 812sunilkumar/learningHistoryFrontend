import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { addCourse, fetchCourseCodes } from '../services/apiService';

const AddCourseModal = ({ open, onClose, delegateId, fetchLearningHistory }) => {
  const [course, setCourse] = useState({
    course_title: '',
    course_code: '',
    country: '',
    training_provider: '',
    completed_on: '',
    valid_from: '',
    valid_until: '',
    status: ''
  });
  const [courseCodes, setCourseCodes] = useState([]);

  useEffect(() => {
    const loadCourseCodes = async () => {
      try {
        const codes = await fetchCourseCodes();
        setCourseCodes(codes);
      } catch (error) {
        console.error('Error fetching course codes', error);
      }
    };

    loadCourseCodes();
  }, []);

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await addCourse(delegateId, course);
      fetchLearningHistory(); // Refresh learning history data
      onClose(); // Close modal after adding
    } catch (error) {
      console.error('Error adding course', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 4, mx: 'auto', mt: 5, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Add New Course
        </Typography>
        <TextField
          label="Course Title"
          name="course_title"
          value={course.course_title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Course Code</InputLabel>
          <Select
            name="course_code"
            value={course.course_code}
            onChange={handleChange}
          >
            {courseCodes.map((code) => (
              <MenuItem key={code} value={code}>
                {code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Country"
          name="country"
          value={course.country}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Training Provider"
          name="training_provider"
          value={course.training_provider}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Completed On"
          name="completed_on"
          type="date"
          value={course.completed_on}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Valid From"
          name="valid_from"
          type="date"
          value={course.valid_from}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Valid Until"
          name="valid_until"
          type="date"
          value={course.valid_until}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Status"
          name="status"
          value={course.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Course
        </Button>
      </Box>
    </Modal>
  );
};

export default AddCourseModal;
