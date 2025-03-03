import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAD2i4ak8hc2WvXQBIchIt3Ucq1MwYoKDk",
  authDomain: "trade-miao.firebaseapp.com",
  projectId: "trade-miao",
  storageBucket: "trade-miao.firebasestorage.app",
  messagingSenderId: "703425916929",
  appId: "1:703425916929:web:a1a118e3a3482273039000"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const continueWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, provider);
    if (!user) return;

    const [firstName, lastName] = user.displayName?.split(" ") || ["", ""];
    const email = user.email || "";
    const nameOfSpace = `${firstName}'s Space`;

    const formData = {
      firstName,
      lastName,
      email,
      nameOfSpace,
      isVerified: true, // Assuming Google sign-in users are verified
    };

    console.log(user);
    return {
      success : true,
      message : "Done",
      data : formData
    };
  } catch (error: any) {
    if (error.code === "auth/popup-closed-by-user") {
      return {
        success : false,
        message : "User closed the sign-in popup"
      };
    } else {
      return {
        success : false,
        message :`Error signing in: ${error}`
      };
    }
  }
};


export { auth, provider };
