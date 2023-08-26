import { serverTimestamp,doc,setDoc } from 'firebase/firestore';
import React,{useState} from 'react';
import { db } from './Firebase';

export default function ContactUs() {

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Message,setMessage]=useState("");
  
  const handleSubmit = (e) =>{
    e.preventDefault();
    const rand=Math.round(Math.random()*100000)
    const path=doc(db,"message",Email.concat(rand));
    const data={
      Name:Name,
      Email:Email,
      Message:Message,
      date:serverTimestamp()
    }
    setDoc(path,data);
    setName("");
    setEmail("");
    setMessage("");
  }


  document.title="TravelKro-Contact Us";
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-12">
          <h2>Contact Us</h2>
          <p>
            Have questions or feedback? Feel free to reach out to us anytime. We're here to assist you on your travel journey.
          </p>
          <p>
            You can contact us via email, phone, or by filling out the form below. We'll get back to you as soon as possible.
          </p>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-6 my-3">
          <h3>Contact Form</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" value={Name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" value={Email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea className="form-control" id="message" rows="4" value={Message} onChange={(e)=>setMessage(e.target.value)}></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
        <div className="col-lg-6 my-3">
          <h3>Contact Information</h3>
          <p>Email: contact@travelkro.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
}
