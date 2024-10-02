import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BlogCategory = () => {
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/category`
        );

        console.log("category response", response);
        if (response.data.categories) {
          setCategories(response.data.categories);
          console.log("Fetched category categories", response.data.categories);
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching category categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/category/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      console.log("Delete category profile:", response);

      if (response.data.success) {
        toast.success(response.data.message);
        setCategories(response.data.categories);
      } else {
        console.error("Failed to delete profile:", response.data.message);
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
      <div className="box1">
        <section className="section min-vh-100 d-flex flex-column align-items-center justify-content-start py-4">
          <h3 className="d-flex justify-content-center pt-5">
            <span className="d-none d-lg-block border-bottom border-danger text-success border-2 fw-semibold">
          Blog Category
            </span>
          </h3>

          <div className="container mx-auto">
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark border border-danger">
                  <tr>
                    <th className="text-center">Category Name</th>

                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="border border-info">
                  {categories.map((category, index) => (
                    <tr key={index}>
                      <td className="text-center">{category.title}</td>

                      <td className="text-center">
                        <button
                          className="btn btn-danger btn-md mx-1"
                          onClick={() => handleDelete(category._id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogCategory;
