import React from 'react'
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth,setPersistence} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


    const firebaseConfig = {
      apiKey:process.env.REACT_APP_API_KEY,
      authDomain:process.env.REACT_APP_AUTH_DOMAIN,
      projectId:process.env.REACT_APP_PROJECT_ID,
      storageBucket:process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId:process.env.REACT_APP_MESSAGING_SENDER_ID,
      appId:process.env.REACT_APP_APP_ID,
    };
      
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const auth=getAuth(app);
      const db = getFirestore(app);

      // Enable persistence
      setPersistence(auth,browserLocalPersistence);

      export {app,auth,db};
