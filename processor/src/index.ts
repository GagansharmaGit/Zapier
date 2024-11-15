import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";
const client = new PrismaClient();
const TOPIC_NAME= "zap-events"
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
  })

async function main (){
    const producer = kafka.producer()
    await producer.connect();
    const consumer = kafka.consumer({ groupId: 'test-group' })

    while(1){
        const pendingRows = await client.zapRunOutbox.findMany({
            where:{},
            take: 10
        })

        //publish to kafka cluster
        pendingRows.forEach(async ( row ) => {
            producer.send({
                topic: TOPIC_NAME,
                messages: pendingRows.map( r => ({
                    value: r.zapRunId
                }))
            })
        })
    }

}

main();