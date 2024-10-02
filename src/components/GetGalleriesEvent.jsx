import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const GetGalleriesEvent = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch all galleries
    const fetchGalleries = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/getallgallery`
        );

        console.log("response all galleries", response.data.gallery);
        setGalleries(response.data.gallery);
        setLoading(false);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        console.error(error);
      }
    };

    fetchGalleries();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/deletegallery/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      console.log("delete photos:", response);

      if (response.data.success) {
        toast.success(response.data.message);

        // Update state to remove deleted gallery
        setGalleries(galleries.filter((item) => item._id !== id));
      } else {
        toast.error("Failed to delete item: " + response.data.message);
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
  if (loading) return <p>Loading galleries...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="container my-5 box1">
        <h2 className="text-center mb-4">Gallery Events</h2>

        {galleries.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                
                <th scope="col">Images</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {galleries.map((gallery) => (
                <tr key={gallery._id}>
              
                  <td>
                    <div className="d-flex flex-wrap">
                      {gallery.images && gallery.images.length > 0 ? (
                        gallery.images.map((image, index) => (
                          <img
                            key={index}
                            src={`${import.meta.env.VITE_SERVERAPI}/${image}`}
                            alt={`Gallery ${gallery.title} Image ${index + 1}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          />
                        ))
                      ) : (
                        <p>No images available</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-md  mx-1"
                      onClick={() => handleDelete(gallery._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No galleries found</p>
        )}
      </div>
    </>
  );
};

export default GetGalleriesEvent;
