import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import Loading from "../Loading";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:4000/api/category/all-categories"
        );
        setCategories(data.categories);
        setFilteredCategories(data.categories.reverse());
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (cid) => {
    const isDlt = confirm(
      "Are you sure you want to delete this category with related services?"
    );
    if (isDlt) {
      try {
        setLoading(true);
        const { data } = await axios.delete(
          `http://localhost:4000/api/category/delete/${cid}`
        );
        toast.success(data.message, {
          duration: 3000, // 2 seconds
        });
        const updatedCategories = categories.filter(
          (category) => category._id !== cid
        );
        setCategories(updatedCategories);
        setFilteredCategories(updatedCategories);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  if (loading) {
    return <Loading />;
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="category-list-container">
      <div className="heading heading-container">
        <h2>Category List</h2>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search category"
            value={searchQuery}
            onChange={handleSearch}
          />
          <MdSearch />
        </div>
      </div>
      <div className="category-cards-container">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div className="category-card" key={category._id}>
              <div className="category-card-image">
                <img
                  src={`http://localhost:4000/${category.image}`}
                  alt={category.name}
                />
              </div>
              <div className="category-card-content">
                <h3>{category.name}</h3>
                {/* <p>{category.description}</p> */}
                <div className="card-actions">
                  <Link to={`/admin/category-edit/${category._id}`}>Edit</Link>
                  <Link
                    to=""
                    onClick={() => handleDelete(category._id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className="not-found">No category found</h1>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
