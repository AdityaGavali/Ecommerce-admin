import Layout from "@/components/Layout"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"


function Products() {
  const [products, setProducts] = useState([]);
  useEffect(()=>{
    axios.get('/api/products').then(response =>{
      // console.log(response.data)
      setProducts(response.data)
    })
  },[])
  return (
    <Layout>
   
    <Link className="btn-primary  inline-flex  gap-2" href={'/products/new'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
Add New Product</Link>
    <table className="basic mt-2">
      <thead>
        <tr >
          <td>Product Name</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {products.map(product =>(
          <tr key={product._id}>
            <td>{product.title}</td>
            <td className="flex gap-2">
              <Link href={'/products/edit/'+product._id} >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
</svg><div>Edit</div></Link>
              <Link href={'/products/delete/'+product._id} className="btn-red">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
</svg><div>Delete</div>
 </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </Layout>
    
  )
}


export default Products