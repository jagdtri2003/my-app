import './App.css';
import MainCard from './components/MainCard';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './components/About';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';



function App() {
  return (
    <Router>
      <>
        <Navbar title="TravelKro" />
        <div className="container my-4">
          <Routes>
            <Route path="/" element={<MainCard />} />
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
