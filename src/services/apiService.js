// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchEmployees = () => axios.get(`${API_BASE_URL}/employees`);
export const fetchLearningHistory = () => axios.get(`${API_BASE_URL}/learninghistory`);
export const addEmployee = (employee) => axios.post(`${API_BASE_URL}/employees/addEmployee`, employee);
// export const updateEmployee = (id, employee) => axios.put(`${API_BASE_URL}/employees/${id}`, employee);
export const addCourse = async (delegateId, course) => {
    await axios.post(`${API_BASE_URL}/learningHistory/${delegateId}`, course);
  };
  
  export const updateCourse = async (delegateId, courseId, updatedCourse) => {
    await axios.put(`${API_BASE_URL}/learningHistory/${delegateId}/${courseId}`, updatedCourse);
  };

  export const updateEmployee = async (employeeId, updatedData) => {
    try {
      await axios.put(`${API_BASE_URL}/employees/${employeeId}`, updatedData);
    } catch (error) {
      console.error('Error updating employee', error);
    }
  };

  // Delete employee and associated courses
export const deleteEmployee = async (delegateId) => {
    return axios.delete(`${API_BASE_URL}/employees/${delegateId}`);
  };
  
  // Delete course
  export const deleteCourse = async (courseCode, delegateId) => {
    return axios.delete(`${API_BASE_URL}/learningHistory/${courseCode}/${delegateId}`);
  };

//   get course codes: 
export const fetchCourseCodes = async () => {
    const response = await axios.get(`${API_BASE_URL}/learningHistory/getCourseCode`);
    return response.data;
  };