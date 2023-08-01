import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useFirebase } from "../../Context/Firebase";
import { Box, Button } from "@mui/material";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export default function Test() {
  const firebase = useFirebase();

  const demo = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(result);
        console.log(token);
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const addData = async () => {
    console.log("hi");
    const docRef = doc(firebase.db, "products", "0ihjUpLyHkrjrHmIJQsQ");
    await updateDoc(docRef, {"size.m":[]})
      .then(() => alert("updated"))
      .catch((err) => console.log(err));
  };

  
  

  return (
    <Box>
      <Button onClick={() => demo()}>google</Button>
      <Button onClick={() => addData()}>Add</Button>
      <Box>
        Crousel
      </Box>
    </Box>
  );
}



