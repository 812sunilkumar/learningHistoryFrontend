import React, { useState } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { updateCourse, deleteCourse } from '../services/apiService'; // Ensure deleteCourse is implemented in apiService
import AddCourseModal from './AddCourseModal';

const LearningHistoryModal = ({ employee, onClose }) => {
  const [editCourse, setEditCourse] = useState(null);
  const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Handler for Edit button click
  const handleEditClick = (course) => {
    setEditCourse({ ...course }); // Create a copy of the course to edit
  };

  // Handler to update the course
  const handleUpdateCourse = async (courseId, updatedCourse) => {
    try {
      await updateCourse(employee.delegate_id, courseId, updatedCourse);
      onClose(); // Refresh or close modal
    } catch (error) {
      console.error('Error updating course', error);
    }
  };

  // Handler to open Add Course Modal
  const handleAddCourse = () => {
    setAddCourseModalOpen(true);
  };

  // Handler to close Add Course Modal
  const handleCloseAddCourseModal = () => {
    setAddCourseModalOpen(false);
  };

  // Handler to open Delete Confirmation Dialog
  const handleOpenDeleteDialog = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  // Handler to close Delete Confirmation Dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  // Handler to delete the course
  const handleDeleteCourse = async () => {
    try {
      if (courseToDelete) {
        await deleteCourse(employee.delegate_id, courseToDelete.course_code);
        onClose(); // Refresh or close modal
      }
    } catch (error) {
      console.error('Error deleting course', error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Handler to update course details in state
  const handleCourseChange = (e) => {
    setEditCourse({
      ...editCourse,
      [e.target.name]: e.target.value
    });
  };

  // Handler to save the updated course
  const handleSaveCourse = () => {
    if (editCourse && editCourse.course_code) {
      handleUpdateCourse(editCourse.course_code, editCourse);
      setEditCourse(null);
    } else {
      console.error('Course code is missing!');
    }
  };

  return (
    <Modal open={!!employee} onClose={onClose}>
      <Box 
        sx={{ 
          width: 600, 
          p: 4, 
          mx: 'auto', 
          mt: 5, 
          bgcolor: 'background.paper',
          maxHeight: '80vh', // Set a max height for the modal
          overflowY: 'auto'   // Allow vertical scrolling
        }}
      >
        <Typography variant="h6" gutterBottom>
          Learning History for {employee?.first_name} {employee?.last_name}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAddCourse}
          sx={{ mb: 2 }}
        >
          Add Course
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Title</TableCell>
                <TableCell>Course Code</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Training Provider</TableCell>
                <TableCell>Completed On</TableCell>
                <TableCell>Valid From</TableCell>
                <TableCell>Valid Until</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employee?.learning_history?.records.map((course) => (
                <TableRow key={course.course_code}>
                  <TableCell>{course.course_title}</TableCell>
                  <TableCell>{course.course_code}</TableCell>
                  <TableCell>{course.country}</TableCell>
                  <TableCell>{course.training_provider}</TableCell>
                  <TableCell>{course.completed_on}</TableCell>
                  <TableCell>{course.valid_from}</TableCell>
                  <TableCell>{course.valid_until}</TableCell>
                  <TableCell>{course.status}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={() => handleEditClick(course)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleOpenDeleteDialog(course)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {editCourse && (
          <Box sx={{ mt: 2, overflowY: 'auto' }}>
            <Typography variant="h6">Edit Course</Typography>
            <TextField
              label="Course Title"
              name="course_title"
              value={editCourse.course_title}
              onChange={handleCourseChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Course Code"
              name="course_code"
              value={editCourse.course_code}
              onChange={handleCourseChange}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Country"
              name="country"
              value={editCourse.country}
              onChange={handleCourseChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Training Provider"
              name="training_provider"
              value={editCourse.training_provider}
              onChange={handleCourseChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Completed On"
              name="completed_on"
              type="date"
              value={editCourse.completed_on}
              onChange={handleCourseChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Valid From"
              name="valid_from"
              type="date"
              value={editCourse.valid_from}
              onChange={handleCourseChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Valid Until"
              name="valid_until"
              type="date"
              value={editCourse.valid_until}
              onChange={handleCourseChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Status"
              name="status"
              value={editCourse.status}
              onChange={handleCourseChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveCourse}
              sx={{ mt: 2 }}
            >
              Save Changes
            </Button>
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this course?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteCourse} 
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {isAddCourseModalOpen && (
          <AddCourseModal
            open={isAddCourseModalOpen}
            onClose={handleCloseAddCourseModal}
            delegateId={employee?.delegate_id}
            fetchLearningHistory={onClose} // Refresh the learning history
          />
        )}
      </Box>
    </Modal>
  );
};

export default LearningHistoryModal;
