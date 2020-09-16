const express = require('express');
const bodyParser = require('body-parser');
const sql = require("mssql");
const cookieParser = require('cookie-parser');
const crypto = require("crypto");
const { waitForDebugger } = require('inspector');
const { request } = require('http');
const session = require('express-session');
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const conn = require("../connect")();
const router = express.Router();

// config for your database
var config = {
  user: 'pdmUser',
  password: 'password',
  server: 'ip',
  database: 'PDM',
  "options": {
      "encrypt": true,
      "enableArithAbort": true
      },
 
};


/* GET home page. */
router.get('/', function(req, res, next) {
 res.send("welcome to backend");
});

 
     
const PassHash = password => crypto.createHash('sha256').update(password).digest('base64');
//*************
//registration post

router.post('/reg',function(req,res,next) {
    conn.connect().then(function () {
   // console.log(req.body);
      var transaction = new sql.Transaction(conn);
      transaction.begin().then(function () {
      var request = new sql.Request(transaction);
      let {UserName, Email, Password} = req.body;
      
      request.input("UserName", sql.VarChar(50), UserName)
      request.input("Email", sql.VarChar(50), Email)
      request.input("Password", sql.VarChar(50), PassHash(Password))

     //check email exist or not
     request.query("SELECT COUNT(*) AS st  FROM TBL_USERS WHERE Email = '"+req.body.Email+"'",function(err , data){
      if(data.recordset[0]["st"] !=  0) {  
        return res.json({ 
          success: false,
          Message: "Email Already exist!!!!!!!!!"
        });
     } 
        else {
         request.execute("spRegisterInfo").then(function () {
           transaction.commit().then(function (recordSet) {
               conn.close();
                  res.status(200).send(req.body);
              })
              .catch(function (err) {
                  conn.close();
                  res.status(400).send("Error while inserting data1");
              });
              return res.json({ 
                success: true,
                Message: "Success!!!!!!!!"
              });
            })
          }
      });


    })
  })
});  
       

module.exports = router;

        
     
      

     


 
