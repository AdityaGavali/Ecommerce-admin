import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function DeleteProductPage() {
  
  const [categoryInfo, setCategoryInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    axios.get("/api/categories?id=" + id).then((response) => {
      setCategoryInfo(response.data);
      
    });
  }, [id]);
 function goback(){router.push("/categories")};
 async function Delete_it(){
  await  axios.delete("/api/categories?id=" + id);
  router.push("/categories");
 }
  return (
    <Layout>
    
        <h1 className="text-blue-700 text-center m-4">Do you realy want to delete &nbsp; "{categoryInfo?.name}" ?</h1>
        <div className="flex gap-2 items-center justify-center">
        <button className="btn-primary" onClick={Delete_it}>Yes</button>
        <button className="btn-primary" onClick={goback}>No</button>
    </div>
        
    

    </Layout>
  );
}