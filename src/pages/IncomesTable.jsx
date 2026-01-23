import { useState, useEffect } from "react";
import React from "react";
import "../IncomesTable.css"

function IncomesTable() {

    const [incomes, setIncomes] = useState([])
    const [totalIncomes, setTotalIncomes] = useState(0)

    useEffect(() => {
        loadIncomes();
    }, []);

    const loadIncomes = () => {
        const savedIncomes = localStorage.getItem('incomes');
        if (savedIncomes) {
            const incomesData = JSON.parse(savedIncomes);
            setIncomes(incomesData.reverse()); // Show newest first
            
            // Calculate total
            const total = incomesData.reduce((sum, incomes) => sum + incomes.amount, 0);
            setTotalIncomes(total);
        }
    };

    // Delete Income
    const handleDelete = (id) => {
        // Confirm deletion
        if (window.confirm('Are you sure you want to delete this income?')) {
            // Filter out the Income
            const updatedIncomes = incomes.filter(incomes => incomes.id !== id);
            
            // Update localStorage
            localStorage.setItem('incomes', JSON.stringify(updatedIncomes.reverse()));
            
            // Reload Income
            loadIncomes();
        }
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all incomes?")) {
            localStorage.removeItem("incomes");
            setIncomes([]);
            setTotalIncomes(0);
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
            <a className='add-to-table-btn-sm' href="/add-income">+</a>
            <div>
                <div className="container p-2 p-lg-3 w-100 bg-light d-flex flex-column rounded-3">
                    <div className="w-100 d-flex flex-column">
                        <div className="d-flex w-auto p-2 justify-content-between mb-2">
                            <div className="d-flex align-items-center">
                                <h3 className="title m-0">Total incomes</h3>
                                <h2 className="total-incomes m-0 mx-1 mx-sm-3 text-success p-1 p-sm-2 rounded-2">{formatNumber(totalIncomes)} <span>EGP</span></h2>
                            </div>
                            <div className="d-flex align-items-center">
                                <button disabled={incomes.length == 0} className="clear-all-incomes btn bg-transparent btn-outline-danger border-2 px-3 py-1 py-lg-2 mx-0 mx-sm-2" onClick={() => handleClearAll()}>Clear</button>
                                <a className='add-to-table-btn px-3 py-1 py-lg-2' href="/add-income">Add</a>
                            </div>
                            
                        </div>
                        <hr />
                        <div className="d-flex flex-column">
                            {incomes.length > 0 ? (
                                incomes.map((income) => (
                                    <div key={income.id} className="income d-flex justify-content-between p-2 p-lg-3 w-100 rounded-3 align-items-center mb-2">
                                        <div className="d-flex flex-column">
                                            <div className="d-flex align-items-center mb-1">
                                                <h3 className="income-item m-0">{income.item}</h3>
                                                <h3 className="category m-0 mx-1 mx-lg-1 p-1 p-lg-2 rounded-2">{income.category}</h3>
                                            </div>
                                            <h3 className="date m-0 fw-light">{formatDate(income.date)}</h3>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <h2 className="income-amount m-0 text-success mx-2">+ {formatNumber(income.amount)} <span className="fs-6">EGP</span></h2>
                                            <button 
                                                className="delete" 
                                                onClick={() => handleDelete(income.id)}
                                                type="button"
                                            >
                                                <img className="trash" src="./trash.png" alt="Delete" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-100 d-flex justify-content-center">
                                    <p>No incomes recorded yet. Start tracking your spending!</p>
                                </div>
                            )}
                        </div>                       
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IncomesTable