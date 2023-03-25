const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { connect } = require('./db');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors({
    origin: 'http://localhost:3000',
}));

let port = process.env.PORT || 4000

app.get("/getData/:page", async (req, res) => {

    try {
        let response = {}
        let currentPage = req.params.page || 0; // initially 0

        currentPage = parseInt(currentPage + 1) // Current page number
        const limit = 10; // Number of records per page

        const client = await connect();
        const db = client.db('mydb');
        const collection = db.collection('mycollection');
        let totalCount = await collection.countDocuments()

        let data_res = await collection.find().skip((currentPage - 1) * limit).limit(limit).toArray();
        // let data_res = await collection.find({}).toArray();

        response = {
            totalCount,
            data_res
        }
        res.status(200).send({ statusCode: 0, msg: 'Data fetch successfully', data: response })
        client.close();

    } catch (error) {
        console.log(error)
        res.status(500).send(error);

    }
})

app.get("/delete_data", async (req, res) => {
    try {
        const client = await connect();
        const db = client.db('mydb');
        const collection = db.collection('mycollection');
        let delete_res = collection.deleteMany({})
        res.status(200).send({ statusCode: 0, msg: 'Data deleted successfully', data: delete_res })
        client.close();


    } catch (error) {
        console.log(error)
        res.status(500).send(error);

    }
})

app.post("/add_data", async (request, response) => {
    console.log('request.body', request.body)
    try {
        const client = await connect();
        const db = client.db('mydb');
        const collection = db.collection('mycollection');
        const res = await collection.insertMany(request.body);
        client.close();
        response.status(200).send({ statusCode: 0, msg: 'Data inserted successfully', data: res })

    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});


app.listen(port, () => {
    console.log(`app is listning on port ${port}`)
})