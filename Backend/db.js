const MongoClient = require('mongodb').MongoClient;

// Set the connection URL
const url = 'mongodb://localhost:27017';

// Set the database name
const dbName = 'myDatabase';

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
  await client.connect();
  console.log('Connected to MongoDB');
  return client;
}

module.exports = { connect };

  


