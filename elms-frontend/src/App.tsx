
import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from './pages/auth/register'
import Login from './pages/auth/login'
import Dashboard from './pages/manager/Dashboard'
import EmployeeDashboard from './pages/employee/Dashboard'
function App() {


  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/manager/dashboard" element={<Dashboard />}/>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />}/>
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
