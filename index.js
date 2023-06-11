const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hmio3i.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const classCollection = client.db("lanGuageDB").collection("Classes");
    const instactorCollection = client.db("lanGuageDB").collection("instactor");
    const usersCollection = client.db("lanGuageDB").collection("users");
    const StudentclassCollection = client
      .db("lanGuageDB")
      .collection("Studentclass");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = {email: user.email}
      const existingUser = await usersCollection.findOne(query);
      console.log('existingUser',existingUser);
      if(existingUser){
        return res.send({message:'User Alredy Exists'})
      }
      const reselt = await usersCollection.insertOne(user)
      res.send(reselt)
    });
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.patch('/users/admin/:id',async (req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateDoc ={
        $set: {
          role: 'admin'
        },
      };
      const result = await usersCollection.updateOne(filter,updateDoc);
      res.send(result)
    });


    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await usersCollection.deleteOne(query);
        console.log("Deleted student class:", result);
        res.status(200).json(result);
      } catch (error) {
        console.error("Error deleting student class:", error);
        res.status(500).json({ error: "Failed to delete student class" });
      }
    });



    app.get("/Classes", async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    app.get("/instactor", async (req, res) => {
      const result = await instactorCollection.find().toArray();
      res.send(result);
    });

    app.get("/Studentclass", async (req, res) => {
      const result = await StudentclassCollection.find().toArray();
      res.send(result);
    });

    app.post("/Studentclass", async (req, res) => {
      const item = {
        image: req.body.image,
        name: req.body.name,
        instructor: req.body.instructor,
        availableSeats: req.body.availableSeats,
        price: req.body.price,
      };

      try {
        const result = await StudentclassCollection.insertOne(item);
        console.log("Inserted student class:", result);
        res.status(200).json(result);
      } catch (error) {
        console.error("Error inserting student class:", error);
        res.status(500).json({ error: "Failed to insert student class" });
      }
    });

    app.delete("/Studentclass/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await StudentclassCollection.deleteOne(query);
        console.log("Deleted student class:", result);
        res.status(200).json(result);
      } catch (error) {
        console.error("Error deleting student class:", error);
        res.status(500).json({ error: "Failed to delete student class" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
