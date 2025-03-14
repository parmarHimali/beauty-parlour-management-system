import axios from "axios";
import React from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddCategory = () => {
  const navigateTo = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, "Category name must be at least 3 characters")
      .max(50, "Category name cannot exceed 50 characters")
      .required("Category name is required"),
    description: Yup.string()
      .trim()
      .required("Description is required")
      .max(500, "Description must not exceed 200 characters")
      .min(5, "Description must contain at least 5 characters"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Only images are allowed", (value) => {
        return (
          value &&
          ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
            value.type
          )
        );
      }),
  });

  return (
    <div className="form-section">
      <Formik
        initialValues={{ name: "", description: "", image: null }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          const formData = new FormData();
          formData.append("name", values.name.trim());
          formData.append("description", values.description.trim());
          formData.append("image", values.image);

          try {
            const { data } = await axios.post(
              "http://localhost:4000/api/category/create-category",
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );

            toast.success(data.message);
            resetForm();
            navigateTo("/admin/category-list");
          } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message);
          }
        }}
      >
        {({ setFieldValue }) => (
          <Form encType="multipart/form-data" noValidate>
            <div className="title">
              <h3>Add New Category</h3>
            </div>

            <div className="form-control">
              <label>Category Name</label>
              <div className="input-wrapper">
                <Field type="text" name="name" required maxLength={50} />
              </div>
              <ErrorMessage name="name" component="p" className="error" />
            </div>

            <div className="form-control">
              <label>Category Description</label>
              <div className="input-wrapper">
                <Field
                  as="textarea"
                  name="description"
                  rows="4"
                  maxLength={500}
                />
              </div>
              <ErrorMessage
                name="description"
                component="p"
                className="error"
              />
            </div>

            <div className="form-control">
              <label>Image</label>
              <div className="input-wrapper">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    setFieldValue("image", e.target.files[0]);
                  }}
                  required
                />
              </div>
              <ErrorMessage name="image" component="p" className="error" />
            </div>

            <button type="submit" className="btn btn-green" name="add_category">
              Add Category
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCategory;
