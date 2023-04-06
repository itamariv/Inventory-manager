
const { uuid } = require("uuidv4");
const { v4: uuid_v4 } = require('uuid');
const crypto = require("crypto");
const users_list = require("./Databases/users.json");
var fs = require("fs");

const { client, getDB } = require("./db");
var cookieParser = require('cookie-parser');
const { getItem } = require("./item")
const { getSupplier } = require("./supplier")
const db = getDB("Stock-Manager");
const users = db.collection("Users")
var nodemailer = require('nodemailer');




const createNewItem = (req, res) => {
  let { itemName, quantity } = req.body;
  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    if (!user) {
      res.status(400).send({ msg: 'User not found' });
    }
    else {
      //create item id:


      let newItem = getItem(itemName, +quantity);
      newItem.id = create_id(user.items);
      //console.log(newItem);
      user.items.push(newItem);
      let newArray = user.items
      //console.log(user)

      users.replaceOne({ id: intID }, user).then((caught) => { res.status(200).send({ msg: caught }) })
      // users.updateOne({"id": intID},{$set:{items,newArray}}).then((err)=>{res.send(err)})

    }
  }).catch((error) => {
    res.status(400).send({ msg: error })
  }) //replace new user with old one
}

const updateSupplier = (req, res) => {
  let { itemID, supplierID } = req.body;

  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    if (!user) {
      res.status(400).send({ msg: 'User not found' });
    }
    else {
      let supplierIdx = user.suppliers.findIndex((element) => element.id == supplierID);
      let newSupplier = user.suppliers[supplierIdx]//user.suppliers.find((element) => element.id = supplierID);
      if (!newSupplier) { res.send("Supplier not found"); }

      else {
        let itemIdx = user.items.findIndex((element) => element.id == itemID);
        //console.log("aaa", itemIdx)
        if (itemIdx == -1) { res.send("Item not found") }
        else {
          let item = user.items[itemIdx];
          let newSup2 = newSupplier;


          user.items[itemIdx].supplier = newSupplier//newSupplier;
          //console.log("item supplier:", user.items[itemIdx].supplier);


          let item2 = { name: item.name }

          user.suppliers[supplierIdx].supplies.push(item2);
          console.log("user.suplies.", user.suppliers[supplierIdx].supplies)

          users.replaceOne({ id: intID }, user).then((caught) => {
            res.send(caught)
          })

        }
      }
    }
  }).catch((error) => {
    res.send(error)
  }) //replace new user with old one
}

const deleteItems = (req, res) => {
  let { itemsToDelete } = req.body;

  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    if (!user) {
      res.status(400).send({ msg: 'User not found' });
    }
    else {
      //let itemsArr=user.items;
      console.log("items to delete ", itemsToDelete);

      const resArr = user.items.filter(item => !itemsToDelete.includes(item.id)); //filtering out items which need to be deleted
      console.log("filtered: ", resArr)
      user.items = resArr;
      users.replaceOne({ id: intID }, user).then((caught) => {
        res.status(200).send({ msg: caught })
      })
    }
  })
}

const getSuppliers = (req, res) => {
  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    res.send(user.suppliers);
  })
}

const getItems = (req, res) => {
  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    res.send(user.items);
  })
}

