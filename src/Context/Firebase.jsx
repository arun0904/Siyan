import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIAb_0CjK5iJ4p_9WgU97nBOkSnoTdEUA",
  authDomain: "neongenesis-678d9.firebaseapp.com",
  projectId: "neongenesis-678d9",
  storageBucket: "neongenesis-678d9.appspot.com",
  messagingSenderId: "732058262938",
  appId: "1:732058262938:web:84938bcec17d42eec16e23",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState(null);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [userAccountInfo, setUserAccountInfo] = useState(null);
  const [product, setProduct] = useState([]);

  const signupUser = async (
    email,
    password,
    firstName,
    lastName,
    mobile,
    role
  ) => {
    setSignUpLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await setDoc(doc(db, "users", res.user.uid), {
        firstName,
        lastName,
        mobile,
        DOB: "NA",
        email: firebaseAuth.currentUser.email,
        role,
        address: "NA",
      });
      await updateProfile(firebaseAuth?.currentUser, {
        displayName: `${firstName} ${lastName}`,
      });
      setSignUpLoading(false);
    } catch (err) {
      setSignUpLoading(false);
      console.log(err);
    }
  };

  const signinUser = (email, password) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const logOut = () => {
    return signOut(firebaseAuth)
      .then(() => {})
      .catch((error) => {});
  };

  const updateProfileInfo = async (
    firstName,
    lastName,
    DOB,
    mobile,
    address
  ) => {
    const docRef = doc(db, "users", firebaseAuth?.currentUser?.uid);
    return await updateDoc(docRef, {
      firstName: firstName,
      lastName: lastName,
      DOB: DOB,
      mobile: mobile,
      address: address,
    });
  };

  const updateUserEmail = async (newEmail) => {
    await updateEmail(firebaseAuth?.currentUser, newEmail)
      .then((result) => {
        const emailRef = doc(db, "users", firebaseAuth?.currentUser?.uid);
        updateDoc(emailRef, {
          email: firebaseAuth?.currentUser?.email,
        })
          .then(() => alert("email updated"))
          .catch(() => "");
      })
      .catch((err) => console.log(err));
  };

  const updateUserPassword = (newPassword) => {
    const user = firebaseAuth.currentUser;
    return updatePassword(user, newPassword);
  };

  const deleteAccount = () => {
    const user = firebaseAuth.currentUser;
    deleteUser(user)
      .then(async () => {
        await deleteDoc(doc(db, "users", user.uid));
        alert("Account Deleted Successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const usersInformation = async () => {
    const docRef = doc(db, "users", firebaseAuth?.currentUser?.uid);
    return await getDoc(docRef);
  };

  const getImage = (path) => {
    return getDownloadURL(ref(storage, path));
  };

  const addProduct = async (
    id,
    title,
    description,
    category,
    subCategory,
    mrp,
    discount,
    size
  ) => {
    const price = parseFloat((mrp * ((100 - discount) / 100)).toFixed(2));
    for (const key in size) {
      if (size[key].length !== 0) {
        size[key].forEach(async (item, index) => {
          const imagesRef = ref(
            storage,
            `productImage/${id}/${id}${key}${item.color}image.jpg`
          );
          uploadBytes(imagesRef, item.imgSrc)
            .then((result) => {})
            .catch((err) => console.log(err));
          size[key][
            index
          ].imgSrc = `productImage/${id}/${id}${key}${item.color}image.jpg`;
        });
      }
    }
    return await addDoc(collection(db, "products"), {
      id,
      title,
      description,
      category,
      subCategory,
      mrp,
      discount,
      price,
      size,
      date: serverTimestamp(),
    });
  };

  const productView = async () => {
    const arr = [];
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    setProduct(arr);
  };

  const addElementOfArray = async (array, data) => {
    const docRef = doc(db, "users", firebaseAuth?.currentUser?.uid);
    await updateDoc(docRef, {
      [array]: arrayUnion(data),
    });
  };

  const removeElementOfArray = async (array, data) => {
    const docRef = doc(db, "users", firebaseAuth?.currentUser?.uid);
    await updateDoc(docRef, {
      [array]: arrayRemove(data),
    });
  };

  const passwordReset = async (email) => {
    return await sendPasswordResetEmail(firebaseAuth, email);
  };

  const loginCheck = () => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserDisplayName(user?.displayName);
        setUserAccountInfo(user);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
          })
        );
        console.log(localStorage.getItem("user"));
      } else {
        localStorage.clear();
        setIsLoggedIn(false);
      }
    });
    productView();
  };

  useEffect(() => {
    loginCheck();
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        signupUser,
        signinUser,
        logOut,
        usersInformation,
        getImage,
        updateProfileInfo,
        updateUserEmail,
        deleteAccount,
        updateUserPassword,
        addProduct,
        productView,
        addElementOfArray,
        removeElementOfArray,
        passwordReset,
        db,
        storage,
        firebaseAuth,
        product,
        userAccountInfo,
        isLoggedIn,
        userDisplayName,
        signUpLoading,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
