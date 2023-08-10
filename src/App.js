import './App.css';
import MainCard from './components/MainCard';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import About from './components/About';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {auth} from './components/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import React,{useEffect,useState} from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import SignOut from './components/SignOut';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setInterval(() => {
        setLoading(false);
      },250);
      
    });

    return () => unsubscribe();
  }, []);


  if (loading) {
    // Render a loading indicator while checking authentication state
    return(
      <div className='centered-container'>
        <div class="spinner-7"></div>
      </div>  
    );
  }


  return (
    <Router>
      <>
        <Navbar title="TravelKro" />
        <div className="container my-4">
        <Routes>
          <Route path="/" element={user ? <MainCard user={user}/> : <Navigate to="/signup" />} />
          <Route path='/signup' element={<Signup/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
        </div>
        <Footer/>
      </>
    </Router>
  );
}

export default App;
