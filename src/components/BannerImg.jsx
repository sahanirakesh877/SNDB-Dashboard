import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BannerImg = () => {
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/hero/getallheroimg`
        );

        if (response.data.success) {
          setData(response.data.Heros);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleView = (id) => {
    console.log("View item:", id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/hero/deleteheroimg/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("delete photos:", response);

      if (response.data.success) {
        toast.success(response.data.message);

        setData(data.filter((item) => item._id !== id));
      } else {
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
            <span className="d-none d-lg-block border-bottom border-danger border-2 fw-semibold text-success ">
              Hero Slider Photo
            </span>
          </h3>

          <div className="container mx-auto">
            <div className="table-responsive ">
              <table className="table table-striped table-bordered">
                <thead className="thead-info border border-danger">
                  <tr>
                  <th className="text-center ">Title</th>
                    <th className="text-center ">Image</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="border border-info">
                  {data.map((item, index) => (
                    <tr key={index}>

                    <td className="text-start d-flex flex-wrap ">
                    {item.title}

                    </td>
                      <td className="text-center">
                        <img
                          src={`${
                            import.meta.env.VITE_SERVERAPI
                          }/${item.images.replace(/\\/g, "/")}`}
                          alt={item.title}
                          className="img-fluid rounded"
                          style={{
                            maxWidth: "150px",
                            maxHeight: "150px",
                            objectFit: "cover",
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-info btn-md text-white   mx-1"
                          onClick={() => handleView(item._id)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          className="btn btn-danger btn-md mx-1"
                          onClick={() => handleDelete(item._id)}
                        >
                          <i className="bi bi-trash"></i>
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

export default BannerImg;
