import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
// import { FirebaseUIAuth } from "https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEkVsysFqC9zu65z2arAfLwAij_2lgNc0",
  authDomain: "blogify-4194c.firebaseapp.com",
  projectId: "blogify-4194c",
  storageBucket: "blogify-4194c.appspot.com",
  messagingSenderId: "1067765269749",
  appId: "1:1067765269749:web:e14a22d6cf70060a32b1bc"
};

// Initialize Firebase
const body = document.body;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let linkContainer = document.querySelector('.links-container');
const signInButton = document.getElementById('login-btn');
const loginContainer = document.getElementById('login');
const dashboardContent = document.getElementById('signed-in');
const dashboardLink = document.getElementById('dashboard-link');
const dashboardLinkEditor = document.getElementById('dashboard-link-editor');
const blogSection = document.querySelector('.blogs-section');

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
    console.log(auth);
    loginContainer.remove();
    body.appendChild(dashboardContent);
    getUserBlogs(auth);

  } else {
    dashboardContent.remove();
    body.appendChild(loginContainer);
    dashboardLink.remove();
    dashboardLinkEditor.remove();
  }
})


const getUserBlogs = async (auth) => {
  const docRef = await query(collection(db, "blogs"), where("author", "==", auth.currentUser.email.split('@')[0]));
  const querySnapShot = await getDocs(docRef);
  querySnapShot.forEach((blog) => {
    blogCard(blog);
  })
}
async function blogCard(blog) {
  let data = await blog.data();
  const blogSectionContent = `<div class="blog-card">
<img src="${data?.bannerImage}" alt="" class="blog-image">
<h1 class="blog-title">${data?.title.substring(0, 100) + '...'}</h1>
<p class="blog-overview">${data?.article.substring(0, 200) + '...'}</p>
<p class="published">${data?.publishedAt}</p>
<a href="/${blog.id}" class="btn">Read</a>
<a href="/${blog.id}/editor" class="btn-grey>edit</a>
<a href=""  onclick = "deleteBlog('${blog.id}')" class="btn-danger>Delete</a>
</div>`
  blogSection.innerHTML += blogSectionContent;
}

signInButton.addEventListener('click', userSignIn);
dashboardLink.addEventListener('click', userLogOut);
