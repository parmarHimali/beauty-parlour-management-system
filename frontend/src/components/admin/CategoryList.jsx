import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/category/all-categories"
      );
      setCategories(data.categories);
      setFilteredCategories(data.categories.reverse());
    };
    fetchCategories();
  }, []);

  const handleDelete = async (cid) => {
    const isDlt = confirm(
      "Are you sure you want to delete this category with related services?"
    );
    if (isDlt) {
      try {
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
      }
    }
  };
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
    <div className="table-list">
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
      <table>
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => {
              return (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td style={{ textAlign: "left" }}>{category.description}</td>
                  <td style={{ padding: "2px" }}>
                    <img
                      style={{ objectFit: "cover" }}
                      src={`http://localhost:4000/${category.image}`}
                      alt={category.image}
                      height={"70px"}
                      width={"100px"}
                    />
                  </td>
                  <td>
                    <Link to={`/admin/category-edit/${category._id}`}>
                      Edit
                    </Link>
                    <Link
                      to=""
                      onClick={() => handleDelete(category._id)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No Category found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
