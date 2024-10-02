import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginActions } from "../redux/slices/loginSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.email)
      formErrors.email = "Please enter a valid Email address!";
    if (!formData.password) formErrors.password = "Please enter your password!";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/login`,
        formData
      );
      console.log("User id check here", response.data);
      if (response.data.success) {
        toast.success("Login successful!");

        localStorage.setItem("token", response.data.token);
        navigate("/");
        dispatch(loginActions.setLoggedInUser(response.data.name));
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      toast.error("Login failed. Please check your credentials and try again.");
      setErrors({
        apiError: "Login failed. Please check your credentials and try again.",
      });
    }
  };

  return (
    <div className="box">
      <div className="container">
        <section className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">
                      Login (Admin)
                    </h5>
                    {/* <p className="text-center small">
                      Enter your username &amp; password to login
                    </p> */}
                  </div>
                  <form
                    className="row g-3 needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <div className="col-12">
                      <label htmlFor="yourEmail" className="form-label">
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="yourEmail"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <div className="invalid-feedback">{errors.email}</div>
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        id="yourPassword"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <div className="invalid-feedback">{errors.password}</div>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="remember"
                          id="rememberMe"
                          checked={formData.remember}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">
                        Login
                      </button>
                    </div>

                    {/* <div className="col-12">
                      <p className="small mb-0">
                        Don't have an account?{" "}
                        <Link to="/register">Create an account</Link>
                      </p>
                    </div> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
