import React, { useState } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { updateCourse, deleteCourse } from '../services/apiService'; // Ensure deleteCourse is implemented in apiService
import AddCourseModal from './AddCourseModal';

const LearningHistoryModal = ({ employee, onClose }) => {
  const [editCourse, setEditCourse] = useState(null);
  const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleEditClick = (course) => {
    setEditCourse({ ...course });
  };

  const handleUpdateCourse = async (courseId, updatedCourse) => {
    try {
      await updateCourse(employee.delegate_id, courseId, updatedCourse);
      onClose();
    } catch (error) {
      console.error('Error updating course', error);
    }
  };

  const handleAddCourse = () => {
    setAddCourseModalOpen(true);
  };

  const handleCloseAddCourseModal = () => {
    setAddCourseModalOpen(false);
  };

  const handleOpenDeleteDialog = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  const handleDeleteCourse = async () => {
    try {
      if (courseToDelete) {
        await deleteCourse(employee.delegate_id, courseToDelete.course_code);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting course', error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleCourseChange = (e) => {
    setEditCourse({
      ...editCourse,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveCourse = () => {
    if (editCourse && editCourse.course_code) {
      handleUpdateCourse(editCourse.course_code, editCourse);
      setEditCourse(null);
    } else {
      console.error('Course code is missing!');
    }
  };

  // Ensure records is treated as an array
  const records = Array.isArray(employee?.learning_history?.records) ? employee.learning_history.records : [];

  return (
    <Modal open={!!employee} onClose={onClose}>
      <Box
        sx={{
          width: '90%',
          maxWidth: 900,
          p: 4,
          mx: 'auto',
          mt: 5,
          bgcolor: 'background.paper',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Learning History for {employee?.delegate_id} {employee?.learning_history?.last_name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCourse}
          >
            Add Course
          </Button>
        </Box>
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
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((course) => (
                <TableRow key={course.course_code}>
                  <TableCell>{course.course_title}</TableCell>
                  <TableCell>{course.course_code}</TableCell>
                  <TableCell>{course.country}</TableCell>
                  <TableCell>{course.training_provider}</TableCell>
                  <TableCell>{course.completed_on}</TableCell>
                  <TableCell>{course.valid_from}</TableCell>
                  <TableCell>{course.valid_until}</TableCell>
                  <TableCell>{course.status}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditClick(course)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(course)}
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveCourse}
              >
                Save Changes
              </Button>
            </Box>
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
            fetchLearningHistory={onClose}
          />
        )}
      </Box>
    </Modal>
  );
};

export default LearningHistoryModal;