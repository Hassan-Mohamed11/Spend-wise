import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import '../AddIncome.css'

function AddIncome() {

    const navigate = useNavigate();
    const [amount, setAmount] = useState(0)
    const [item, setItem] = useState('')
    const [category, setCategory] = useState('')
    const [incomes, setIncomes] = useState([])

    // Load expenses from localStorage when component mounts
    useEffect(() => {
        const savedIncomes = localStorage.getItem('incomes')
        if (savedIncomes) {
            setIncomes(JSON.parse(savedIncomes))
        }
    }, [])

    // Save expenses to localStorage whenever they change
    useEffect(() => {
        if (incomes.length > 0) {
            localStorage.setItem('incomes', JSON.stringify(incomes))
        }
    }, [incomes])

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Create new expense object
        const newIncomes = {
            id: Date.now(), // unique ID
            amount: amount,
            item: item,
            category: category,
            date: new Date().toISOString()
        }

        // Add to expenses array
        setIncomes([...incomes, newIncomes])

        // Reset form
        setAmount(0)
        setItem('')
        setCategory('')

        // Optional: show success message
        navigate('/', { state: { showAlert: true, message: 'Income added successfully!' } });
        
    }
    return(
        <div style={{height: "100vh"}} className="w-100 p-2 d-flex justify-content-center align-items-center">
            <form onSubmit={handleSubmit} style={{backgroundColor: "white"}} className="income-form p-4 rounded-3 d-flex flex-column align-items-end justify-content-between shadow">
                <div className="w-100">
                    <div className="d-flex justify-content-between">
                        <h3>Add income</h3>
                        <a className="exit text-decoration-none" href="/">Go back</a>
                    </div>
                    <div className="w-100 mt-5">
                        <h5>Amount</h5>
                        <div className="d-flex">
                            <input min={1} onChange={(e) => setAmount(Math.max(0, (Number(e.target.value))))} style={{height: "48px"}} value={amount} className="amount-input w-100 p-2" placeholder="Enter the amount of the item" type="number" required />
                            <button onClick={() => setAmount(0)} className="reset btn btn-danger text-light" type="button">Reset</button>
                        </div>
                        <div className="d-flex w-100 justify-content-between">
                            <button className="increment-button btn p-1 p-md-2 my-2 text-primary fw-medium" type="button" onClick={() => setAmount(amount +5)}>+5</button>
                            <button className="increment-button btn p-1 p-md-2 my-2 text-primary fw-medium" type="button" onClick={() => setAmount(amount +10)}>+10</button>
                            <button className="increment-button btn p-1 p-md-2 my-2 text-primary fw-medium" type="button" onClick={() => setAmount(amount + 20)}>+20</button>
                            <button className="increment-button btn p-1 p-md-2 my-2 text-primary fw-medium" type="button" onClick={() => setAmount(amount + 50)}>+50</button>
                            <button className="increment-button btn p-1 p-md-2 my-2 text-primary fw-medium" type="button" onClick={() => setAmount(amount + 100)}>+100</button>
                            <button className="increment-button btn p-1 p-md-2 my-2 text-primary fw-medium" type="button" onClick={() => setAmount(amount + 1000)}>+1000</button>
                        </div>
                    </div>
                    <div className="w-100">
                        <h5>Item</h5>
                        <input maxLength={18} value={item} onChange={(e) => setItem(e.target.value)} style={{height: "48px"}} className="input w-100 rounded-2 p-2" placeholder="Enter the name of the item" type="text" required />
                    </div>
                    <div className="w-100">
                        <h5>Category</h5>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{height: "48px"}} className="input w-100 rounded-2 p-2" name="" id="" required>
                            <option value="">Choose category</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Bussiness">Business</option>
                            <option value="Investiment">Investiment</option>
                            <option value="Sell of an item">Sell of an item</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <input className="add" value="Add" type="submit" />
            </form>
        </div>
    )
}

export default AddIncome;