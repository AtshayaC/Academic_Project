import React, { useState, useEffect } from 'react';

const App = () => {
    const [employees, setEmployees] = useState([]);
    const [roleSalary, setRoleSalary] = useState({});
    const [calculatedSalary, setCalculatedSalary] = useState({});

    // Fetch employees and their attendance
    useEffect(() => {
        fetchEmployees();
    }, []);

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

    // Handle the input change for role salary
    const handleRoleSalaryInputChange = (role, value) => {
        setRoleSalary({ ...roleSalary, [role]: parseFloat(value) });
    };

    // Calculate salary based on role salary and attendance
    const calculateSalaries = () => {
        const updatedSalaries = {};

        employees.forEach((employee) => {
            const salaryPerDay = roleSalary[employee.role];
            if (salaryPerDay) {
                const daysPresent = employee.attendance.filter(att => att.status === 'present').length;
                updatedSalaries[employee._id] = daysPresent * salaryPerDay;
            }
        });

        setCalculatedSalary(updatedSalaries);
    };

    // Render salary input for each role at the top
    const renderRoleSalaryInputs = () => {
        const roles = [...new Set(employees.map(emp => emp.role))]; // Get unique roles

        return roles.map(role => (
            <div key={role} style={{ marginBottom: '10px' }}>
                <label>{`Salary per day for ${role}: `}</label>
                <input
                    type="number"
                    placeholder={`Enter salary for ${role}`}
                    value={roleSalary[role] || ''}
                    onChange={(e) => handleRoleSalaryInputChange(role, e.target.value)}
                />
            </div>
        ));
    };

    // Render the employee list with calculated salaries
    const renderViewEmployees = () => (
        <div align="center">
            <h3>Employee List</h3>
            <div>{renderRoleSalaryInputs()}</div>
            <button onClick={calculateSalaries} style={{ margin: '20px' }}>
                Calculate Salaries
            </button>
            <table border="3" cellSpacing={5}>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Days Present</th>
                        <th>Salary (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp._id}>
                            <td>{emp.employeeId}</td>
                            <td>{emp.name}</td>
                            <td>{emp.role}</td>
                            <td>{emp.attendance.filter(att => att.status === 'present').length}</td>
                            <td>{calculatedSalary[emp._id] ? `₹${calculatedSalary[emp._id].toFixed(2)}` : 'Not Calculated'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="app" align="center">
            <h1>Employee Salary Calculation</h1>
            {renderViewEmployees()}
        </div>
    );
};

export default App;
