import express from "express";
import { PrismaClient } from "@prisma/client";
const app = express();

app.post("/hooks/catch/:userId/:zapId",(req,res)=>{
    const userId = req.params.userId;
    const zapId = req.params.zapId;

    //store in db a new trigger

    //push in to the queue (kafka/redis)
})