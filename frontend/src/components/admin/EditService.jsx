// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useParams, useNavigate } from "react-router-dom";

// const EditService = () => {
//   const { sid } = useParams();
//   const navigate = useNavigate();

//   const [service, setService] = useState({});
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [duration, setDuration] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [image, setImage] = useState(null);
//   const [serviceHighlights, setServiceHighlights] = useState([]);
//   const [categories, setCategories] = useState("");

//   useEffect(() => {
//     const fetchService = async () => {
//       try {
//         const { data } = await axios.get(
//           `http://localhost:4000/api/services/s-detail/${sid}`
//         );
//         setService(data.service);
//         setName(data.service.name);
//         setDescription(data.service.description);
//         setPrice(data.service.price);
//         setDuration(data.service.duration);
//         setCategoryId(data.service.categoryId);
//         setServiceHighlights(
//           Array.isArray(data.service.serviceHighlights)
//             ? data.service.serviceHighlights.join("\n")
//             : data.service.serviceHighlights
//         );
//       } catch (error) {
//         console.error("Error fetching service details:", error);
//       }
//     };
//     fetchService();
//   }, [sid]);
//   useEffect(() => {
//     const fetchCategories = async () => {
//       const { data } = await axios.get(
//         "http://localhost:4000/api/category/all-categories"
//       );
//       setCategories(data.categories);
//     };
//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("price", price);
//       formData.append("duration", duration);
//       formData.append("categoryId", categoryId);
//       formData.append("serviceHighlights", serviceHighlights);
//       // if (image) {
//       formData.append("image", image);
//       // }

