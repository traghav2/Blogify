import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
// import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
// import { FirebaseUIAuth } from "https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAEkVsysFqC9zu65z2arAfLwAij_2lgNc0",
    authDomain: "blogify-4194c.firebaseapp.com",
    projectId: "blogify-4194c",
    storageBucket: "blogify-4194c.appspot.com",
    messagingSenderId: "1067765269749",
    appId: "1:1067765269749:web:e14a22d6cf70060a32b1bc",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  let ui = new firebaseui.auth.AuthUI(auth);

  let login = document.querySelector('.login');

  const setupLoginButton = () => {
    ui.start('#loginUI', {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectURL){
                console.log(authResult);
                return false;
            }
        },
        signInFlow: "popup",
        signInOptions: [ifi.GoogleAuthProvider.PROVIDER_ID]
    })
  }

  setupLoginButton();