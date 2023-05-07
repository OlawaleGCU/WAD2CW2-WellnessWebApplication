const PORT = process.env.PORT || 3000;
const nedb = require("nedb");
const express = require('express');
const path = require("path");


const app = express();
require('dotenv').config() // loads data from .env file

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

const db = new nedb({ filename: "goals.db", autoload: true });
console.log("db created");

const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.urlencoded({
    extended: true
  }))

const public = path.join(__dirname,'public');
app.use(express.static(public));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

//add
app.post("/add", function (req, res) {
  db.insert({ name: req.body.name }, function (err, newDoc) {
    if (err) {
      console.log("error", err);
    } else {
      console.log("document inserted", newDoc);
    }
  });
});

//UPDATE
app.post("/update", function (req, res) {
  db.update(
    { _id: req.body._id  },
    { $set: { name: req.body.name  } },
    {},
    function (err, docs) {
      if (err) {
        console.log("error updating documents", err);
      } else {
        console.log(docs, "documents updated");
      }
    }
  );
});

//SHOW ALL
app.post("/showAll", function (req, res) {
  db.find({}, {}, function (err, docs) {
    if (err) {
      console.log("error deleting document");
    } else {
      console.log(docs);
      res.render('employeeData', {
        'employee': docs
     });
    }
  });
});

//DELETE
app.post("/delete", function (req, res) {
  db.remove({ _id: req.body.id  }, {}, function (err, docsRem) {
    if (err) {
      console.log("error deleting document");
    } else {
      console.log(docsRem, "document removed from database");
    }
  });
});

app.post("/view", function (req, res) {
  db.find({ name: req.body.name }, function (err, docs) {
    if (err) {
      console.log("error");
    } else {
      console.log("documents retrieved: ", docs);
      res.render('employeeData', {
        'employee': docs
     });
    
    }
  });
});

const router = require('./routes/fitnessappRoutes');
app.use('/', router);

app.listen(PORT, () => {
console.log(`Server is listening on port ${PORT}`);
});
