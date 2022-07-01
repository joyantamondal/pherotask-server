require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.bdgqc.mongodb.net:27017,cluster0-shard-00-01.bdgqc.mongodb.net:27017,cluster0-shard-00-02.bdgqc.mongodb.net:27017/?ssl=true&replicaSet=atlas-1ib0bq-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const database = client.db('jobtask');
    const addBillingCollection = database.collection('add-billing');
    
    // // POST API 
    app.post('/add-billing', async (req,res)=>{
      const billinResult = req.body;

      console.log('Hit The Service Api', billinResult);
      const result = await addBillingCollection.insertOne(billinResult);
   
     return res.json(result)
    })
       // GET API
       app.get('/billing-list',async(req,res)=>{
        const cursor = addBillingCollection.find({});
        const billingLlists = await cursor.toArray();
        res.send(billingLlists);
    });

     // manage product delete 
     app.delete('/update-billing/:id',async (req,res)=>{
      const result = await addBillingCollection.deleteOne({_id: ObjectId(req.params.id)
      });
      res.send(result);
  })
  app.get("/",(req,res)=>{
  res.send('Hello P Hero');
  })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port,()=>{
console.log('Listeting to port', port)
})