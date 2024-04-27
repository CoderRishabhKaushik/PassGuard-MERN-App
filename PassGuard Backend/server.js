const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')


dotenv.config()


// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'PassGuard';
const app = express()
const port = 3000
app.use(bodyparser.json())
app.use(cors())

 client.connect();

//get all the passwords 
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
  res.json(findResult);
})

// save a passwords 
app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password)
    res.send({success:true , result:findResult});
})

//Delete a password
app.delete('/:id', async (req, res) => {
  try {
      const { id } = req.params; // Get the password ID from the URL parameter
      const db = client.db(dbName);
      const collection = db.collection('passwords');
      
      // Convert id to ObjectId if needed
      const deleteResult = await collection.deleteOne({ id: id });
      
      if (deleteResult.deletedCount === 1) {
          res.json({ success: true, message: 'Document deleted successfully' });
      } else {
          res.status(404).json({ success: false, message: 'Document not found' });
      }
  } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// Update passwords
app.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let body = req.body;
    const data = { site : body.site,
                   username : body.username,
                   password : body.password
                }
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const updateResult = await collection.updateOne(
      { id: id }, 
      { $set: data },
      { returnOriginal: true }
    );
    res.json({ success: true, result: updateResult.value });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})