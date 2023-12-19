import mongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { getServerSession } from "next-auth";
import {  isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req,res)
  const { method } = req;
  if (method === "POST") {
    const { name , parent, properties} = req.body;
    const categoryDoc = await Category.create({ name, parent: parent, properties});
    res.json(categoryDoc);
  }
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Category.findOne({ _id: req.query.id }));
    } else {
      res.json(await Category.find().populate('parent'));
    }
  }
  if(method === 'DELETE'){
    const {_id} = req.query;
    console.log(_id);
    await Category.deleteOne({_id});
    res.json(true);
  }
  if(method === 'PUT'){
    const { name , parent,properties, _id} = req.body;
    const categoryDoc = await Category.updateOne({_id},{ name, parent: parent, properties});
    res.json(categoryDoc);
  }
}
