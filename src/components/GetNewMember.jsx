import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GetNewMember = () => {
  const [teachers, setTeachers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/getallmember`
        );

        console.log("teacher response", response);
        if (response.data.profiles) {
          setTeachers(response.data.profiles);
          console.log("Fetched teacher profiles", response.data.profiles);
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching teacher profiles:", error);
      }
    };
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/deletemember/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      console.log("Delete teacher profile:", response);

      if (response.data.success) {
        toast.success(response.data.message);
        setTeachers(teachers.filter((teacher) => teacher._id !== id));
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
              All Enrolled Doctors
            </span>
          </h3>

          <div className="container mx-auto">
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark border border-danger">
                  <tr>
                    <th className="text-center">Name</th>
                    <th className="text-center">Speciality</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Phone</th>
                    <th className="text-center">Image</th>
                    <th className="text-center">VoucherImage</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="border border-info">
                  {teachers.map((teacher, index) => (
                    <tr key={index}>
                      <td className="text-center">{teacher.title}</td>
                      <td className="text-center">{teacher.position}</td>
                      <td className="text-center">{teacher.email}</td>
                      <td className="text-center">{teacher.phone}</td>

                      <td className="text-center">
                        <img
                          src={`${
                            import.meta.env.VITE_SERVERAPI
                          }/${teacher.image.replace(/\\/g, "/")}`}
                          alt={teacher.title}
                          width="50"
                          className="img-fluid rounded-pill "
                        />
                      </td>


                      <td className="text-center">
                        <img
                          src={`${
                            import.meta.env.VITE_SERVERAPI
                          }/${teacher.voucherImage.replace(/\\/g, "/")}`}
                          alt={teacher.title}
                          width="50"
                          className="img-fluid rounded-pill "
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-danger btn-md mx-1"
                          onClick={() => handleDelete(teacher._id)}
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

export default GetNewMember;
