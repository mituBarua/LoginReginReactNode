var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const sql = require("mssql");
const cookieParser = require('cookie-parser');
const crypto = require("crypto");
const { request } = require('express');
const app = express();
const jwt = require("jsonwebtoken");
var conn = require("../connect")();


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

/* GET users listing. */

//LOGIN here
//login with jwt authentication
require('dotenv').config()


router.post('/login',  function(req,res){
   let email = req.body.Email;
   let password = req.body.Password;
  
   const PassHash = password => crypto.createHash('sha256').update(password).digest('base64');
   conn.connect().then(function () {
     var transaction = new sql.Transaction(conn);
     transaction.begin().then(function () {
     var request = new sql.Request(transaction);
     var sqlEmailPass = `SELECT Email,Password FROM TBL_USERS WHERE Email = '${email}' and Password= '${PassHash(password)}'`
     request.query(sqlEmailPass, (err,recordset)=>{

      if(recordset.rowsAffected == 0 ) {
        console.log("Email And Password Not Found!!!!!!!!!")
       // alert("Email And Password Not Found!!!!!!!!!");
     return res.json({ 
       success: false,
       Message: "Email And Password Not Found!!!!!!!!!"
     });

        }

      else {
           var hasingPass = PassHash(password); 
            if (hasingPass == recordset.recordset[0].Password){
              const accessToken =jwt.sign({ recordset }, "process.env.ACCESS_TOKEN_SECRET", { expiresIn: '60s' })
              const refreshToken = jwt.sign({ recordset }, "process.env.REFRESH_TOKEN_SECRET")
              refreshTokens.push(refreshToken)
              res.json({
                 accessToken: accessToken,
                  refreshToken: refreshToken ,
                  success: true
                })
              }

            else {
                alert("Password doesn't match");
              }
      }

      })
    });
   });

});  

function verifyToken(req, res, next) {
   const bearerHeader = req.headers["authorization"];
   if (typeof bearerHeader !== "undefined") {
     const bearerToken = bearerHeader.split(" ")[1];
     req.token = bearerToken;
     next();
     } 
   else {
     res.sendStatus(403);
   }
 }
router.post("/login/posts", verifyToken, (req, res) => {
   jwt.verify(req.token, "process.env.ACCESS_TOKEN_SECRET", (err, authData) => {
     if (err) {
       res.sendStatus(403);
     } else {
       res.json({
         message: "POST created...",
 
         authData,
       });
     }
   });
 });

 app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})
let refreshTokens = []
router.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, "process.env.REFRESH_TOKEN_SECRET", (err, recordset) => {
    if (err) return res.sendStatus(403)
    const accessToken =jwt.sign({ recordset }, "process.env.ACCESS_TOKEN_SECRET", { expiresIn: '600s' })
    res.json({ accessToken: accessToken })
  })
})


module.exports = router;
