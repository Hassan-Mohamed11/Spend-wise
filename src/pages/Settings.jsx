import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../settings.css"

export default function Settings() {

    const [salary, setSalary] = useState(0);
    const [salaryDate, setSalaryDate] = useState(1);
    const [username, setUsername] = useState('User');
    const [clearIncomes, setClearIncomes] = useState(false);
    const [clearExpenses, setClearExpenses] = useState(false);
    const [currency, setCurrency] = useState("EGP")

    useEffect(() => {
        const savedData = localStorage.getItem("personalData")
        if (savedData) {
            const data = JSON.parse(savedData)
            setSalary(data.salary || 0)
            setSalaryDate(data.salaryDate || 1);
            setUsername(data.name || 'User');

            setClearExpenses(data.clearExpenses || false);
            setClearIncomes(data.clearIncomes || false);
            setCurrency(data.currency || "EGP")
        }
    }, [])

  const handleSave = () => {
    const data = {
      name: username,
      salary,
      salaryDate,
      clearExpenses,
      clearIncomes,
      currency
    };

    localStorage.setItem("personalData", JSON.stringify(data));

    toast.success("Saved!");
  }; 

    return(
        <div style={{height: "100vh"}} className="w-100 d-flex flex-column align-items-center justify-content-center p-5 gap-4">
            <div className="d-flex flex-column p-5 bg-white w-100 h-50 rounded-3">
                <h2>Personal information</h2>
                <div className="w-100 d-flex flex-column justify-content-center h-100">
                    <div className="my-2">
                        <h6>Name</h6>
                        <input maxLength={14} onChange={(e) => setUsername(e.target.value)} value={username} style={{backgroundColor: "#E8E8E8"}} className="form-control border-0" type="text" required/>
                    </div>
                    <div className="my-2">
                        <h6>Salary</h6>
                        <input min={1} value={salary} onChange={(e) => setSalary(Number(e.target.value))} style={{backgroundColor: "#E8E8E8"}} className="form-control border-0" type="number" />
                    </div>
                    <div className="my-2">
                        <h6>Salary date</h6>
                        <select onChange={(e) => setSalaryDate(e.target.value)} value={salaryDate} className="input w-100 rounded-2 p-2" required>
                            <option value="">Salary date</option>
                            {Array.from({ length: 31 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                Day {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <button onClick={handleSave} type="submit" className="btn btn-primary my-2">Save</button>
                </div>
            </div>
            <div className="d-flex flex-column p-5 bg-white w-100 h-50 rounded-3">
                <h2>Customizations</h2>
                <div className="w-100 d-flex flex-column justify-content-center h-100">
                    <div className="d-flex align-items-center">
                        <input checked={clearIncomes} onChange={(e) => setClearIncomes(e.target.checked)} className="form-check-input m-2 border-2 p-2" type="checkbox"/>
                        <h6 className="m-0">Clear <span className="fw-semibold" style={{color: "#62b54e"}}>Incomes</span> when the month ends</h6>
                    </div>
                    <div className="d-flex align-items-center">
                        <input checked={clearExpenses} onChange={(e) => setClearExpenses(e.target.checked)} className="form-check-input m-2 border-2 p-2" type="checkbox"/>
                        <h6 className="m-0">Clear <span className="fw-semibold" style={{color: "#f87474"}}>Expenses</span> when the month ends</h6>
                    </div>
                    <div className="d-flex flex-column my-2">
                        <h6 className="my-1">Currency</h6>
                        <select value={currency} onChange={e => setCurrency(e.target.value)} style={{backgroundColor: "#E8E8E8"}} className="form-control" name="" id="">
                            <option value="$">United states dollar ($)</option>
                            <option value="€">Euros (€)</option>
                            <option value="EGP">Egyption pound (EGP)</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <button onClick={handleSave} type="submit" className="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    ) 
}