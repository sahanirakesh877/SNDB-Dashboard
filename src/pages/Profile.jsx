import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Profile = () => {
  const token = localStorage.getItem("token");

  const { resolved, user } = useSelector((state) => state.login.loggedInUser);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [emailForReset, setEmailForReset] = useState("");

  const [loading, setLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/profile`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("User Profile", response);
        setProfileData(response.data.profile);
      } catch (error) {
        console.error("Error fetching profile data", error);
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Both current and new passwords are required");
      return;
    }

    setIsChangingPassword(true);
    const userId = localStorage.getItem("userId");

    try {
      await axios.post(
        "http://localhost:5000/api/v1/changepassword",
        {
          userId,
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      console.error(error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // const handleForgetPassword = async (e) => {
  //   e.preventDefault();

  //   if (!emailForReset) {
  //     toast.error("Please enter your email address");
  //     return;
  //   }

  //   setIsChangingPassword(true);

  //   try {
  //     await axios.post("http://localhost:5000/api/v1/forgetpassword", {
  //       email: emailForReset,
  //     });
  //     toast.success("Password reset link sent to your email");
  //     setEmailForReset(""); // Clear the input field after submission
  //   } catch (error) {
  //     console.error("Error sending password reset email", error);
  //     toast.error("Failed to send password reset email");
  //   } finally {
  //     setIsChangingPassword(false);
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleEmailChange = (e) => {
  //   setEmailForReset(e.target.value);
  // };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
     
        <div className="container">
          <div className="min-vh-100 w-100 d-flex flex-column align-items-center justify-content-center py-4 ">
            <section className="section profile ">
              <div className="row">
                <div className="col-md-10 mx-auto">
                  <div className="card p-2">
                    <div className="card-body pt-3">
                      {/* Bordered Tabs */}
                      <ul className="nav nav-tabs nav-tabs-bordered">
                        <li className="nav-item">
                          <button
                            className="nav-link active"
                            data-bs-toggle="tab"
                            data-bs-target="#profile-overview"
                          >
                            Overview
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className="nav-link"
                            data-bs-toggle="tab"
                            data-bs-target="#profile-change-password"
                          >
                            Change Password
                          </button>
                        </li>

                        {/* <li className="nav-item">
                      <button
                        className="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#profile-forget-password"
                      >
                        Forget Password
                      </button>
                    </li> */}
                      </ul>
                      <div className="tab-content pt-2">
                        <div
                          className="tab-pane fade show active profile-overview"
                          id="profile-overview"
                        >
                          {/* <h5 className="card-title">About</h5>
                      <p className="small fst-italic">
                        As the IT Support Specialist for Aksharaa School, I am
                        dedicated to ensuring the seamless operation of our
                        school's technological systems. My role involves
                        troubleshooting technical issues, maintaining computer
                        hardware and software, and providing support to students
                        and staff to enhance their learning and teaching
                        experiences. I am committed to implementing efficient
                        technology solutions and ensuring that our IT
                        infrastructure supports the educational goals of the
                        school effectively.
                      </p> */}
                          <h5 className="card-title">Profile Details</h5>
                          <div className="row">
                            <div className="col-lg-6 col-md-6 label ">
                              Full Name :
                            </div>
                            <div className="col-lg-6 col-md-6 text-capitalize">
                              {profileData.name}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-6 label">
                              School/Organization :
                            </div>
                            <div className="col-lg-6 col-md-6">Aksharaa</div>
                          </div>

                          <div className="row">
                            <div className="col-lg-6 col-md-6 label">
                              Phone :
                            </div>
                            <div className="col-lg-6 col-md-6">9845892346</div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-6 label">
                              Email :
                            </div>
                            <div className="col-lg-6 col-md-6">
                              {profileData.email}
                            </div>
                          </div>
                        </div>

                        {/* change password functionality start */}
                        <div
                          className="tab-pane fade pt-3"
                          id="profile-change-password"
                        >
                          {/* Change Password Form */}
                          <form onSubmit={handlePasswordChange}>
                            <div className="row mb-3 label">
                              <label
                                htmlFor="currentPassword"
                                className="col-md-6 col-lg-6 col-form-label"
                              >
                                Current Password :
                              </label>
                              <div className="col-md-6 col-lg-6">
                                <input
                                  name="currentPassword"
                                  type="password"
                                  className="form-control"
                                  id="currentPassword"
                                  value={passwordData.currentPassword}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="row mb-3">
                              <label
                                htmlFor="newPassword"
                                className="col-md-6 col-lg-6 col-form-label"
                              >
                                New Password :
                              </label>
                              <div className="col-md-6 col-lg-6">
                                <input
                                  name="newPassword"
                                  type="password"
                                  className="form-control"
                                  id="newPassword"
                                  value={passwordData.newPassword}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="text-center">
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isChangingPassword}
                              >
                                {isChangingPassword
                                  ? "Changing..."
                                  : "Change Password"}
                              </button>
                            </div>
                          </form>
                          {/* End Change Password Form */}
                        </div>
                        {/* change password functionality end  */}

                        {/*  forget functionality start */}
                        {/* <div
                      className="tab-pane fade pt-6"
                      id="profile-forget-password"
                    >
                      <form onSubmit={handleForgetPassword}>
                        <div className="row mb-3">
                          <label
                            htmlFor="email"
                            className="col-md-4 col-lg-3 col-form-label"
                          >
                            Email
                          </label>
                          <div className="col-md-8 col-lg-9">
                            <input
                              name="email"
                              type="email"
                              className="form-control"
                              id="email"
                              value={emailForReset}
                              onChange={handleEmailChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isChangingPassword}
                          >
                            {isChangingPassword
                              ? "Sending..."
                              : "Send Reset Link"}
                          </button>
                        </div>
                      </form>
                    </div> */}
                        {/* forget  password functionality start */}
                      </div>
                      {/* End Bordered Tabs */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
     
    </>
  );
};

export default Profile;
