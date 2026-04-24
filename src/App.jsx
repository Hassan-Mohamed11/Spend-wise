import { use, useState } from 'react'
import './App.css'
import { Link, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import AddExpense from './pages/AddExpense'
import Dashboard from './pages/Dashboard'
import AddIncome from './pages/AddIncome'
import PersonalData from './pages/PersonalData'
import ExpensesTable from './pages/ExpensesTable'
import IncomesTable from './pages/IncomesTable'
import Settings from './pages/Settings'
import ExpensesAnalytics from './pages/ExpensesAnalytics'
import IncomesAnalytics from './pages/IncomesAnalytics'


function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const location = useLocation();

  return (
    <div className='d-flex flex-column flex-lg-row'>
      <aside className="p-3 d-flex flex-lg-column flex-row justify-content-start">
        <div className='d-flex justify-content-between w-100'>
          <div className='d-flex align-items-center'>
            <img className='logo' src="./spendWise-logo.png" alt="" />
            <Link className='text-decoration-none fs-2 fw-medium mx-1' to="/">SpendWise</Link>
          </div>
          <img className='d-block d-lg-none' onClick={() => setSidebarOpen(!sidebarOpen)} width={38} src="./menu.png" alt="" />
        </div>
        <div className="my-4 fw-medium fs-4 text-dark d-lg-block d-none w-100">
          <ul className='list-unstyled w-100'>
            <li><NavLink onClick={() => setAnalyticsOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/">Dashboard</NavLink></li>
            <li><NavLink onClick={() => setAnalyticsOpen(true)} className={({ isActive }) => location.pathname === "/expenses-analytics" || location.pathname === "/incomes-analytics"  ? "nav-link active" : "nav-link"} to="/expenses-analytics">Analytics</NavLink></li>
            <div className={`${analyticsOpen ? "analytics-open" : "analytics-closed"} flex-column p-2`}>
              <NavLink className={({ isActive }) => isActive ? "analytic-link open" : "analytic-link text-dark"} to="/expenses-analytics">Expenses</NavLink>
              <NavLink className={({ isActive }) => isActive ? "analytic-link open" : "analytic-link text-dark"}  to="/incomes-analytics">Incomes</NavLink>
            </div>
            <li className=''><NavLink onClick={() => setAnalyticsOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/settings">Settings</NavLink></li>
          </ul>
        </div>
      </aside>
      <div className={`${sidebarOpen ? 'mobile-sidebar-open' : 'mobile-sidebar-closed'} fw-medium fs-4 text-dark d-lg-none d-block`}>
          <div className='d-flex align-items-center'>
            <img className='logo' src="./spendWise-logo.png" alt="" />
            <a className='text-decoration-none fs-2 fw-medium mx-1' href="/">SpendWise</a>
          </div>
          <ul className='list-unstyled my-4'>
            <li className='my-2'><Link onClick={() => setAnalyticsOpen(false)} className='text-decoration-none text-dark'>Dashboard</Link></li>
            <li className='my-2'><Link onClick={() => setAnalyticsOpen(true)} className='text-decoration-none text-dark' >Analytics</Link></li>
            <div className={`${analyticsOpen ? "analytics-open" : "analytics-closed"} flex-column p-1 rounded-2 m-0`}>
              <NavLink className="text-decoration-none text-dark my-1" to="/expenses-analytics">Expenses</NavLink>
              <NavLink className="text-decoration-none text-dark my-1" to="/incomes-analytics">Incomes</NavLink>
            </div>
            <li className='my-2'><Link onClick={() => setAnalyticsOpen(false)} className='text-decoration-none text-dark' to="/settings">Settings</Link></li>
          </ul>
        </div>
        {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <article className='w-100'>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/add-expense" element={<AddExpense />}/>
          <Route path="/add-income" element={<AddIncome />}/>
          <Route path='/personal-data' element={<PersonalData />} />
          <Route path='/expenses-table' element={<ExpensesTable />} />
          <Route path='/incomes-table' element={<IncomesTable />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/expenses-analytics' element={<ExpensesAnalytics />} />
          <Route path='/incomes-analytics' element={<IncomesAnalytics />} />
        </Routes>
      </article>
    </div>
  )
}

export default App
