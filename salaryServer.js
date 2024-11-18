const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const port = 3003; // Ensure this matches your frontend

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stockmanagements', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Employee Schema
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  attendance: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ['present', 'absent'], required: true },
    },
  ],
});

const Employee = mongoose.model('Employee', employeeSchema);

// Fetch all employees with attendance
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Add new employee (for testing or further use)
app.post('/api/employees', async (req, res) => {
  try {
    const { employeeId, name, role, attendance } = req.body;
    const newEmployee = new Employee({ employeeId, name, role, attendance });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(400).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
