import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, doc, collection, setDoc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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
const blogSection = document.querySelector('.blogs-section');
const signInButton = document.getElementById('login-btn');
const loginContainer = document.getElementById('login');
const homePageContent = document.getElementById('signed-in');
const dashboardLink = document.getElementById('dashboard-link');
const dashboardLinkEditor = document.getElementById('dashboard-link-editor');
const dashboard = document.getElementById('dashboard');

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
    dashboardLink.remove();
    dashboardLinkEditor.remove();
    dashboard.remove();
  }
})


async function blogCard(blog) {
  let data = await blog.data();
  console.log(data.article);
  blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${data?.bannerImage}" alt="" class="blog-image">
        <h1 class="blog-title">${data?.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${data?.article.substring(0, 200) + '...'}</p>
        <p class="published">${data?.publishedAt}</p>
        <a href="/${blog.id}" class="btn">Read</a>
    </div>
    `;
}

const docRef = collection(db, "blogs");

async function getAllBlogs() {
  const blogs = await getDocs(docRef);
  blogs.forEach(blog => {
    blogCard(blog);
  });
}

getAllBlogs();

signInButton.addEventListener('click', userSignIn);
dashboardLink.addEventListener('click', userLogOut);
