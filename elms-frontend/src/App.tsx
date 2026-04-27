
import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from './pages/auth/register'
import Login from './pages/auth/login'


function App() {


  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/register" element={<Register />}/>

        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
