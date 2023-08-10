import React, { useState,useEffect } from 'react';
import { Link,Navigate} from 'react-router-dom';
import { createUserWithEmailAndPassword,onAuthStateChanged,updateProfile,sendEmailVerification } from 'firebase/auth';
import { auth } from './Firebase';


const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggein,setLoggedin]=useState(false);
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        sendEmailVerification(userCredential.user);
        localStorage.setItem('displayName', name);
        localStorage.setItem('password', password);
        await updateProfile(userCredential.user, {
        displayName: name
      });
    }).catch((error) => {
        setError(error.message);
    });

  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedin(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if(loggein){
    return <Navigate to="/"/>
  }


  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Sign Up</h2>
              <form onSubmit={handleSignup}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className='text-danger'>
                    {error}
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
              </form>
              <p className="mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
