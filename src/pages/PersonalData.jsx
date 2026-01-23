import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PersonalData() {

    const navigate = useNavigate();
    const [name, setName] = useState('')
    const [salary, setSalary] = useState('');
    const [salaryDate, setSalaryDate] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();

        // Create personal data object
        const personalData = {
            name: String(name),
            salary: Number(salary),
            salaryDate: Number(salaryDate),
            updatedAt: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('personalData', JSON.stringify(personalData));

        // Navigate to dashboard with success message
        navigate('/', { 
            state: { 
                showAlert: true, 
                message: 'Personal data saved successfully!' 
            } 
        });
    };

    return(
        <div style={{height: "100vh"}} className="w-100 p-2 d-flex justify-content-center align-items-center">
            <form onSubmit={handleSubmit} style={{backgroundColor: "white"}} className="income-form p-4 rounded-3 d-flex flex-column align-items-end justify-content-between shadow">
                <div className="w-100">
                    <div className="d-flex justify-content-between">
                        <h3>Edit your personal data</h3>
                        <a className="exit text-decoration-none btn-secondary" href="/">Go back</a>
                    </div>
                    <div className="w-100 mt-5">
                        <h5>Your name</h5>
                        <div className="d-flex">
                            <input maxLength={18} onChange={(e) => setName(e.target.value)} value={name} style={{height: "48px"}} className="input w-100 p-2 rounded-2" placeholder="Enter your name" type="text" required />
                        </div>
                    </div>
                    <div className="w-100 mt-2">
                        <h5>Salary</h5>
                        <div className="d-flex">
                            <input min={0} onChange={(e) => setSalary(e.target.value)} value={salary} style={{height: "48px"}} className="input w-100 p-2 rounded-2" placeholder="Type in your salary (e.g., 25, 000 EGP)" type="number" required />
                        </div>
                    </div>
                    <div className="w-100 mt-2">
                        <h5>Date of your salary</h5>
                        <select onChange={(e) => setSalaryDate(e.target.value)} value={salaryDate} className="input w-100 rounded-2 p-2" required>
                            <option value="">On which day of the month do you receive your salary?</option>
                            {Array.from({ length: 31 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                Day {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <input className="add" value="Add" type="submit" />
            </form>
        </div>
    )
}

export default PersonalData