import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescripttion,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescripttion || "");
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [gotoProducts, setgotoProducts] = useState(false);
  const [isUploading, setisUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory || "");
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setgotoProducts(true);
  }
  if (gotoProducts) {
    router.push("/products");
  }
  async function uploadImages(ev) {
    // console.log(ev);

    const files = ev.target?.files;
    // console.log(files);
    if (files?.length > 0) {
      setisUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      //  console.log(res.data);
      setisUploading(false);
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let id = category;
    do {
      const catInfo = categories.find(({ _id }) => _id === id);
      if (catInfo) propertiesToFill.unshift(...catInfo?.properties);
      id = catInfo?.parent?._id;
    } while (id);
  }
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }
  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text "
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">uncategorized</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className=" ">
            <label> {p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(e) => setProductProp(p.name, e.target.value)}
              >
                <option value={""}>No property</option>
                {p.values.map((v) => (
                  <option value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-32 bg-white p-2 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="no found" className="rounded-sm " />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-32 flex items-center">
            <Spinner size={40} />
          </div>
        )}
        <label className="w-32  h-32  cursor-pointer  flex justify-center items-center text-sm gap-1 text-indigo-700 rounded-sm bg-white shadow-sm hover:shadow-md border hover:border-2 border-indigo-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>{" "}
          Add Images
          <input
            type="file"
            className="hidden"
            onChange={uploadImages}
            accept="image/*"
            multiple
          />
        </label>
        {!images?.length && <div> This product don't have images included</div>}
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>

      <label>Price</label>
      <input
        type="number"
        placeholder="price in RS"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}

export default ProductForm;
