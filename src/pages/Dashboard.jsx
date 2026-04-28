import React  from 'react'
import{ useState, useEffect } from "react";
import '../App.css'
import { Link, useLocation } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import AnimatedCircularProgress from '../circularProgress'

function Dashboard() {

    const location = useLocation();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [recentIncomes, setRecentIncomes] = useState([])
    const [salary, setSalary] = useState(0);
    const [salaryDate, setSalaryDate] = useState(1);
    const [currentBudget, setCurrentBudget] = useState(0);
    const [username, setUsername] = useState('User');
    const [currency, setCurrency] = useState('EGP');

    // Load personal data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('personalData');
        if (savedData) {
            const data = JSON.parse(savedData);
            setSalary(data.salary || 0);
            setSalaryDate(data.salaryDate || 1);
            setUsername(data.name || 'User');
            setCurrency(data.currency || 'EGP');
        }
    }, [location]);

    useEffect(() => {
        const savedExpenses = localStorage.getItem('expenses');
        const savedIncomes = localStorage.getItem('incomes');
        
        let totalExpenses = 0;
        let totalIncomes = 0;

        if (savedExpenses) {
            const expenses = JSON.parse(savedExpenses);
            totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        }

        if (savedIncomes) {
            const incomes = JSON.parse(savedIncomes);
            totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);
        }

        // Current budget = salary + total incomes - total expenses
        const budget = salary + totalIncomes - totalExpenses;
        if (salary) {
            setCurrentBudget(budget);
        } else {
            setCurrentBudget(0)
        }
        
    }, [salary, recentExpenses, recentIncomes, location]);

    

    // Load expenses from localStorage
    useEffect(() => {
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
            const expenses = JSON.parse(savedExpenses);
            // Get the last 3 expenses (most recent first)
            const recent = expenses.slice(-3).reverse();
            setRecentExpenses(recent);
        }
    }, [location]); // Reload when location changes (after adding new expense)

    // Load incomes from localStorage
    useEffect(() => {
        const savedIncomes = localStorage.getItem("incomes")
        if (savedIncomes) {
            const incomes = JSON.parse(savedIncomes)
            const recent = incomes.slice(-3).reverse()
            setRecentIncomes(recent)
        }
        
    }, [location])

    // Check if there's an alert to show
    useEffect(() => {
        if (location.state?.showAlert) {
            setShowAlert(true);
            setAlertMessage(location.state.message || 'Success!');
            
            // Hide alert after 3 seconds
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);

            // Clear the state so alert doesn't show on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Calculate days until next salary
    const calculateDaysRemaining = () => {
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        let nextSalaryDate;
        
        if (currentDay < salaryDate) {
            // Salary is later this month
            nextSalaryDate = new Date(currentYear, currentMonth, salaryDate);
        } else {
            // Salary is next month
            nextSalaryDate = new Date(currentYear, currentMonth + 1, salaryDate);
        }

        const diffTime = nextSalaryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    useEffect(() => {
    const checkReset = () => {
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const lastResetDate = localStorage.getItem("lastResetDate");
        const alertShown = localStorage.getItem("resetAlertShown");

        if (currentDay === salaryDate && salaryDate !== 0) {
        const currentMonthKey = `${currentYear}-${currentMonth}`;

        if (lastResetDate !== currentMonthKey) {
            localStorage.setItem("expenses", JSON.stringify([]));
            localStorage.setItem("incomes", JSON.stringify([]));
            localStorage.setItem("lastResetDate", currentMonthKey);

            setRecentExpenses([]);
            setRecentIncomes([]);
            setCurrentBudget(salary);

            if (alertShown !== currentMonthKey) {
            setShowAlert(true);
            setAlertMessage("New month started! Budget reset.");
            setTimeout(() => setShowAlert(false), 3000);

            localStorage.setItem("resetAlertShown", currentMonthKey);
            }
        }
        }
    };

  checkReset(); // run immediately

  const interval = setInterval(checkReset, 60 * 60 * 1000); // every hour

  return () => clearInterval(interval);
}, [salaryDate, salary]);

    // Format next salary date
    const formatNextSalaryDate = () => {
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        let nextSalaryDate;
        
        if (currentDay < salaryDate) {
            nextSalaryDate = new Date(currentYear, currentMonth, salaryDate);
        } else {
            nextSalaryDate = new Date(currentYear, currentMonth + 1, salaryDate);
        }

        return nextSalaryDate.toLocaleDateString('en-US', { 
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Calculate budget percentage
    const calculateBudgetPercentage = () => {
        if (salary === 0) return 0;
        if ((currentBudget / salary) * 100 > 100) {
            return 100
        } else {
            return Math.round((currentBudget / salary) * 100)
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatNumber = (num) => {
        return num.toLocaleString('en-US').replace(/,/g, ', ');
    };

    const capitalize = (str) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

    const [clearIncomes, setClearIncomes] = useState(false);
    const [clearExpenses, setClearExpenses] = useState(false);

    // Load saved preferences when component mounts
    useEffect(() => {
        const savedPreferences = localStorage.getItem('savedData');
        if (savedPreferences) {
            const prefs = JSON.parse(savedPreferences);
            setClearIncomes(prefs.clearIncomes || false);
            setClearExpenses(prefs.clearExpenses || false);
        }

        // Check if we need to clear data (new month)
        checkAndClearMonthlyData();
    }, []);

    // Check if it's a new month and clear data if needed
    const checkAndClearMonthlyData = () => {
        const lastCheckedMonth = localStorage.getItem('lastCheckedMonth');
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonthKey = `${currentYear}-${currentMonth}`;

        // If it's a new month
        if (lastCheckedMonth !== currentMonthKey) {
            const savedPreferences = localStorage.getItem('userPreferences');
            
            if (savedPreferences) {
                const prefs = JSON.parse(savedPreferences);
                
                // Clear incomes if preference is enabled
                if (prefs.clearIncomes) {
                    localStorage.setItem('incomes', JSON.stringify([]));
                }
                
                // Clear expenses if preference is enabled
                if (prefs.clearExpenses) {
                    localStorage.setItem('expenses', JSON.stringify([]));
                }
            }
            
            // Update last checked month
            localStorage.setItem('lastCheckedMonth', currentMonthKey);
        }
    };

    // Save preferences
    const handleSave = (e) => {
        e.preventDefault();
        
        const preferences = {
            clearIncomes,
            clearExpenses,
            currency
        };
        
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        
        // Show success message
        alert('Settings saved successfully!');
    }

    return(
        <div className='w-100 py-0 py-lg-2 p-lg-5 p-3 d-flex flex-column justify-content-beteen gap-4 gap-lg-3'>
            {showAlert && (
                <div className="alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" style={{zIndex: 1050, minWidth: '400px'}} role="alert">
                    <strong>Success!</strong> {alertMessage}
                    <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
                </div>
            )}
            <div className='h-auto'>
                <div className='d-flex w-100 justify-content-between align-items-center'>
                    <h1 className='fs-lg-1 p-2' >Hello, {capitalize(username)}</h1>
                </div>
                <div style={{backgroundColor: "white"}} className='progress-board position-relative w-100 py-2 py-lg-0 d-flex justify-content-evenly flex-column flex-xxl-row rounded-4 shadow-sm'>
                    {!salary ? (
                        <div className='d-flex flex-column p-2 justify-content-center align-items-center'>
                            <h3 className='information-text text-center mb-3'>Please, provide some data to get started</h3>
                            <Link to='personal-data' className='edit-no-data'>Enter data</Link>
                        </div>
                    ) : (
                        <div className='position-relative w-100 py-5 px-0 px-lg-5 px-md-1 d-flex gap-2 gap-xl-4 gap-xxl-0 justify-content-evenly flex-column flex-xxl-row'>
                            <a href='settings' className='edit-1'>Edit</a>
                            <div className='d-flex align-items-center mx-5 justify-content-center w-auto h-100'>
                            <AnimatedCircularProgress 
                                percentage={calculateBudgetPercentage()} 
                                label="Budget"
                                size={280}      
                                strokeWidth={22}
                                duration={2000}
                            />          
                            </div>
                            <div className='d-flex w-md-auto w-100 mt-xl-0 mt-4 justify-content-evenly text-dark'>
                                <div className='data-container d-flex flex-column align-items-start justify-content-center w-auto'>
                                    <div>
                                        <h5>Current budget</h5>
                                        {(currency == "$" || currency == "€") ? (
                                            <div>
                                                <h1 className="fw-medium"><span>{currency}</span>{formatNumber(currentBudget)}</h1>
                                            </div>
                                        ) : (
                                            <div>
                                                <h1 className="fw-medium">{formatNumber(currentBudget)}<span className='h4' style={{color: "gray"}}> {currency}</span></h1>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h5>Out of</h5>
                                        {(currency == "$" || currency == "€") ? (
                                            <div>
                                                <h1 className="fw-medium"><span>{currency}</span>{formatNumber(salary)}</h1>
                                            </div>
                                        ) : (
                                            <div>
                                                <h1 className="fw-medium">{formatNumber(salary)}<span className='h4' style={{color: "gray"}}> {currency}</span></h1>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='data-container d-flex flex-column align-items-start justify-content-center w-auto'>
                                    <div>
                                        <h5>Salary on</h5>
                                        <h1 className="fw-medium">{formatNextSalaryDate()}</h1>
                                    </div>
                                    <div className='d-flex flex-column text-start'>
                                        <h5 className=''>Remaining days</h5>
                                        <h1 className="fw-medium">{calculateDaysRemaining()} Days</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='w-100 h-50 d-flex flex-column flex-xxl-row gap-4'>
                <div style={{backgroundColor: "white"}} className='expenses d-flex flex-column w-100 w-lg-50 p-3 rounded-4 justify-content-between shadow'>
                    <div>
                        <div>
                            <h3>Recent expenses</h3>
                            <hr />
                        </div>
                        <div className='d-flex flex-column w-100 h-100'>
                            {recentExpenses.length > 0 ? (
                                recentExpenses.map((expense) => (
                                    <div key={expense.id} className="recent-expense d-flex justify-content-between p-2 p-md-3 w-100 align-items-center mb-2">
                                        <div className="d-flex flex-column">
                                            <div className="d-flex align-items-center mb-1">
                                                <h3 className="recent-expense-item m-0">{expense.item}</h3>
                                                <h3 className="recent-expense-category m-0 mx-1 mx-lg-1 p-1 rounded-2 fw-semibold">{expense.category}</h3>
                                            </div>
                                            <h3 className="recent-expense-date m-0 fw-semibold">{formatDate(expense.date)}</h3>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            {(currency == "$" || currency == "€") ? (
                                                <h1 className="recent-expense-number m-0 text-danger mx-2">+ {currency}{formatNumber(expense.amount)}</h1>
                                        ) : (
                                                <h1 className="recent-expense-number m-0 text-danger mx-2">+ {formatNumber(expense.amount)}<span className='h4 text-danger'> {currency}</span></h1>

                                        )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='text-center py-4 text-muted'>
                                    <p>No expenses yet. Start tracking your spending!</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='actions d-flex w-100 h-auto gap-2 justify-content-end mt-1'>
                        <Link className='add' to="/add-expense">Add</Link>
                        <Link className='view-all' to="/expenses-table">View all</Link>
                    </div>
                </div>
            <div style={{backgroundColor: "white"}} className='incomes d-flex flex-column w-100 w-lg-50 p-3 rounded-4 justify-content-between mb-5 shadow'>
                <div>
                    <div>
                        <h3>Recent incomes</h3>
                        <hr />
                    </div>
                        <div className='d-flex flex-column w-100 h-100'>
                            {recentIncomes.length > 0 ? (
                                recentIncomes.map((income) => (
                                    <div key={income.id} className="recent-income d-flex justify-content-between p-2 p-md-3 w-100 align-items-center mb-2">
                                            <div className="d-flex flex-column">
                                                <div className="d-flex align-items-center mb-1">
                                                    <h3 className="recent-income-item m-0">{income.item}</h3>
                                                    <h3 className="recent-income-category m-0 mx-1 mx-lg-1 p-1 rounded-2 fw-semibold">{income.category}</h3>
                                                </div>
                                                <h3 className="recent-income-date m-0 fw-semibold">{formatDate(income.date)}</h3>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                 {(currency == "$" || currency == "€") ? (
                                                    <h1 className="recent-expense-number m-0 text-success mx-2">+ {currency}{formatNumber(income.amount)}</h1>
                                                ) : (
                                                    <h1 className="recent-expense-number m-0 text-success mx-2">+ {formatNumber(income.amount)}<span className='h4 text-success'> {currency}</span></h1>
                                                )}
                                            </div>
                                        </div>
                                ))
                            ) : (
                                <div className='text-center py-4 text-muted'>
                                    <p>No incomes yet. Start tracking your spending!</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='actions d-flex w-100 h-auto gap-2 justify-content-end'>
                        <Link className='add' to="/add-income">Add</Link>
                        <Link className='view-all' to="/incomes-table">View all</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard