import React, { useState,useEffect } from 'react';
import { Link,Navigate} from 'react-router-dom';
import { signInWithEmailAndPassword,onAuthStateChanged } from 'firebase/auth';
import {auth} from './Firebase';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggein, setLoggedin] = useState(false);
  const [error, setError] = useState('');
  const [eye, setEye] = useState('fa-solid fa-eye');
  

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth,email,password).catch((err)=>{
        setError(err.message);
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

  const togglePassword = ()=>{
    document.getElementById("password").type=document.getElementById("password").type==="password"?"text":"password";
    if(eye==="fa-solid fa-eye"){
      setEye('fa-solid fa-eye-slash');
    }else{
      setEye('fa-solid fa-eye');
    }   
  }


  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <i className="fa-regular fa-envelope"></i>&nbsp;
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
                <div className="mb-3" style={{ position: "relative" }}>
                  <i className="fa-regular fa-lock"></i>&nbsp;
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  /><i class={eye} id="show" onClick={togglePassword} style={{
                    position: "absolute",
                    right: "10px",
                    top: "71%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}></i>
                </div>
                <div className='mb-2 text-danger'>
                    {error.substring(9,error.length)}
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
              </form>
              <p className="mt-3">
                Don't have an account? <Link to="/signup">Sign Up</Link>
                &nbsp;
                {' | '}&nbsp;&nbsp;
                <Link to="/forgot-password">Forgot Password ?</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
