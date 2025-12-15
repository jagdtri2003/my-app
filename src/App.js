import './App.css';
import MainCard from './components/MainCard';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import About from './components/About';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
// import '@fortawesome/fontawesome-free/css/all.min.css';
import { auth } from './components/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile';
import Payment from './components/MCPPayment';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        localStorage.setItem("displayName", authUser.displayName);
      } else {
        setUser(null);
      }
      setInterval(() => {
        setLoading(false);
      }, 250);
    });

    return () => unsubscribe();
  }, []);


  if (loading) {
    // Render a loading indicator while checking authentication state
    return (
      <div className='centered-container'>
        <div className="spinner-7"></div>
      </div>
    );
  }

  return (
    <Router>
      <>
        <Navbar title="TravelKro" />
        <div className="container my-4" id="mainContainer">
          <Routes>
            <Route path="/" element={user ? <MainCard user={user} /> : <Navigate to="/login" />} />
            <Route path='/register' element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/payment' element={<Payment />} />
          </Routes>
        </div>
        <Footer />
      </>
    </Router>
  );
}

export default App;
