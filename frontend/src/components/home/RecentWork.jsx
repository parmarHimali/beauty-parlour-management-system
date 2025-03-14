import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL, IMG_URL } from "./../../App";

const RecentWork = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/services/recent-services`
        );
        console.log(data);
        setData(data.images);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="recent-container home">
      <div className="title-section">
        <h2>Our Recent Work</h2>
        <p>Experience the Art of Beauty</p>
      </div>
      <div className="recent-section">
        {data.length > 0 ? (
          data.map((dataa) => {
            return (
              <div className="recent">
                <img
                  src={`${IMG_URL}/${dataa.imageUrl}`}
                  alt="recent"
                  key={dataa._id}
                />
                <p>{dataa.serviceName}</p>
              </div>
            );
          })
        ) : (
          <p>No data found</p>
        )}
      </div>
    </div>
  );
};

export default RecentWork;