const createSupplier = (req, res) => {
  let { name, email, address, phone } = req.body;

  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);

  let user = getUserByID(intID).then((user) => {
    if (!user) {
      res.send("User not found");
    }
    else {
      console.log("here")
      let newSupplier = getSupplier(name, email, address, phone);
      //console.log(newSupplier)
      newSupplier.id = create_id(user.items);
      //console.log(newSupplier);
      user.suppliers.push(newSupplier);
      // console.log(user)

      users.replaceOne({ id: intID }, user).then((caught) => { res.send(caught) })
      // users.updateOne({"id": intID},{$set:{items,newArray}}).then((err)=>{res.send(err)})

    }
  }).catch((error) => {
    res.send({ msg: error })
  }) //replace new user with old one
}
const getUserByID = (id) => {
  return new Promise(function (resolve, reject) {
    users.findOne({ id: id }).then((user) => {
      if (!user) {
        return reject(false);
      }
      else {
        return resolve(user);
      }
    })
  });
}
const setPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`);

  return { salt, hash };
};
const validPassword = (password, salt, hash) => {
  var NewHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return NewHash === hash; //check if the hash we just created is matching the user's database hash
};

const changeItemQuantity = (req, res) => {
  let { itemID, quantity } = req.body;

  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    if (!user) {
      res.status(400).send({ msg: 'User not found' });
    }
    else {


      let itemIdx = user.items.findIndex((element) => element.id == itemID);
      if (itemIdx == -1) { res.status(400).send({ msg: 'Item not found' }) }
      else {
        let item = user.items[itemIdx];
        user.items[itemIdx].quantity = quantity
        users.replaceOne({ id: intID }, user).then((caught) => {
          res.send({ msg: caught })
        })

      }
    }
  }).catch((error) => {
    res.send({ msg: error })
  }) //replace new user with old one
}


function WriteUserToDB(newObj) {

  try {
    users.insertOne(newObj);
    console.log("Wrote user to DB");
    //console.log(newObj.json)
    return true;
  }
  catch (err) {
    console.log("Error writing to DB", err)
    return false;
  }
}


const login = (req, res) => {
  //console.log("login1")
  let { email, password } = req.body;
  if (typeof (email) == 'undefined' || typeof (password) == 'undefined') {
    res.status(400).send({ msg: 'Please fill all info' })
    //console.log("login2")

  }
  userExist(email, password).then(({ ans, msg, id }) => {
    if (ans == true) {
      //console.log("login3")

      let token = uuid_v4();
      token += ` ${id}` //adding id to end of cookie: [cookie id]
      res.cookie("token", token);
      res.status(200).send({ msg: 'Logged in successfuly' });
    }
    else {

      res.status(400).send({ msg: msg });
    }
  })


}

const userExist = (email, password) => {
  let msg = "start", ans = false, id = -1;
  return new Promise(function (resolve, reject) {
    users.findOne({ email: email }).then((user) => {
      if (!user) { //user not found
        // return { answer: false, msg: "User doesn't exist" };
        ans = false;
        msg = 'User doesnt exist';
      }
      else {
        let validate = validPassword(password, user.salt, user.hash);
        if (!validate) { //wrong password entered
          //  return { answer: false, msg: "Wrong password" };
          ans = false;
          msg = "Wrong password";
        }
        else { //right password
          //signed in:
          // get token and send cookie to res
          //    return { answer: true, msg: "" }
          ans = true;
          msg = "good";
          id = user.id;
        }
      }
      return resolve({ ans, msg, id });
    })
  })
}

const verifyUser = (req, res, next) => {
  let cookie = req.cookies.token; //raw cookie in the form of [uuid user_id]
  if (typeof (cookie) != 'undefind') {
    let userID = cookie.split(" ")[1];
    let intID = parseInt(userID);
    console.log(intID)
    users.findOne({ id: intID }).then((user) => {
      if (!user) {
        //console.log("No user")
        // res.send(user.json)
        res.send("User not found");
      }
      else {
        next();
      }
    }).catch((err) => {
      res.send(err)
    })
  }
  else {
    res.send("User is not logged in");
  }
}


const create_user_id = () => {
  return new Promise(function (resolve, reject) {
    users.find({}).toArray((err, results) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      else {
        let maxID = -1;
        results.forEach((item) => {
          if (item.id != null) {
            //console.log("max id:", maxID)
            if (item.id > maxID) {
              maxID = item.id

            }
          }
        })
        //newID = maxID + 1;
        //return newID;
        return resolve(maxID + 1)
      }
      // current_id = maxID + 1;
    })

  })


}

const create_id = (itemArray) => {
  let max_id = -1;
  itemArray.forEach((item) => {
    if (item.id > max_id) {
      max_id = item.id
    }
  })
  return max_id + 1;

}



const get_user_id = (data) => {
  return data;
}




const create_user = (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name) {

    res.status(400).send("Missing first name in request")//.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }
  if (!last_name) {
    res.status(400).send("Missing last name in request")//.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }
  if (!password) {

    res.status(400).send("Missing password in request")//.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }
  if (!email) {
    res.status(400).send("Missing email in request")//.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }
  // if (emailExists(email)) {
  //   res.send("User with this email already exists. please use another email address.").sendStatus(StatusCodes.BAD_REQUEST);
  // }
  // if (emailExists(email)) {
  //   res.send("Email already exists. please use another email address").sendStatus(StatusCodes.BAD_REQUEST);

  // }
  emailExists(email).then((answer) => {
    if (answer) {
      res.status(400).send({ msg: 'Email already exists. please use another email address' })
      //return;
    }
    else {
      create_user_id().then((data) => {
        const { salt, hash } = setPassword(password);

        const newUser = {
          first_name: first_name,
          last_name: last_name,
          email: email,
          id: data,
          salt,
          hash,
          items: [],
          suppliers: [],
          sendEmail: "",
          emailService: "",
          emailPassword: "",
          business_name: ""
        }
        //console.log(newUser)
        //return newUser;
        let check = WriteUserToDB(newUser);
        if (check) {
          res.status(200).send({ newUser })
        }
        else {
          console.log("Couldn't write user to DB")
          res.status(500).send("Error creating user")
        }

      })

    }
  })




}

const emailExists = (email) => {
  // const data = users
  // users.find({}).toArray().then((data)=>{
  // data.forEach((user) => {
  //   console.log(user.email)
  //   if (user.email == email) {
  //     return true;
  //   }
  // });
  // })
  // return false;
  return new Promise(function (resolve, reject) {

    users.findOne({ email: email }).then((data) => {
      let res;
      if (data != null) {
        res = true;
      }
      else {
        res = false;
      }
      return resolve(res);
    }

    )

  })

}




const create_user1 = (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name) {

    res.send("Missing first name in request").sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }
  if (!last_name) {
    res.send("Missing last name in request").sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }
  if (!password) {

    res.send("Missing password in request").sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }
  if (!email) {
    res.send("Missing email in request").sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }
  // if (emailExists(email)) {
  //   res.send("User with this email already exists. please use another email address.").sendStatus(StatusCodes.BAD_REQUEST);
  // }
  if (emailExists(email)) {
    res.send("Email already exists. please use another email address").sendStatus(StatusCodes.BAD_REQUEST);

  }

  let user = getUser(first_name, last_name, password, email);

  //write user to DB
  //writeUserToDB(user)

  //res.send("Sign up completed").sendStatus(200)
  //&&
  // let check = WriteUserToDB(user);
  // if (check) {
  //   res.status(200).send({ user })
  // }
  // else {
  //   console.log("Couldn't write user to DB")
  //   res.status(500).send("Error creating user")
  // }
  res.send("OK")
  return user;
  //&&
}

const restock = (req, res) => {
  let { arr } = req.body; //[{itemID,amount},...] //on frontend: make sure its an array of objects as mentioned.
  //NOTE: google users must have 2 step verification & a special password created for nodemailer.

  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    console.log(user.emailService)
    if (typeof (user.emailService) == 'undefined') {

      res.status(400).send("Email not updated for sending messages").status(400)
    }
    else {
      var transporter = nodemailer.createTransport({
        service: user.emailService,
        auth: {
          user: user.sendEmail,
          pass: user.emailPassword
        }
      });
      let supplierMap = new Map([]);
      console.log("arr ", arr[0])
      arr.forEach(element => {
        //find supplier by id
        let item = user.items.find(itemObject => itemObject.id == element.itemID);
        //check if found
        if (typeof (item) == 'undefined') {
          res.status(400).send("Item not found")
        }
        else {
          let supplier = item.supplier;
          //check if found
          if (typeof (supplier) == 'undefined') {
            res.send("Supplier not found")
          }
          else {

            element.supplier = supplier;
            element.item = item;

            //check if supplier exists in supplierMap
            if (supplierMap.has(supplier.id)) {
              supplierMap[supplier.id].push(element);
            }
            else { //supplier doesnt exist in Map
              supplierMap.set(supplier.id, [element]);
            }

          }
        }


      })
      //create messages using the map.
      console.log("supplier, ", supplierMap);
      supplierMap.forEach(supplier => {
        let message = `Hi ${supplier[0].supplier.name}, I would like to order: \n`;
        message += `Quantity  |  Item \n`;
        supplier.forEach(item => {
          message += `${item.amount}       |  ${item.item.name}`
        })
        console.log("msg ", message);
        //send the message
        var mailMessage = {
          from: user.sendEmail,
          to: "itamariv@mta.ac.il",
          subject: 'Restock',
          text: message
        };

        transporter.sendMail(mailMessage, function (error, info) {
          if (error) {
            console.log("err ", error);
            res.send(error)
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        //check if Map.foreach works
      })
      res.send("Done")
    }
    //
  })
}

const getRestockMessages = (req, res) => {
  let { restockList } = req.body; //array of users. each user now has a property 'restock' which holds quantity of this item to be restocked
  let arr = JSON.parse(restockList);
  console.log(arr)

  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    let supplierMap = new Map([]); //this map sorts the items by their supplier.
    let resMap = new Map([]);
    arr.forEach(item => {
      let supplier = item.supplier;
      if (typeof (supplier) == 'undefined') {
        res.status(400).send({ msg: 'supplier not found' })
      }
      else {
        if (supplierMap.has(supplier.id)) {
          // supplierMap[supplier.id].push(item);
          let tempArr = supplierMap.get(supplier.id);
          tempArr.push(item);
          supplierMap.set(supplier.id, tempArr)
        }
        else { //supplier doesnt exist in map
          supplierMap.set(supplier.id, [item]);
        }

      }
    })

    supplierMap.forEach(element => {
      let message = `Hi ${element[0].supplier.name}, I would like to order:  \n`;
      message += `Item        |       Quantity  \n`;
      element.forEach(itemInList => {
        message += `${itemInList.name}       |       ${itemInList.restock}  \n`
      })
      resMap.set(element[0].supplier.id, message); //resMap's key is the supplier's id, and the value is the message to be sent to them.
      console.log("MAP", resMap)

    })
    console.log("MAP", resMap)

    res.send({ resMap: [...resMap] });
  })
}

const sendRestockMsg = (req, res) => {
  let { arr } = req.body; //array object = [supplierID,msg]
  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    console.log(user.emailService)
    if (typeof (user.emailService) == 'undefined') {

      res.status(400).send({ msg: "Email not updated for sending messages" }).status(400)
    }
    else {
      var transporter = nodemailer.createTransport({
        service: user.emailService,
        auth: {
          user: user.sendEmail,
          pass: `dcaycknxvqvueygu`//`user.emailPassword` //in some services this password needs to be generated specifically (Gmail for example)
        }
      });

      arr.forEach((element) => {
        let supplierEmail = user.suppliers.find(supplier => supplier.id == element[0]).email;
        console.log("Supplier:", supplierEmail);

        var mailMessage = {
          from: user.sendEmail,
          to: `${supplierEmail}`,
          subject: 'Restock',
          text: element[1]
        };

        transporter.sendMail(mailMessage, function (error, info) {
          if (error) {
            console.log("err ", error);
            res.status(400).send({ msg: error })
          } else {
            cosnole.log({ msg: info });
          }
        });


      })

    }
  })



}
const updateEmail = (req, res) => {
  let { sendEmail, emailPassword, emailService } = req.body;
  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    user.sendEmail = sendEmail; //email which user will send messages to suppliers from.
    user.emailService = emailService;
    user.emailPassword = emailPassword;
    users.replaceOne({ id: intID }, user).then((caught) => { res.send(caught) })
  })
}



const updateUser = (req, res) => {
  let { first_name, last_name, email, business_name } = req.body;
  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    user.first_name = first_name; //email which user will send messages to suppliers from.
    user.last_name = last_name;
    user.email = email;

    user.business_name = business_name;
    users.replaceOne({ id: intID }, user).then((caught) => { res.send(caught) })
  })
}

const updatePassword = (req, res) => {
  let { new_password } = req.body;
  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
    const { salt, hash } = setPassword(new_password);
    user.salt = salt;
    user.hash = hash;
    users.replaceOne({ id: intID }, user).then((caught) => { res.send(caught) })
  })
}

const getMyUser = (req, res) => {
  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  getUserByID(intID).then((user) => {
    //console.log(user)
    res.send(user);
  });

}
const changeSupplierInfo = (req, res) => {
  let { supplierID, supplierName, email, address, phone } = req.body; //array object = [supplierID,msg]
  let userID = req.cookies.token.split(" ")[1];
  let intID = parseInt(userID);
  let user = getUserByID(intID).then((user) => {
      //let suppliers=user.suppliers//.find(element=>element.id=supplierID);
      let idx=user.suppliers.findIndex(element=>element.id=supplierID);
      let supplier=user.suppliers[idx];
      supplier.name=supplierName;
      supplier.email=email;
      supplier.address=address;
      supplier.phone=phone;
      user.suppliers[idx]=supplier;
      users.replaceOne({ id: intID }, user).then((caught) => { res.send(caught) })
  })
}


exports.create_user = create_user;
exports.create_user_id = create_user_id;
exports.login = login;
exports.verifyUser = verifyUser;
exports.createNewItem = createNewItem;
exports.createSupplier = createSupplier;
exports.updateSupplier = updateSupplier;
exports.getSuppliers = getSuppliers;
exports.getItems = getItems;
exports.updateEmail = updateEmail;
exports.restock = restock;
exports.getMyUser = getMyUser;
exports.changeItemQuantity = changeItemQuantity;
exports.deleteItems = deleteItems;
exports.updateUser = updateUser;
exports.updatePassword = updatePassword;
exports.getRestockMessages = getRestockMessages;
exports.sendRestockMsg = sendRestockMsg;
exports.changeSupplierInfo=changeSupplierInfo;