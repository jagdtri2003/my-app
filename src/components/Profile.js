import { onAuthStateChanged,signOut } from 'firebase/auth'
import React,{useEffect,useState} from 'react'
import { auth } from './Firebase'
import { Navigate } from 'react-router';
import Button from 'react-bootstrap/esm/Button';

export default function Profile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        onAuthStateChanged(auth,(authUser)=>{
            setUser(authUser);
        })

        setInterval(()=>{
            setLoading(false);
        },100);
    })

    if (loading) {
        // Render a loading indicator while checking authentication state
        return(
          <div className='centered-container'>
            <div class="spinner-7"></div>
          </div>  
        );
      }

    if(!user){
        return <Navigate to="/login" />
    }

    return(
    <>
    { user && (<div className="container">
        <div className="card mt-5">
            <h2 className='my-3 mx-auto'>User Profile</h2>
            <img src="https://img.lovepik.com/element/45001/3052.png_300.png" className="card-img-topright ms-3" style={{height:'100px',width:"100px",borderRadius:"50%"}} />
            <div className="card-body">
                <h4 className="card-title">{user.displayName}
                {(user.uid==="9pC2jjuKalUriFU7uucmCCgGORr1" || user.uid==="2IoMMKBEgaRN2pvToZR0fAp3sgo2" || user.uid==="E8fSTnd0uOc59lnF99fMPAAkEGV2")&&<i class="fa-solid fa-badge-check" title="Verified User" style={{color: "#0d6efd"}}></i>
                }
                </h4>
                <p className="card-text">{user.email}&nbsp;{!user.emailVerified && (" [Unverified]")}</p>
                <p className="card-text">Registered: {user.metadata.creationTime}</p>
                <p className="card-text">UID: {user.uid}</p>
                {/* <h5 className='card-text'>Booking History </h5> */}
                <Button variant='danger' onClick={()=>{
                    signOut(auth)
                    return <Navigate to="/login" />
                }}>SignOut</Button>
            </div>
        </div>
    </div>) }
    </>
  )
}
