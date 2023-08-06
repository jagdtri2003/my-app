import './App.css';
import MainCard from './components/MainCard';
import Modal from './components/Modal';
import Navbar from './components/Navbar';



function App() {
  return (
    <>
    <Navbar title="TravelKro"/>
    <div className="container-sm my-4 mx-6">
      <MainCard/>
    </div>
    </>
  );
}

export default App;
