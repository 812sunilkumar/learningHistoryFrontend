import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, TablePagination } from '@mui/material';
import LearningHistoryModal from './LearningHistoryModal';
import AddEmployeeModal from './AddEmployeeModal';
import { fetchEmployees, updateEmployee, deleteEmployee } from '../services/apiService';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLearningHistoryModalOpen, setIsLearningHistoryModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchEmployeeData = async () => {
    try {
      const result = await fetchEmployees();
      setEmployees(result.data);
      setFilteredEmployees(result.data);
    } catch (error) {
      console.error('Error fetching employees', error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    // Filter employees based on search query
    setFilteredEmployees(
      employees.filter(employee =>
        `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.delegate_id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, employees]);

  const handleEditNameChange = (e, field) => {
    setEditingEmployee(prevState => ({
      ...prevState,
      [field]: e.target.value
    }));
  };

  const handleSaveNameChange = async () => {
    if (editingEmployee) {
      try {
        await updateEmployee(editingEmployee.delegate_id, {
          first_name: editingEmployee.first_name,
          last_name: editingEmployee.last_name
        });
        fetchEmployeeData(); // Refresh employee data
        setEditingEmployee(null);
      } catch (error) {
        console.error('Error updating employee', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async () => {
    try {
      if (employeeToDelete) {
        await deleteEmployee(employeeToDelete.delegate_id);
        fetchEmployeeData(); // Refresh employee data
      }
    } catch (error) {
      console.error('Error deleting employee', error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleViewLearningHistory = (employee) => {
    setSelectedEmployee(employee);
    setIsLearningHistoryModalOpen(true);
  };

  const handleCloseLearningHistoryModal = () => {
    setIsLearningHistoryModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleOpenAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(true);
  };

  const handleCloseAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(false);
    fetchEmployeeData(); // Refresh employee data
  };

  const handleOpenDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset to first page on search
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Employee List
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenAddEmployeeModal}>
        Add Employee
      </Button>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Delegate ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>
                    {editingEmployee?.employee_id === employee.employee_id ? (
                      <Box>
                        <TextField
                        defaultValue={employee?.learning_history?.first_name || ''}
                          value={editingEmployee.first_name}
                          onChange={(e) => handleEditNameChange(e, 'first_name')}
                          label="First Name"
                          margin="normal"
                          fullWidth
                        />
                        <TextField
                        defaultValue={employee?.learning_history?.last_name || ''}
                          value={editingEmployee.last_name}
                          onChange={(e) => handleEditNameChange(e, 'last_name')}
                          label="Last Name"
                          margin="normal"
                          fullWidth
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveNameChange}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleCancelEdit}
                          sx={{ mt: 1 }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <span>{employee?.learning_history?.first_name} {employee?.learning_history?.last_name}</span>
                    )}
                  </TableCell>
                  <TableCell>{employee.delegate_id}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleViewLearningHistory(employee)}
                    >
                      View Learning History
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setEditingEmployee(employee)}
                      sx={{ ml: 1 }}
                    >
                      Edit Name
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(employee)}
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {selectedEmployee && (
        <LearningHistoryModal
          open={isLearningHistoryModalOpen}
          onClose={handleCloseLearningHistoryModal}
          employee={selectedEmployee}
        />
      )}
      {isAddEmployeeModalOpen && (
        <AddEmployeeModal
          onAddEmployee={handleCloseAddEmployeeModal}
        />
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this employee?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteEmployee} 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeTable;
