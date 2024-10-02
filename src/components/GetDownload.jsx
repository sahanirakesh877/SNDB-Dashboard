import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const GetDownload = () => {
  const [pdfs, setPdfs] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/getallpdf`
        );
        setPdfs(response.data.pdfs); 
      } catch (error) {
        console.error("Error fetching PDFs:", error);
      }
    };

    fetchPdfs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/deletepdf/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setPdfs(pdfs.filter((pdf) => pdf._id !== id)); // Use _id from your data
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
    <div className="box1">
      <div className="container py-4">
        <div className="row">
          <div className="col-12 text-center">
            <h2 className="page-title mb-4">Available Downloads</h2>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-10">
            <ul className="list-group">
              {pdfs.map((pdf) => {
                // Convert ISO date string to a Date object
                const createdDate = new Date(pdf.createdAt);
                const formattedDate = createdDate.toLocaleDateString();

                return (
                  <li
                    key={pdf._id} // Use _id from your data
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <span className="pdf-name">{pdf.title}</span>
                      <br />
                      <small className="text-muted">
                        Uploaded on:{" "}
                        {isNaN(createdDate) ? "Invalid Date" : formattedDate}
                      </small>
                    </div>
                    <div>
                      <a
                        href={`${import.meta.env.VITE_SERVERAPI}/${
                          pdf.filePath
                        }`}
                        target="_blank"
                        className="btn btn-primary btn-sm me-2"
                        download
                      >
                        <i className="bi bi-download"></i> Download
                      </a>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(pdf._id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetDownload;
