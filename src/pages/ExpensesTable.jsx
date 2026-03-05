import { useState, useEffect, Link } from "react";
import React from "react";
import "../ExpensesTable.css"

function ExpensesTable() {

    const [expenses, setExpenses] = useState([])
    const [totalExpenses, setTotalExpenses] = useState(0)

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = () => {
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
            const expensesData = JSON.parse(savedExpenses);
            setExpenses(expensesData.reverse()); // Show newest first
            
            // Calculate total
            const total = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
            setTotalExpenses(total);
        }
    };

    // Delete expense
    const handleDelete = (id) => {
        // Confirm deletion
        if (window.confirm('Are you sure you want to delete this expense?')) {
            // Filter out the expense
            const updatedExpenses = expenses.filter(expense => expense.id !== id);
            
            // Update localStorage
            localStorage.setItem('expenses', JSON.stringify(updatedExpenses.reverse()));
            
            // Reload expenses
            loadExpenses();
        }
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all expenses?")) {
            localStorage.removeItem("expenses");
            setExpenses([]);
            setTotalExpenses(0);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatNumber = (num) => {
        return num.toLocaleString('en-US').replace(/,/g, ', ');
    };

    return (
        <div className="p-1 p-lg-5">
            <a className='add-to-table-btn-sm' href="/add-expense">+</a>
            <div>
                <div className="container p-2 p-lg-3 w-100 bg-light d-flex flex-column rounded-3">
                    <div className="w-100 d-flex flex-column">
                        <div className="d-flex w-auto p-2 justify-content-between">
                            <div className="d-flex align-items-center">
                                <h3 className="title m-0">Total expenses</h3>
                                <h2 className="total-expenses m-0 mx-1 mx-sm-3 text-danger rounded-2 p-1 p-xs-2">{formatNumber(totalExpenses)} <span>EGP</span></h2>
                            </div>
                            <div className="d-flex align-items-center">
                                <button disabled={expenses.length == 0} className="clear-all-expenses btn btn-outline-danger border-2 px-3 py-1 py-lg-2 mx-0 mx-sm-2" onClick={() => handleClearAll()}>Clear</button>
                                <a className='add-to-table-btn btn px-3 py-1 py-lg-2' href="/add-expense">Add</a>
                            </div>
                            
                        </div>
                        <hr />
                        <div className="d-flex flex-column">
                            {expenses.length > 0 ? (
                                expenses.map((expense) => (
                                    <div key={expense.id} className="expense d-flex justify-content-between p-2 p-md-3 w-100 rounded-3 align-items-center mb-2">
                                        <div className="d-flex flex-column">
                                            <div className="d-flex align-items-center mb-1">
                                                <h3 className="expense-item m-0">{expense.item}</h3>
                                                <h3 className="category m-0 mx-1 mx-lg-1 p-1 p-lg-2 rounded-2">{expense.category}</h3>
                                            </div>
                                            <h3 className="date m-0 fw-light">{formatDate(expense.date)}</h3>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <h2 className="expense-amount m-0 text-danger mx-2">- {formatNumber(expense.amount)} <span className="fs-6">EGP</span></h2>
                                            <button 
                                                className="delete bg-transparent" 
                                                onClick={() => handleDelete(expense.id)}
                                                type="button"
                                            >
                                                <img className="trash" src="./trash.png" alt="Delete" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-100 d-flex justify-content-center">
                                    <p>No expenses recorded yet. Start tracking your spending!</p>
                                </div>
                            )}
                        </div>                       
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpensesTable