const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mgf3ixl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('cardoctor').collection('services');
        const orderCollection = client.db('cardoctor').collection('orders');
        //get all data
        app.get('/services', async(req,res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)

        })
       //get specific data
        app.get('/services/:id', async(req, res) => {
            const id= req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        //orders api
        app.get('/orders', async (req, res) => {
            let query = {}

            if(req.query.email) {
                query = {
                    email: req.query.email
                }

            }

            const cursor = await orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })

        app.post('/orders', async (req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })
       //update
        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set:{
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updatedDoc);
            res.send(result);
        })


        //delete 

        app.delete('/orders/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })


    }
    finally {

    }
}

run()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})