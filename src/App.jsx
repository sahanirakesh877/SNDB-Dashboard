import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import BannerPhotos from "./pages/BannerPhotos";
import Notice from "./pages/Notice";
import BannerImg from "./components/BannerImg";
import GetNotices from "./components/GetNotices";
import toast, { Toaster } from "react-hot-toast";
import GetBlogs from "./components/getBlogs";
import GetBlog from "./components/getBlog";
import ResetPassword from "./pages/ResetPassword";
import Galleries from "./pages/Galleries";
import GetGalleriesEvent from "./components/GetGalleriesEvent";
import Downloads from "./pages/Download";
import GetDownload from "./components/GetDownload";
import TeacherProfile from "./pages/TeacherProfile";
import AllTeacherProfile from "./components/AllTeacherProfile";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "./redux/slices/loginSlice";
import BlogCategory from "./components/BlogCategory";
import GetNewMember from "./components/GetNewMember";

const App = () => {
  const [statLoading, setStatLoading] = useState(true);
  const [stat, setStat] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const { resolved, user } = useSelector((state) => state.login.loggedInUser);

  console.log(resolved, user);

  useEffect(() => {
    async function getServerStatus() {
      setStatLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/stat`
      );
      console.log("server admin stat: ", response.data);
      if (response.data.stat) {
        setStat(true);
      }
      setStatLoading(false);
    }
    getServerStatus();
  }, []);

  useEffect(() => {
    async function getUserByToken() {
      if (localStorage.getItem("token")) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVERAPI}/api/v1/userTokenValidation`,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
          console.log(response);
          if (response.data.success) {
            dispatch(loginActions.setLoggedInUser(response.data.name));
          }
        } catch (error) {
          toast.error(error.message);
          console.log(error);
          localStorage.removeItem("token");
        }
      }
    }
    if (localStorage.getItem("token")) {
      getUserByToken();
    }
  }, []);

  if (!localStorage.getItem("token")) {
    dispatch(loginActions.setResolved(true));
  }

  if (statLoading || !resolved) {
    return (
      <div className="min-vh-100 w-100 d-flex justify-content-center align-items-center fw-2">
        PLEASE WAIT
      </div>
    );
  }

  if (stat && !statLoading && !user) {
    return <Login />;
  }

  if (!stat && !statLoading) {
    return <Register />;
  }

  return (
    <>
      {/* <Header /> */}
      <Sidebar />

      <Routes>
        <Route path="/" element={<Navigate to="/profile" />} />

        {/* authentication start */}
        {/* <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
        {/* authentication end */}

        {/* blogs start */}
        <Route path="/latest-blog" element={<Blog />} />
        <Route path="/get-blogs" element={<GetBlogs />} />
        <Route path="/get-blogs/:id" element={<GetBlog />} />
        <Route path="/get-blogs/:id/edit" element={<Blog edit={true} />} />
        <Route
          path="/get-blogs/:id/reupload"
          element={<Blog reupload={true} />}
        />
        {/* blogs end */}

        {/* Banner Gallery start  */}
        <Route path="/banner-photo" element={<BannerPhotos />} />
        <Route path="/banner-img" element={<BannerImg />} />

        {/* Banner Gallery end  */}

        {/* last area section start*/}
        <Route path="/important-notice" element={<Notice />} />
        <Route path="/get-notice" element={<GetNotices />} />

        {/* last area section end*/}

        {/* galleries section start  */}
        <Route path="/galleries" element={<Galleries />} />
        <Route path="/getallphotos" element={<GetGalleriesEvent />} />
        {/* galleries section end  */}
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/getpdf" element={<GetDownload />} />
        <Route path="/teacherprofile" element={<TeacherProfile />} />
        <Route path="/getallteacherprofile" element={<AllTeacherProfile />} />
        <Route path="/membership" element={<GetNewMember />} />
        <Route path="*" element={<Error />} />
        <Route path="/blogcategory" element={<BlogCategory />} />
      </Routes>

      <Toaster />
      {/* <Footer /> */}
    </>
  );
};

export default App;
