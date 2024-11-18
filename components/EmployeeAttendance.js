import React, { useState, useEffect } from 'react';

const App = () => {
    const [view, setView] = useState(''); 
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({
        employeeId: '',
        name: '',
        address: '',
        phone: '',
        role: '',
        dateOfJoin: ''
    });
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [editedEmployee, setEditedEmployee] = useState(null);

    // Fetch employees when switching to view
    useEffect(() => {
        if (view === 'view') {
            fetchEmployees();
        }
    }, [view]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/employees');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error.message);
            alert('Error fetching employees');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee({ ...newEmployee, [name]: value });
    };

    const handleAddEmployee = async () => {
        // Check if the employee ID already exists
        const existingEmployee = employees.find(emp => emp.employeeId === newEmployee.employeeId);
        
        if (existingEmployee) {
            alert('Employee ID already exists');
            return; // Stop execution if the employee ID already exists
        }
    
        // Proceed to add the employee if ID does not exist
        try {
            const response = await fetch('http://localhost:3000/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEmployees([...employees, data]); // Update the state with the newly added employee
            setNewEmployee({
                employeeId: '',
                name: '',
                address: '',
                phone: '',
                role: '',
                dateOfJoin: ''
            });
            alert('Employee added successfully!');
        } catch (error) {
            console.error('Error adding employee:', error.message);
            alert('Employee ID already exists');
        }
    };
    

    const handleDeleteEmployee = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setEmployees(employees.filter(emp => emp._id !== id));
        } catch (error) {
            console.error('Error deleting employee:', error.message);
            alert('Error deleting employee');
        }
    };

    const handleAttendanceChange = (id, status) => {
        setAttendanceStatus({ ...attendanceStatus, [id]: status });
    };

    const handleMarkAttendance = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/employees/${id}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: attendanceStatus[id] || 'absent' }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchEmployees();
        } catch (error) {
            console.error('Error marking attendance:', error.message);
            alert('Error marking attendance');
        }
    };

    const handleEditEmployee = (emp) => {
        setEditingEmployeeId(emp._id);
        setEditedEmployee({ ...emp });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee({ ...editedEmployee, [name]: value });
    };

    const handleSaveEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedEmployee),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setEmployees(employees.map(emp => (emp._id === id ? editedEmployee : emp)));
            setEditingEmployeeId(null);
        } catch (error) {
            console.error('Error updating employee:', error.message);
            alert('Error updating employee');
        }
    };

    const handleCancelEdit = () => {
        setEditingEmployeeId(null);
        setEditedEmployee(null);
    };

    const renderAttendanceHistory = (attendance) => (
        <ul>
            {attendance.map((att, index) => (
                <li key={index}>
                    {new Date(att.date).toLocaleDateString()} - {att.status}
                </li>
            ))}
        </ul>
    );

    const renderAddEmployee = () => (
        <div className="add-employee-form">
            <h3 align="center">Add Employee</h3>
            <table align="center">
                <tbody>
                    <tr>
                        <td>Employee Id:</td>
                        <td><input type="text" name="employeeId" placeholder="Employee ID" value={newEmployee.employeeId} onChange={handleInputChange} /></td>
                    </tr>
                    <tr>
                        <td>Name:</td>
                        <td><input type="text" name="name" placeholder="Name" value={newEmployee.name} onChange={handleInputChange} /></td>
                    </tr>
                    <tr>
                        <td>Address:</td>
                        <td><input type="text" name="address" placeholder="Address" value={newEmployee.address} onChange={handleInputChange} /></td>
                    </tr>
                    <tr>
                        <td>Phone No:</td>
                        <td><input type="text" name="phone" placeholder="Phone" value={newEmployee.phone} onChange={handleInputChange} /></td>
                    </tr>
                    <tr>
                        <td>Role:</td>
                        <td><input type="text" name="role" placeholder="Role" value={newEmployee.role} onChange={handleInputChange} /></td>
                    </tr>
                    <tr>
                        <td>Date of Joining:</td>
                        <td><input type="date" name="dateOfJoin" value={newEmployee.dateOfJoin} onChange={handleInputChange} /></td>
                    </tr>
                </tbody>
            </table>
            <center>
                <button onClick={handleAddEmployee}>Add Employee</button>
            </center>
        </div>
    );

    const renderViewEmployees = () => (
        <div className="employee-list" align="center">
            <h3>Employee List</h3>
            <table border="3" cellSpacing={5}>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone No</th>
                        <th>Role</th>
                        <th>Date of Joining</th>
                        <th>Attendance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp._id}>
                            <td>{editingEmployeeId === emp._id ? (
                                    <input
                                        type="text"
                                        name="employeeId"
                                        value={editedEmployee.employeeId}
                                        onChange={handleEditInputChange}
                                    />
                                ) : (
                                    emp.employeeId
                                )}
</td>
                            <td>{editingEmployeeId === emp._id ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedEmployee.name}
                                        onChange={handleEditInputChange}
                                    />
                                ) : (
                                    emp.name
                                )}
</td>
                            <td> {editingEmployeeId === emp._id ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={editedEmployee.address}
                                        onChange={handleEditInputChange}
                                    />
                                ) : (
                                    emp.address
                                )}</td>
                            <td> {editingEmployeeId === emp._id ? (
                                    <input
                                        type="text"
                                        name="phone"
                                        value={editedEmployee.phone}
                                        onChange={handleEditInputChange}
                                    />
                                ) : (
                                    emp.phone
                                )}</td>
                            <td>  
                                 {editingEmployeeId === emp._id ? (
                                    <input
                                        type="text"
                                        name="role"
                                        value={editedEmployee.role}
                                        onChange={handleEditInputChange}
                                    />
                                ) : (
                                    emp.role
                                )}
</td>
                            <td>{new Date(emp.dateOfJoin).toLocaleDateString()}</td>
                            <td>
                                <select value={attendanceStatus[emp._id] || 'absent'} onChange={(e) => handleAttendanceChange(emp._id, e.target.value)}>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                </select>
                                <br />
                                {renderAttendanceHistory(emp.attendance)}
                            </td>
                            <td>
                            {editingEmployeeId === emp._id ? (
                                    <>
                                        <button onClick={() => handleSaveEdit(emp._id)}>Save</button>
                                        <button onClick={handleCancelEdit}>Cancel</button>
                                    </>
                                ) : (
                                    <>

                                <button onClick={() => handleMarkAttendance(emp._id)} style={{width: '80px',height: '30px', padding: '5px',fontSize: '12px'}}>Mark</button>
                                <button onClick={() => handleEditEmployee(emp)} style={{
        width: '80px',      
        height: '30px',     // Adjust button height
        padding: '5px',     // Adjust padding inside the button
        fontSize: '12px'    // Adjust font size inside the button
    }}>Edit</button>
                                <button onClick={() => handleDeleteEmployee(emp._id)} style={{
        width: '80px',      // Adjust button width
        height: '30px',     // Adjust button height
        padding: '5px',     // Adjust padding inside the button
        fontSize: '12px'    // Adjust font size inside the button
    }}>Delete</button>
                                </>
                                )}

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    const renderOptions = () => (
        <div className="options">
            <center>
                <button onClick={() => { setView('add'); setEmployees([]); }}>Add Employee</button><br /><br />
                <button onClick={() => setView('view')}>Mark Attendance</button>
            </center>
        </div>
    );

    return (
        <div className="app">
            <h1>Employee Management</h1>
            {renderOptions()}
            {view === 'add' && renderAddEmployee()}
            {view === 'view' && renderViewEmployees()}
        </div>
    );
};

export default App;
