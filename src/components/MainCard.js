import React from 'react'
import Flights from './Flights'
import Hotel from './Hotel'
import { Container } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from './Firebase';
import VerifyEmail from './VerifyEmail';

export default function MainCard({user}) {


  const SignOut =()=>{
    signOut(auth);
  }

  document.title="TravelKro";
  let displayName=user.displayName;
  const savedDisplayName = localStorage.getItem('displayName');
  if (savedDisplayName) {
    displayName=savedDisplayName;
  }
  return (
    <>
    {displayName && <p>Welcome, <b>{displayName} ! &nbsp;</b> <i class="fa-solid fa-right-from-bracket" title='Signout' style={{color:'red'}} onClick={SignOut}></i></p>}
    {user.emailVerified ? <div>
      <ul className="nav nav-tabs" id="myTab" role="tablist">
      <li className="nav-item" role="presentation">
          <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true"><i class="fa-solid fa-plane-up"></i> Flights</button>
      </li>
      <li className="nav-item" role="presentation">
          <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false"><i class="fa-solid fa-hotel"></i> Hotels</button>
      </li>
      <li className="nav-item" role="presentation">
          <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false"><i class="fa-solid fa-car"></i> Car Rent</button>
      </li>
      </ul>
      <div className="tab-content my-2" id="myTabContent">
      <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0"><Flights/></div>
      <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">{<Hotel/>}</div>
      <div className="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" style={{ minHeight: '65vh' }} tabIndex="0">    <Container fluid className="p-0 flex-grow-1">
        {/* No content inside */}
        <h3>Coming Soon...</h3>
      </Container></div>
      </div>
    </div>
    :<VerifyEmail/>}
    </>
  )
}
