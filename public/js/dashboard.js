import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, doc, deleteDoc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

const signInButton = document.getElementById('login-btn');
const loginContainer = document.getElementById('login');
const dashboardContent = document.getElementById('signed-in');
const dashboardLink = document.getElementById('dashboard-link');
const dashboardLinkEditor = document.getElementById('dashboard-link-editor');
const blogSection = document.querySelector('.blogs-section');

async function deleteBlog(id) {
  await deleteDoc(doc(db, "blogs", String(id))).then(() => {
    alert("Blog deleted!");
    location.reload();
  })
}

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

  // Create the blog card div element
  const blogCard = document.createElement("div");
  blogCard.classList.add("blog-card");

  // Create the image element
  const img = document.createElement("img");
  img.src = data?.bannerImage;
  img.alt = "";
  img.classList.add("blog-image");

  // Create the title element
  const h1 = document.createElement("h1");
  h1.classList.add("blog-title");
  h1.textContent = data?.title.substring(0, 100) + "...";

  // Create the overview element
  const p1 = document.createElement("p");
  p1.classList.add("blog-overview");
  p1.textContent = data?.article.substring(0, 200) + "...";

  // Create the published element
  const p2 = document.createElement("p");
  p2.classList.add("published");
  p2.textContent = data?.publishedAt;

  // Create the read button element
  const a1 = document.createElement("a");
  a1.href = `/${blog.id}`;
  a1.classList.add("btn");
  a1.textContent = "Read";

  // Create the edit button element
  const a2 = document.createElement("a");
  a2.href = `/${blog.id}/editor`;
  a2.classList.add("btn-black");
  a2.textContent = "Edit";

  const deleteBtn = document.createElement("a");
  deleteBtn.setAttribute("href", "#");
  deleteBtn.setAttribute("class", "btn-danger");
  deleteBtn.textContent = "Delete";

  // Append the elements to the blogCard element
  blogCard.appendChild(img);
  blogCard.appendChild(h1);
  blogCard.appendChild(p1);
  blogCard.appendChild(p2);
  blogCard.appendChild(a1);
  blogCard.appendChild(a2);
  blogCard.appendChild(deleteBtn);

  // Append the blogCard element to the blogSectionContent element
  blogSection.appendChild(blogCard);

  deleteBtn.addEventListener('click', async () => {
    await deleteBlog(blog.id);
  });}


signInButton.addEventListener('click', userSignIn);
dashboardLink.addEventListener('click', userLogOut);
