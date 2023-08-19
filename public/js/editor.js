// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const body = document.body;
const signInButton = document.getElementById('login-btn');
const loginContainer = document.getElementById('login');
const homePageContent = document.getElementById('signed-in');
const dashboard = document.getElementById('dashboard');

const blogTitleField = document.querySelector(".title");
const article = document.querySelector(".article");

const bannerImage = document.querySelector("#banner-upload");
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector(".publish-btn");
const uploadInput = document.querySelector("#image-upload");

uploadInput.addEventListener("change", () => {
  uploadImage(uploadInput, "image");
});

bannerImage.addEventListener("change", () => {
  uploadImage(bannerImage, "banner");
});

const uploadImage = async (uploadFile, uploadType) => {
  const [file] = uploadFile.files;
  if (file && file.type.includes("image")) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/upload", {
      method: "post",
      body: formData,
    });

    console.log(response);

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (uploadType == "image") {
        const imagePath = data;
        addImage(imagePath, file.name);
      } else {
        bannerPath = `${location.origin}/${data}`;
        banner.style.backgroundImage = `url("${bannerPath}")`;
      }
    }
  } else {
    alert("Image Upload Only!");
  }
};

const addImage = (imagePath, alt) => {
  console.log(imagePath);
  let curPos = article.selectionStart;
  let textToInsert = `\r![${alt}](${imagePath})\r`;
  article.value =
    article.value.slice(0, curPos) +
    textToInsert +
    article.value.slice(curPos);
};

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener("click", () => {
  if (article.value.length && blogTitleField.value.length) {
    let letters = "abcdefghijklmnopqrstuvwxyz";
    const blogTitle = blogTitleField.value.split(" ").join("-");
    let id = '';

    for (let i = 0; i < 4; i++) {
      id += letters[Math.floor(Math.random() * letters.length)];
    }

    let docName = `${blogTitle}-${id}`;
    let date = new Date();
    const docRef = doc(db, "blogs", docName);

    const data = {
      title: blogTitleField.value,
      article: article.value,
      bannerImage: bannerPath,
      publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
      author: auth.currentUser.email.split("@")[0]
    };

    setDoc(docRef, data).then(() => {
      location.href = `/${docName}`;
    })
      .catch((err) => {
        console.error(err);
      });
  }
});

const userSignIn = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      location.reload();
      console.log(user);
    }).catch((error) => {
      const errCode = error.code;
      const errMessage = error.message;
    })
}

function userLogOut() {
  signOut(auth).then(() => {
    console.log("signed out");
  }).catch((error) => {
    console.log(error);
  })
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginContainer.remove();
    body.appendChild(homePageContent);
    // linkContainer.appendChild(dashboardLink);
    // linkContainer.appendChild(dashboard);

  } else {
    homePageContent.remove();
    body.appendChild(loginContainer);
    dashboard.remove();
    dashboardLinkEditor.remove();
    dashboard.remove();
  }
})

signInButton.addEventListener('click', userSignIn);
dashboardLink.addEventListener('click', userLogOut);