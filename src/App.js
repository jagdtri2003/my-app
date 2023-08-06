import './App.css';
import MainCard from './components/MainCard';
import Modal from './components/Modal';
import Navbar from './components/Navbar';
import Flights from './components/Flights';



function App() {
  return (
    <>
    <Navbar title="TravelKro"/>
    <div className="container my-4 mx-6">
      <MainCard flights={<Flights/>}/>
    </div>
    </>
  );
}

export default App;
