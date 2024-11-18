const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/stockmanagements', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  dateOfJoin: { type: Date, required: true },
  attendance: [{ date: { type: Date }, status: { type: String } }],
});

const Employee = mongoose.model('Employee', EmployeeSchema);

// Add employee
app.post('/api/employees', async (req, res) => {
  const { employeeId, name, address, phone, role, dateOfJoin } = req.body;

  try {
    const newEmployee = new Employee({
      employeeId,
      name,
      address,
      phone,
      role,
      dateOfJoin,
    });
    await newEmployee.save();
    res.json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding employee' });
  }
});

// Fetch all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Update employee details
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating employee' });
  }
});

// Mark attendance
app.post('/api/employees/:id/attendance', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Mark attendance for today
    const today = new Date();
    const existingAttendance = employee.attendance.find(att => 
      att.date.toDateString() === today.toDateString()
    );

    if (existingAttendance) {
      // Update the status if attendance for today exists
      existingAttendance.status = status;
    } else {
      // Add a new attendance entry for today
      employee.attendance.push({ date: today, status });
    }

    await employee.save();
    res.json({ message: 'Attendance marked successfully', employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking attendance' });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
