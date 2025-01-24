import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/category/all-categories"
        );

        setCategories(data.categories);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchCategories();
  }, []);
  return (
    <>
      <div className="main-title">
        <h1>Categories</h1>
      </div>
      <div className="category-section">
        {categories.map((category) => {
          return (
            <Link to={`/services/${category._id}`} key={category._id}>
              <div className="category">
                <div className="img-border">
                  <img
                    src={`http://localhost:4000/${category.image}`}
                    alt={`${category.name}'s image`}
                    width="300px"
                  />
                </div>
                <div className="content">
                  <h3>{category.name}</h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Categories;
