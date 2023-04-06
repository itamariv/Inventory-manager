const { MongoClient } = require("mongodb")
//const mongoose=require("mongoose")
const url = "mongodb+srv://itamar:12341234@cluster1.3frbbz1.mongodb.net/?retryWrites=true&w=majority"


let db, users, connection
var client = new MongoClient(url);

const connectDB = async () => {

  try {
    //client =await 
    await client.connect()
    db = client.db("Stock-Manager")
    //console.log(db.databaseName) //works
    console.log("Connected to database")

    // 
    //  users=db.collection("Users")


    //return {client,db,users}
    //return connection;
    //})
  }
  catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }


}

const getDB = (dbName) => {
  //console.log(client.db(dbName).databaseName)
  return client.db(dbName);
}
//client=connectDB();
exports.client = client;
exports.connectDB = connectDB;
exports.db = db;
exports.getDB = getDB;