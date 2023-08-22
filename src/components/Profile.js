import { onAuthStateChanged } from 'firebase/auth'
import React,{useEffect,useState} from 'react'
import { auth } from './Firebase'
import { Navigate } from 'react-router';

export default function Profile() {

    const [user, setUser] = useState(null);

    useEffect(()=>{
        onAuthStateChanged(auth,(authUser)=>{
            setUser(authUser);
        })
    })

    if(!user){
        <Navigate to="/login" />
    }

    return(
    <>
    { user && (<div className="container">
        <div className="card mt-5">
            <h2 className='my-3 mx-auto'>User Profile</h2>
            <img src="https://img.lovepik.com/element/45001/3052.png_300.png" className="card-img-topright ms-3" style={{height:'100px',width:"100px",borderRadius:"50%"}} />
            <div className="card-body">
                <h4 className="card-title">{user.displayName}</h4>
                <p className="card-text">{user.email}&nbsp;{user.emailVerified && (<img src='https://e7.pngegg.com/pngimages/341/867/png-clipart-white-check-with-green-background-illustration-fingerprint-comcast-circle-symbol-technology-tick-miscellaneous-angle.png' style={{height:'20px',width:"20px",borderRadius:"50%"}}/> )}</p>
                <p className="card-text">Registered: {user.metadata.creationTime}</p>
                <p className="card-text">UID: {user.uid}</p>
                {/* <h5 className='card-text'>Booking History </h5> */}
            </div>
        </div>
    </div>) }
    </>
  )
}