//       const { data } = await axios.put(
//         `http://localhost:4000/api/services/update/${sid}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       toast.success(data.message);
//       navigate("/admin/service-list");
//     } catch (error) {
//       console.error("Error updating service:", error);
//       toast.error(error.response?.data?.message);
//     }
//   };
//   const handleNavigate = (url) => {
//     window.open(url, "_blank");
//   };
//   return (
//     <div className="form-section">
//       <form
//         onSubmit={handleSubmit}
//         encType="multipart/form-data"
//         style={{ width: "40%", marginTop: "15px", marginBottom: "30px" }}
//       >
//         <div className="title">
//           <h3>Edit Service</h3>
//         </div>
//         <div className="form-control two-control">
//           <div>
//             <label>Category</label>
//             <div className="input-wrapper">
//               {/* <select>
//                 {categories.length > 0 &&
//                   categories.map((category) => {
//                     return (
//                       <option
//                         key={category._id}
//                         value={category._id}
//                         selected={category._id === service.categoryId}
//                       >
//                         {category.name}
//                       </option>
//                     );
//                   })}
//               </select> */}
//               <select
//                 value={categoryId}
//                 onChange={(e) => setCategoryId(e.target.value)}
//               >
//                 {categories.length > 0 &&
//                   categories.map((category) => (
//                     <option key={category._id} value={category._id}>
//                       {category.name}
//                     </option>
//                   ))}
//               </select>
//             </div>
//           </div>
//           <div>
//             <label>Service Name</label>
//             <div className="input-wrapper">
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         <div className="form-control">
//           <label>Service Description</label>
//           <div className="input-wrapper">
//             <textarea
//               rows="4"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//             ></textarea>
//           </div>
//         </div>
//         <div className="form-control two-control">
//           <div>
//             <label>Price</label>
//             <div className="input-wrapper">
//               <input
//                 type="number"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <label>Duration (minutes)</label>
//             <div className="input-wrapper">
//               <input
//                 type="text"
//                 value={duration}
//                 onChange={(e) => setDuration(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//         </div>
//         <div className="form-control">
//           <label>Service Highlights (separate by new lines)</label>
//           <div className="input-wrapper">
//             <textarea
//               rows="4"
//               value={serviceHighlights}
//               onChange={(e) => setServiceHighlights(e.target.value || "")}
//             ></textarea>
//           </div>
//         </div>
//         <div className="form-control">
//           <label>Image</label>
//           <div className="input-wrapper two-control">
//             <div style={{ flexBasis: "120%" }}>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setImage(e.target.files[0])}
//               />
//               <p>Current Image:</p>
//             </div>
//             <div>
//               <img
//                 src={`http://localhost:4000/${service.image}`}
//                 alt="Service Image"
//                 width="80"
//                 onClick={() =>
//                   handleNavigate(`http://localhost:4000/${service.image}`)
//                 }
//               />
//             </div>
//           </div>
//         </div>
//         <button type="submit" className="btn btn-green">
//           Update Service
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditService;

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EditService = () => {
  const { sid } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/services/s-detail/${sid}`
        );
        setService(data.service);
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };
    fetchService();
  }, [sid]);

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

  // **Validation Schema**
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Service Name is required"),
    description: Yup.string()
      .trim()
      .required("Service Description is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than 0")
      .required("Price is required"),
    duration: Yup.number()
      .typeError("Duration must be a number")
      .positive("Duration must be greater than 0")
      .required("Duration is required"),
    categoryId: Yup.string().required("Category is required"),
    serviceHighlights: Yup.string().trim().required("Highlights are required"),
    image: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Only image files are allowed (JPEG, PNG, GIF)",
        (value) => {
          return (
            !value ||
            (value &&
              ["image/jpeg", "image/png", "image/gif"].includes(value.type))
          );
        }
      ),
  });

  return (
    <div className="form-section">
      <Formik
        enableReinitialize
        initialValues={{
          name: service.name || "",
          description: service.description || "",
          price: service.price || "",
          duration: service.duration || "",
          categoryId: service.categoryId || "",
          serviceHighlights: Array.isArray(service.serviceHighlights)
            ? service.serviceHighlights.join("\n")
            : service.serviceHighlights || "",
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const formData = new FormData();
            formData.append("name", values.name.trim());
            formData.append("description", values.description.trim());
            formData.append("price", values.price);
            formData.append("duration", values.duration);
            formData.append("categoryId", values.categoryId);
            formData.append(
              "serviceHighlights",
              values.serviceHighlights.trim()
            );
            if (values.image) formData.append("image", values.image);

            const { data } = await axios.put(
              `http://localhost:4000/api/services/update/${sid}`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );

            toast.success(data.message);
            navigate("/admin/service-list");
          } catch (error) {
            console.error("Error updating service:", error);
            toast.error(error.response?.data?.message);
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form
            style={{ width: "40%", marginTop: "15px", marginBottom: "30px" }}
            encType="multipart/form-data"
          >
            <div className="title">
              <h3>Edit Service</h3>
            </div>

            <div className="form-control two-control">
              <div>
                <label>Category</label>
                <div className="input-wrapper">
                  <Field as="select" name="categoryId">
                    <option value="">Select Category</option>
                    {categories.length > 0 &&
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
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
                  <Field type="text" name="name" />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label>Service Description</label>
              <div className="input-wrapper">
                <Field as="textarea" rows="4" name="description" />
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
                  <Field type="number" name="price" />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="error"
                  />
                </div>
              </div>

              <div>
                <label>Duration (minutes)</label>
                <div className="input-wrapper">
                  <Field type="number" name="duration" />
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

            <div className="form-control">
              <label>Image</label>
              <div className="input-wrapper two-control">
                <div style={{ flexBasis: "120%" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("image", file);

                      if (
                        file &&
                        !["image/jpeg", "image/png", "image/gif"].includes(
                          file.type
                        )
                      ) {
                        toast.error(
                          "Only image files (JPEG, PNG, GIF) are allowed!"
                        );
                        setFieldValue("image", null);
                      }
                    }}
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="error"
                  />
                  <p>Current Image:</p>
                </div>

                <div>
                  <img
                    src={`http://localhost:4000/${service.image}`}
                    alt="Service Image"
                    width="80"
                    onClick={() =>
                      window.open(
                        `http://localhost:4000/${service.image}`,
                        "_blank"
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-green">
              Update Service
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditService;
