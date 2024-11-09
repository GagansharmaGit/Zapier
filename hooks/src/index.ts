import express from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const app = express();
const PORT = process.env.PORT;
app.post("/hooks/catch/:userId/:zapId",async (req,res)=>{
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    //store in db a new trigger
    await client.$transaction(async tx =>{
        const run = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });

        await tx.zapRunOutbox.create({
            data:{
                runId: run.id
            } as any
        });

        res.json({
            message: "Webhook Received"
        });
    })

    //push in to the queue (kafka/redis)
})

app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`)
})