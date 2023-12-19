import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import Products from "@/pages/products";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function DeleteProductPage() {
  
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
      
    });
  }, [id]);
 function goback(){router.push("/products")};
 async function Delete_it(){
  await  axios.delete("/api/products?id=" + id);
  router.push("/products");
 }
  return (
    <Layout>
    
        <h1 className="text-blue-700 text-center m-4">Do you realy want to delete &nbsp; "{productInfo?.title}" ?</h1>
        <div className="flex gap-2 items-center justify-center">
        <button className="btn-primary" onClick={Delete_it}>Yes</button>
        <button className="btn-primary" onClick={goback}>No</button>
    </div>
        
    

    </Layout>
  );
}