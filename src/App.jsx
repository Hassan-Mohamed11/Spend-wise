import { useState } from 'react'
import './App.css'
import { Link, Routes, Route, NavLink } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import AddExpense from './pages/AddExpense'
import Dashboard from './pages/Dashboard'
import AddIncome from './pages/AddIncome'
import PersonalData from './pages/PersonalData'
import ExpensesTable from './pages/expensesTable'
import IncomesTable from './pages/IncomesTable'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'


function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='d-flex flex-column flex-lg-row'>
      <aside className="p-3 d-flex flex-lg-column flex-row justify-content-start">
        <div className='d-flex justify-content-between w-100'>
          <div className='d-flex align-items-center'>
            <img className='logo' src="./spendWise-logo.png" alt="" />
            <a className='text-decoration-none fs-2 fw-medium mx-1' href="/">SpendWise</a>
          </div>
          <img className='d-block d-lg-none' onClick={() => setSidebarOpen(!sidebarOpen)} width={38} src="./menu.png" alt="" />
        </div>
        <div className="my-4 fw-medium fs-4 text-dark d-lg-block d-none w-100">
          <ul className='list-unstyled w-100'>
            <li className=''><NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/">Dashboard</NavLink></li>
            <li className=''><NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/analytics">Analytics</NavLink></li>
            <li className=''><NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/settings">Settings</NavLink></li>
          </ul>
        </div>
      </aside>
      <div className={`${sidebarOpen ? 'mobile-sidebar-open' : 'mobile-sidebar-closed'} fw-medium fs-4 text-dark d-lg-none d-block`}>
          <a className='text-decoration-none fs-1 fw-medium' href="/">SpendWise</a>
          <ul className='list-unstyled my-4'>
            <li><a className='text-decoration-none text-dark' href="/">Dashboard</a></li>
            <li><a className='text-decoration-none text-dark' href="">Analytics</a></li>
            <li><a className='text-decoration-none text-dark' href="">Settings</a></li>
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
          <Route path='/analytics' element={<Analytics />} />
        </Routes>
      </article>
    </div>
  )
}

export default App
