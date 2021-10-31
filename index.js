const express = require ('express');
const app = express();
const port = process.env.PORT ||5000;
const ObjectId = require ('mongodb').ObjectId;
const cors = require ('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fw2fr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





async function run(){

    try{

        await client.connect();
       const database= client.db('tour_plans');
       const tourCollection = database.collection('tours');
       const userCollection = database.collection('users');



    //   get all tours api
    app.get('/tours', async(req,res)=>{
        const cursor = tourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);

    });

    // get all order api
    app.get('/orders', async(req,res)=>{
        const cursor= userCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
    })

    // get single tour api

    app.get('/tours/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id : ObjectId (id)};
        const tour = await tourCollection.findOne(query);
        res.json(tour);
    
    });


    // addTours api
     app.post('/addTours', async(req,res)=>{
        console.log(req.body);
        const result = await tourCollection.insertOne(req.body);
        res.json(result);
     })

    // post api for inserting data
    app.post('/users', async (req,res)=>{
        const user = req.body;
        
        const result = await userCollection.insertOne(user);
            console.log(result)
            
            res.json(result)
    });
     // delete api
     app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.json(result);
        
    });

    // get my all orders
   app.get('/orders/:email', async(req,res)=>{
       console.log(req.params.email);
       const result =await userCollection.find({email: req.params.email}).toArray();
       res.send(result);
   });

    // update api 
    app.put('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                status: updatedUser.status
               
            },
        };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        
        console.log('updating', req.body)
        res.json(result)
        console.log('hi', result)
        
    })



    }
    finally{
        // await client.close();
    }




}

run().catch(console.dir)







app.get('/',(req,res)=>{
    res.send('hello more memories travel server');
})

app.listen(port,()=>{
    console.log(`port is running at http://localhost:${port}`)
})