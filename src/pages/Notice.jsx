import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Notice = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setErrors({ ...errors, image: "Please, choose an image!" });
      return;
    }
    if (!title.trim()) {
      setErrors({ ...errors, title: "Please, enter a title!" });
      return;
    }

    const formData = new FormData();
    formData.append("Noticeimage", image);
    formData.append("title", title);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/notice/createnotice`,
        formData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setImage(null);
        setImagePreview(null);
        setTitle("");
        fileInputRef.current.value = null;
      } else {
        console.error("Form submission failed:", response.statusText);
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      console.error(error);
    }
  };

  return (
    <>
      <div className="box">
        <div className="container">
          <section className=" min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <h3 className="d-flex justify-content-center py-4 ">
                    <span className="d-none d-lg-block border-bottom border-danger border-2">
                      Noticess
                    </span>
                  </h3>
                  <div className="card mb-3">
                    <div className="card-body py-4">
                      <form
                        className="row g-3 needs-validation"
                        noValidate
                        method="post"
                        onSubmit={handleSubmit}
                      >
                        <div className="col-12 text-center">
                          <label htmlFor="title" className="form-label">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            className={`form-control ${
                              errors.title ? "is-invalid" : ""
                            }`}
                            id="title"
                            value={title} // Bind title state to the input
                            onChange={(e) => setTitle(e.target.value)} // Update title state on change
                            required
                          />
                          {errors.title && (
                            <div className="invalid-feedback">
                              {errors.title}
                            </div>
                          )}
                        </div>
                        <div className="col-12">
                          <label htmlFor="noticeimage" className="form-label">
                            Image
                          </label>
                          <input
                            type="file"
                            name="image"
                            className={`form-control ${
                              errors.image ? "is-invalid" : ""
                            }`}
                            id="noticeimage"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            ref={fileInputRef}
                          />
                          {errors.image && (
                            <div className="invalid-feedback">
                              {errors.image}
                            </div>
                          )}
                        </div>

                        {imagePreview && (
                          <div className="col-12">
                            <img
                              src={imagePreview}
                              alt="Selected"
                              className="img-fluid"
                            />
                          </div>
                        )}

                        <div className="col-12">
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            Upload Notice Image
                          </button>
                        </div>
                      </form>
                    </div>
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

export default Notice;
