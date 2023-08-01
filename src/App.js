import "./App.css";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Cart from "./Pages/Cart";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import { Routes, Route } from "react-router-dom";
import Wishlist from "./Pages/wishlist";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import AboutUs from "./Pages/About/Index";
import DashboardWrapper from "./Components/DashboardWrapper";
import UserProfile from "./Components/Profile";
import ProductDetails from "./Pages/ProductDetails";
import BuyProduct from "./Pages/BuyProduct";
import Test from "./Pages/test";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signin" element={<SignIn />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/about" element={<AboutUs />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/wishlist" element={<Wishlist />} />
        <Route exact path="/dashboard" element={<DashboardWrapper />} />
        <Route exact path="/profile" element={<UserProfile />} />
        <Route exact path="/productdetail" element={<ProductDetails />} />
        <Route exact path="/buyproduct" element={<BuyProduct />} />
        <Route exact path="/test" element={<Test />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
