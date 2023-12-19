import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios, { Axios } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      // console.log(response.data)
      setCategories(response.data);
    });
  }, [name]);
  async function saveCategory(ev) {
    ev.preventDefault();
    const parent = parentCategory === "" ? null : parentCategory;
    const data = { name, parent ,
      properties:properties.map(p=>({name:p.name,values : p.values.split(',')}))};
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
      
      
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([])
  }

  function handlePropertyNameChange(index, property, newname) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newname;
      return properties;
    });
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      const newProperties = [...prev].filter((p, pIndex) => {
        return pIndex != indexToRemove;
      });
      return newProperties;
    });
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category?.parent?._id || "");
    setProperties(category.properties.map(({name,values} )=>({
   name,
   values : values.join(',')
    })))
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure ?",
        text: `Do you want to delete ${category.name} ?`,
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          await axios.get("/api/categories").then((response) => {
            setCategories(response.data);
          });
        }
      })
      .catch((error) => {
        // when promise rejected...
      });
  }
  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  return (
    <div>
      <Layout>
        <h1>Categories</h1>
        <label>
          {" "}
          {editedCategory
            ? `Edit Category ${editedCategory.name}`
            : "New Category Name"}
        </label>
        <form onSubmit={saveCategory}>
          <div className="flex gap-1">
            <input
              type="text"
              placeholder={"Category Name"}
              onChange={(ev) => setName(ev.target.value)}
              value={name}
            />
            <select
              value={parentCategory}
              onChange={(ev) => setParentCategory(ev.target.value)}
            >
              <option value="">No parent category</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block">Properties</label>
            <button
              type="button"
              onClick={addProperty}
              className="btn-primary text-sm mb-1"
            >
              Add new Property
            </button>
            {properties.length > 0 &&
              properties.map((property, index) => (
                <div className="flex gap-1 mb-2" key={index}>
                  <input
                    type="text"
                    value={property.name}
                    className="mb-0"
                    onChange={(ev) =>
                      handlePropertyNameChange(index, property, ev.target.value)
                    }
                    placeholder="property name (example color)"
                  />
                  <input
                    type="text"
                    value={property.values}
                    className="mb-0"
                    onChange={(ev) =>
                      handlePropertyValuesChange(
                        index,
                        property,
                        ev.target.value
                      )
                    }
                    placeholder="values, comma seperated"
                  />
                  <button
                    className="btn-primary text-sm"
                    type="button"
                    onClick={() => removeProperty(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
          <div className="flex gap-1">
            {editedCategory && (
              <button
                className="btn-primary"
                type="button"
                onClick={() => {
                  setEditedCategory(null)
                  setName('')
                  setParentCategory('')
                  setProperties([])
                }}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary text-sm ">
              Save
            </button>
          </div>
        </form>
        {!editedCategory && (
          <table className="basic mt-2">
            <thead>
              <tr>
                <td>Categories</td>
                <td>Parent Category</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 &&
                categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name}</td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => editCategory(category)}
                        className="bg-white text-black border border-gray-600 text-sm py-1 px-2 rounded-md inline-flex gap-1 transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                        <div>Edit</div>
                      </button>
                      <button
                        className="bg-red-400 text-white text-sm py-1 px-2 rounded-md inline-flex gap-1 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => {
                          deleteCategory(category);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
                          />
                        </svg><div>Delete</div>
                      </button>
                      {/* <Link href={"/categories/delete/" + category._id}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
                        />
                      </svg>
                    </Link> */}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        <div></div>
      </Layout>
    </div>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
