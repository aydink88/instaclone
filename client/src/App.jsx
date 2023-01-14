import { useEffect } from "react";
import { UserProvider, useUser } from "./contexts/User";
import NavBar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPosts from "./components/screens/SubscribedUserPosts";
import Reset from "./components/screens/Reset";
import NewPassword from "./components/screens/NewPassword";
import AppToast from "./components/AppToast";

const Routing = () => {
  const { state } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!state?._id) {
      const shouldRedirect =
        location.pathname !== "/reset" &&
        location.pathname !== "/signin" &&
        location.pathname !== "/signup";
      if (shouldRedirect) {
        navigate("/signin", { replace: true });
      }
      // if (!pathname.startsWith("/reset") && !pathname.startsWith("/signup")) navigate("/signin");
    }
  }, [state?._id, navigate, location.pathname]);
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/myfollowingpost" element={<SubscribedUserPosts />} />
      <Route exact path="/reset" element={<Reset />} />
      <Route path="/reset/:token" element={<NewPassword />} />
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppToast />
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
