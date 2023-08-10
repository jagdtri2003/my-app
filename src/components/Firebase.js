import React from 'react'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

    const firebaseConfig = {
        apiKey: "AIzaSyAgpgD0HyyaPVme1ckdqaZcR5wujV65tIA",
        authDomain: "travelkro-1e28f.firebaseapp.com",
        projectId: "travelkro-1e28f",
        storageBucket: "travelkro-1e28f.appspot.com",
        messagingSenderId: "603165283322",
        appId: "1:603165283322:web:b9710162f8a70121faca43"
      };
      
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const auth=getAuth(app);

      export {app,auth};
