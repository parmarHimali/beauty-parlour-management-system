import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddService = () => {
  const [categories, setCategories] = useState([]);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/category/all-categories"
        );
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const initialValues = {
    categoryId: "",
    name: "",
    description: "",
    price: "",
    duration: "",
    serviceHighlights: "",
    image: null,
    discountOffer: 0,
  };

  const validationSchema = Yup.object({
    categoryId: Yup.string().required("Category is required"),
    name: Yup.string().trim().required("Service name is required"),
    description: Yup.string().trim().required("Description is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than zero")
      .required("Price is required"),
    duration: Yup.number()
      .typeError("Duration must be a number")
      .positive("Duration must be greater than zero")
      .required("Duration is required"),
    serviceHighlights: Yup.string()
      .trim()
      .required("Service highlight is required"),
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
    discountOffer: Yup.number()
      .min(0, "Discount must be positive number")
      .max(100, "Discount cannot be greater than 100%"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("categoryId", values.categoryId);
    formData.append("name", values.name.trim());
    formData.append("description", values.description.trim());
    formData.append("price", values.price);
    formData.append("discountOffer", values.discountOffer);
    formData.append("duration", Number(values.duration) * 60);
    formData.append("serviceHighlights", values.serviceHighlights.trim());
    formData.append("image", values.image);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/services/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      resetForm();
      navigateTo(`/admin/see-more/${data.service._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <div className="form-section">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form
            encType="multipart/form-data"
            style={{ width: "40%", marginTop: "25px", marginBottom: "30px" }}
            noValidate
          >
            <div className="title">
              <h3>Add New Service</h3>
            </div>

            <div className="form-control two-control">
              <div>
                <label>Category</label>
                <div className="input-wrapper">
                  <Field as="select" name="categoryId" required>
                    <option value="">Select Category</option>
                    {categories.map((cate) => (
                      <option key={cate._id} value={cate._id}>
                        {cate.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div>
                <label>Service Name</label>
                <div className="input-wrapper">
                  <Field type="text" name="name" required />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label>Service Description</label>
              <div className="input-wrapper">
                <Field as="textarea" rows="4" name="description" required />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="error"
                />
              </div>
            </div>

            <div className="form-control two-control">
              <div>
                <label>Price</label>
                <div className="input-wrapper">
                  <Field type="number" name="price" required />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div>
                <label>Duration (hours)</label>
                <div className="input-wrapper">
                  <Field type="number" name="duration" required />
                  <ErrorMessage
                    name="duration"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label>Service Highlights (separate by new lines)</label>
              <div className="input-wrapper">
                <Field as="textarea" rows="4" name="serviceHighlights" />
                <ErrorMessage
                  name="serviceHighlights"
                  component="div"
                  className="error"
                />
              </div>
            </div>

            <div className="form-control two-control">
              <div>
                <label>Image</label>
                <div className="input-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setFieldValue("image", event.currentTarget.files[0])
                    }
                    required
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div>
                <label>Discount(%)</label>
                <div className="input-wrapper">
                  <Field type="number" name="discountOffer" required />
                  <ErrorMessage
                    name="discountOffer"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-green"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Service"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddService;
