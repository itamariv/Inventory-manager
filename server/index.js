const express = require("express");
var cookieParser = require('cookie-parser');


const PORT = process.env.PORT || 3001;


const app = express();
app.use(express.json()); // to support JSON-encoded bodies
app.use(cookieParser());
const cors = require('cors');
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.static(path.join(__dirname, 'build')));

const { changeSupplierInfo, sendRestockMsg, getRestockMessages, updatePassword, updateUser, deleteItems, changeItemQuantity, getMyUser, login, create_user, verifyUser, createNewItem, createSupplier, updateSupplier, getSuppliers, getItems, updateEmail, restock } = require("./user")

const { connectDB, getDB } = require("./db");

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
// app.post('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {

      console.log(`Server listening on ${PORT}`);
    });
  }
  catch (error) {
    console.log(error);
  }
}



start();

const db = getDB("Stock-Manager");
const users = db.collection("Users")





async function WriteToDB(collectionName, newObj) {
  // await client.connect();
  const collection = db.collection(collectionName);
  //const result=await thisTable.insertOne(newObj); 
  try {
    collection.insertOne(newObj);
    console.log("Wrote to DB");
    console.log(newObj)
  }
  catch (err) { console.log("Error writing to DB", err) }
  //if (result){ console.log("Wrote To DB")}
}

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.post("/api/register", (req, res) => {
  const newUser = create_user(req, res);

});

app.post("/api/login", (req, res) => {
  login(req, res)

});

app.post("/check", (req, res) => {
  verifyUser(req, res)
})

app.post("/api/additem", verifyUser, (req, res) => {
  createNewItem(req, res);
})

app.post("/api/addsupplier", verifyUser, (req, res) => {
  createSupplier(req, res)
})

app.post("/api/updatesupplier", verifyUser, (req, res) => {
  updateSupplier(req, res)
})

app.get("/api/getsuppliers", verifyUser, (req, res) => {
  getSuppliers(req, res);
})

app.get("/api/getItems", verifyUser, (req, res) => {
  getItems(req, res);
})

app.post("/api/updatemail", verifyUser, (req, res) => {
  updateEmail(req, res);
})

app.post("/api/restock", verifyUser, (req, res) => {
  restock(req, res);
})

app.get("/api/getUser", verifyUser, (req, res) => {
  getMyUser(req, res);
})

app.post("/api/changeQuantity", verifyUser, (req, res) => {
  changeItemQuantity(req, res);
})

app.post("/api/deleteItems", verifyUser, (req, res) => {
  deleteItems(req, res);
})
app.post("/api/updateUser", verifyUser, (req, res) => {
  updateUser(req, res);
})
app.post("/api/updatePassword", verifyUser, (req, res) => {
  updatePassword(req, res)
})
app.post("/api/updateEmail", verifyUser, (req, res) => {
  updateEmail(req, res)
})
app.post("/api/getRestockMsg", verifyUser, (req, res) => {
  getRestockMessages(req, res);
})
//exports.create_user_id = create_user_id;

app.post("/api/sendRestockMsg", verifyUser, (req, res) => {
  sendRestockMsg(req, res);
})

app.post("/api/changeSupplierInfo", verifyUser, (req, res) => {
  changeSupplierInfo(req, res);
})

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.post('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.get("/*", function (req, res) {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// })