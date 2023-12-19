// import Layout from "@/components/Layout"
// import ProductForm from "@/components/ProductForm";
// import axios from "axios";
// import { useRouter } from "next/router"
// import { useEffect, useState } from "react";


//  function EditProductPage() {
//   const [productInfo,setproductInfo] = useState(null)
//   const [loading, setloading] = useState(true);
//     const router = useRouter()
//   const {id} = router.query;
// useEffect(()=>{
//     if(!id){
//       return;
//     }
    
//    axios.get('/api/products?id='+id).then(response=>{
//        setproductInfo( response.data);
//     });
  
//   },[id]);
//   return (
//    <Layout>
//  <ProductForm {...productInfo}/>
//    </Layout>
//   )
// }

// export default EditProductPage
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
      setLoading(false);
    });
  }, [id]);
  return (
    <Layout>
      {loading ? (
        <p className=" h-screen flex justify-center items-center "><Spinner size = {60} /></p>
      ) : (
        <>
          <h1>Edit Product</h1>
          <ProductForm {...productInfo} />
        </>
      )}

    </Layout>
  );
}