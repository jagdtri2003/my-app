import { onAuthStateChanged,signOut,updateProfile } from 'firebase/auth'
import React,{useEffect,useState} from 'react'
import { auth } from './Firebase'
import { Navigate } from 'react-router';
import Button from 'react-bootstrap/esm/Button';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // Track if the user is in edit mode
    const [newName, setNewName] = useState(''); // Store the edited name
  
    useEffect(() => {
      onAuthStateChanged(auth, (authUser) => {
        setUser(authUser);
      });
  
      setInterval(() => {
        setLoading(false);
      }, 100);
    }, []);
  
    // Function to handle name edit
    const handleNameEdit = () => {
      setIsEditing(true);
      setNewName(user.displayName || ''); // Initialize the input with the current name
    };
  
    // Function to save the edited name
    const saveEditedName = () => {
      // You can add validation here to ensure the name is not empty or meets certain criteria
      if (newName.trim() === '') {
        alert('Please enter a valid name.');
        return;
      }
  
      updateProfile(user,{ displayName: newName }).then(() => {
        localStorage.setItem('displayName',newName);
        setIsEditing(false);
      });
    };
  
    if (loading) {
      return (
        <div className='centered-container'>
          <div class="spinner-7"></div>
        </div>
      );
    }
  
    if (!user) {
      return <Navigate to="/login" />;
    }
  
    return (
      <>
        {user && (
          <div className="container">
            <div className="card mt-5">
              <h2 className='my-3 mx-auto'>User Profile</h2>
              <img src="https://img.lovepik.com/element/45001/3052.png_300.png" className="card-img-topright ms-3" style={{ height: '100px', width: "100px", borderRadius: "50%" }} />
              <div className="card-body">
                <h4 className="card-title">
                  {isEditing ? (
                    <input
                      type="text"
                      value={newName}
                      autoFocus
                      style={{border:"none",outline:"none"}}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  ) : (
                    <>
                      {user.displayName}&nbsp;
                      {(user.uid === "9pC2jjuKalUriFU7uucmCCgGORr1" ||
                        user.uid === "2IoMMKBEgaRN2pvToZR0fAp3sgo2" ||
                        user.uid === "E8fSTnd0uOc59lnF99fMPAAkEGV2") && (
                        <i
                          className="fa-solid fa-badge-check"
                          title="Verified User"
                          style={{ color: "#0d6efd" }}
                        ></i>
                      )}
                    </>
                  )}
                </h4>
                <p className="card-text">{user.email}&nbsp;{!user.emailVerified && (" [Unverified]")}</p>
                <p className="card-text">Registered: {user.metadata.creationTime}</p>
                <p className="card-text">UID: {user.uid}</p>
                
                <Button variant='danger' onClick={() => {
                  signOut(auth);
                  return <Navigate to="/login" />;
                }}>SignOut</Button>
                &nbsp;&nbsp;
                {isEditing ? (
                  <Button onClick={saveEditedName}>Save</Button>
                ) : (
                  <Button onClick={handleNameEdit}>Update Profile</Button> 
                )}                
              </div>
            </div>
          </div>
        )}
      </>
    )
  }