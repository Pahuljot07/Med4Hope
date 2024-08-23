var express=require("express");
var fileuploader=require("express-fileupload");
var mysql = require("mysql");
//var bodyParser = require('body-parser');//node-mailer
//var nodemailer = require('nodemailer');//node-mailer

var app = express();
app.listen(2001, function () {
        console.log("Server Started");
    });
app.use(express.static("public")); //static files such as .css/.png/.jpg etc.
app.use(fileuploader());
//app.use(bodyParser.urlencoded({ extended: false }));


app.get("/index", function (req, resp)            //URL Handler For Index Routing Traffic
{
    resp.sendFile(process.cwd + "/public/index.html");
});

app.get("/profile-donor", function (req, resp)            
{
    resp.sendFile(process.cwd + "/public/profile-donor.html");
});
app.get("/avail-med", function (req, resp)            
{
    resp.sendFile(process.cwd + "/public/avail-med.html");
});
app.get("/profile-needy", function (req, resp)            
{
    resp.sendFile(process.cwd + "/public/profile-needy.html");
});
app.get("/dash-needy", function (req, resp)            
{
    resp.sendFile(process.cwd + "/public/dash-needy.html");
});
app.get("/dash-donor", function (req, resp)            
{
    resp.sendFile(process.cwd + "/public/dash-donor.html");
});
app.get("/dash-admin", function (req, resp)            
{
    resp.sendFile(process.cwd + "/public/dash-donor.html");
});
app.get("/panel-users", function (req, resp)            
{
    resp.sendFile(process.cwd + "/public/panel-users.html");
});
app.get("/panel-needy", function (req, resp)            
{
    resp.sendFile(process.cwd + "/public/panel-needy.html");
});
app.get("/med-manager", function (req, resp)            
{
    resp.sendFile(process.cwd + "/public/med-manager.html");
});
app.get("/finder-med", function (req, resp)            
{
    resp.sendFile(process.cwd + "/public/finder-med.html");
});
var dbConfig={
    host:"127.0.0.1",
    user:"root",
    password:"Pahul@7788",
    database:"project2023",
    dateStrings:true
  }
  
  var dbCon=mysql.createConnection(dbConfig);
  dbCon.connect(function(jasoos){
      if(jasoos==null)
          console.log("Connected Successfully");
          else
          console.log(jasoos);
  })
app.use(express.urlencoded(true));
//================================SignUp Form=======================================================================================

//============================AJAX Connectivity======================================
app.get("/chk-submit", function (req, resp) {
    //saving data in table
    var email = req.query.kuchemail;
    var pwd = req.query.kuchpwd;
    var type = req.query.kuchtype;


    //fixed                             //same seq. as in table
    dbCon.query("insert into users(email,pwd,type,dos,status) values (?,?,?,current_date,1)", [email,pwd,type], function (err) {
        if (err == null)
            resp.send("Record Saved Success");
        else
            resp.send(err);
    })
})
//=================================Email Availability====================================
app.get("/chk-email",function(req,resp)
{
    dbCon.query("select * from users where email=?",[req.query.kuchEmail],function(err,resultTable)
    {
          if(err==null)
          {
            if(resultTable.length==1)
              resp.send("Emailid Unavailable");
            else
              resp.send("Available");
            }
              else
            resp.send(err);
    })
})

//============================AJAX Connectivity======================================
app.get("/login-form",function(req,resp){
    var email=req.query.Lkuchemail;
    var pawd=req.query.Lkuchpwd;
    dbCon.query("select status,type from users where email=? and pwd=?",[email,pawd],function(err,resultTable){
      if(err==null)
      {
        if(resultTable.length==1)
        {
            if(resultTable[0].status==1)
            resp.send(resultTable[0].type);
            else
            resp.send("You are blocked");
        }
         else
                 resp.send("Invalid EmailID/Password");
          }
          else
            resp.send(err);
  
     
 
})
 })
 //================================profile-donor database submission=============================================================
 app.post("/save-donor",function(req,resp){
    //---------------File Uploading================
    var fileName="nopic.jpg";
    if(req.files!=null)
     {
       //console.log(process.cwd());
        fileName=req.files.ppic.name;
       var path=process.cwd()+"/public/uploads/"+fileName;
       req.files.ppic.mv(path);
     }
      console.log(req.body);
    resp.send("Filename="+fileName);
 //saving data in table
 var email=req.body.dnrEmail;
 var name=req.body.dnrName;
 var mobile=req.body.dnrCt;
 var address=req.body.dnrAdd;
 var city=req.body.dnrCity;
 var proof=req.body.dnrId;
 var ahoursfrom=req.body.dnrFrom;
 var ahoursto=req.body.dnrTo;
 dbCon.query("insert into donors(email,name,mobile,address,city,proof,pic,ahoursfrom,ahoursto) values(?,?,?,?,?,?,?,?,?)",[email,name,mobile,address,city,proof,fileName,ahoursfrom,ahoursto],function(erro)
 {
       if(erro==null)
         resp.send("Saved Successfully");
       else
         resp.send(erro);
 })
})
//=============================================Profile-Donor Search Button===================================================================================
app.get("/profile-donor-search-record",function(req,resp)
{
     //saving data in table
    
    
         //fixed                             //same seq. as in table
    dbCon.query("select * from donors where email=?",[req.query.kuchemail],function(err,resultTableJson)
    {
          if(err==null)
             resp.send(resultTableJson);
            else
              resp.send(Error);
            
    })
})
//================================Profile Donor Update=========================================================================================================
app.post("/update-donor",function(req,resp)
{
  //---------------File Uploading================
  var fileName;
  if(req.files!=null)
   {
     //console.log(process.cwd());
      fileName=req.files.ppic.name;
     var path=process.cwd()+"/public/uploads/"+fileName;
     req.files.ppic.mv(path);
   }
   else
   {
    fileName=req.body.hdn;
   }
    console.log(req.body);
    //resp.send("File name="+fileName);

    //saving data in table
    var email=req.body.dnrEmail;
    var name=req.body.dnrName;
    var mobile=req.body.dnrCt;
    var address=req.body.dnrAdd;
    var city=req.body.dnrCity;
    var proof=req.body.dnrId;
    var ahoursfrom=req.body.dnrFrom;
    var ahoursto=req.body.dnrTo;
         //fixed                             //same seq. as in table
    dbCon.query("update donors set name=?,mobile=?,address=?,city=?,proof=?,pic=?,ahoursfrom=?,ahoursto=? where email=?",[name,mobile,address,city,proof,fileName,ahoursfrom,ahoursto,email],function(err)
      {
          if(err==null)
            resp.send("Record Updated Successssfully");
          else
            resp.send(err);
    })
})
//==================================Avail-Med=====================================================================================
app.get("/avail-donor",function(req,resp)
{
     //saving data in table
    var email=req.query.kuchemail;
    var med=req.query.kuchmed;
    var expdate=req.query.kuchexp;
    var packing=req.query.kuchpack;
    var qty=req.query.kuchqty;
    
         //fixed                             //same seq. as in table
    dbCon.query("insert into medsavailable(email,med,expdate,packing,qty) values(?,?,?,?,?)",[email,med,expdate,packing,qty],function(err)
    {
          if(err==null)
          
              
              resp.send("Medicine Availed Successfully");
          
            
              else
            resp.send(err);
    })
})
//==================================================Update Password Settings Donor====================================================
app.get("/update-pwd",function(req,resp)
{
     //saving data in table
    var email=req.query.kuchemail;
    var kopw=req.query.kuchopw;
    var knpw=req.query.kuchnpw;
   
    
         //fixed                             //same seq. as in table
    dbCon.query("update users set pwd=? where email=? and pwd=?",[knpw,email,kopw],function(err)
    {
          if(err==null)
          
           
              resp.send("Password Updated Successfully");
          
            
              else
            resp.send(err);
    })
})
//============================================Update Password Settings Needy===========================================================
app.get("/update-pwd-needy",function(req,resp)
{
     //saving data in table
    var email=req.query.kuchemail;
    var kopw=req.query.kuchopw;
    var knpw=req.query.kuchnpw;
   
    
         //fixed                             //same seq. as in table
    dbCon.query("update users set pwd=? where email=? and pwd=?",[knpw,email,kopw],function(err)
    {
          if(err==null)
          
           
              resp.send("Password Updated Successfully");
          
            
              else
            resp.send(err);
    })
})
//==========================================Needy==================================================================
 //================================profile-needy database submission=============================================================
 app.post("/save-needy",function(req,resp){
  //---------------File Uploading================
  var fileName="nopic.jpg";
  if(req.files!=null)
   {
     //console.log(process.cwd());
      fileName=req.files.ppic.name;
     var path=process.cwd()+"/public/uploads/"+fileName;
     req.files.ppic.mv(path);
   }
    console.log(req.body);
  resp.send("Filename="+fileName);
//saving data in table
var email=req.body.nedEmail;
var name=req.body.nedName;
var mobile=req.body.nedCt;
var address=req.body.nedAdd;
var city=req.body.nedCity;
var proof=req.body.nedId;

dbCon.query("insert into needy(email,name,mobile,address,city,proof,pic) values(?,?,?,?,?,?,?)",[email,name,mobile,address,city,proof,fileName],function(erro)
{
     if(erro==null)
       resp.redirect("Saved Successfully");

     else
       resp.send(erro);
})
})
//=============================================Profile-Needy Search Button===================================================================================
app.get("/profile-needy-search-record",function(req,resp)
{
   //saving data in table
  
  
       //fixed                             //same seq. as in table
  dbCon.query("select * from needy where email=?",[req.query.kuchemail],function(err,resultTableJson)
  {
        if(err==null)
           resp.send(resultTableJson);
          else
            resp.send(Error);
          
  })
})
//================================Profile Needy Update=========================================================================================================
app.post("/update-needy",function(req,resp)
{
//---------------File Uploading================
var fileName;
if(req.files!=null)
 {
   //console.log(process.cwd());
    fileName=req.files.ppic.name;
   var path=process.cwd()+"/public/uploads/"+fileName;
   req.files.ppic.mv(path);
 }
 else
 {
  fileName=req.body.hdn;
 }
  console.log(req.body);
  //resp.send("File name="+fileName);

  //saving data in table
  var email=req.body.nedEmail;
  var name=req.body.nedName;
  var mobile=req.body.nedCt;
  var address=req.body.nedAdd;
  var city=req.body.nedCity;
  var proof=req.body.nedId;

       //fixed                             //same seq. as in table
  dbCon.query("update needy set name=?,mobile=?,address=?,city=?,proof=?,pic=? where email=?",[name,mobile,address,city,proof,fileName,email],function(err)
    {
        if(err==null)
          resp.send("Record Updated Successssfully");
        else
          resp.send(err);
  })
})
//==============Fetch Users Angular Records===================================================
app.get("/get-user-records",function(req,resp)
{
     //saving data in table
    
    
         //fixed                             //same seq. as in table
    dbCon.query("select * from users ",function(err,resultTableJson)
    {
          if(err==null)
             resp.send(resultTableJson);
            else
              resp.send(Error);
            
    })
})
//=================Block Users Angular JS=======================================================
app.get("/block-angular-records",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("update users set status=0 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Blocked");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
//====================Resume Users Angular JS====================================================
app.get("/resume-angular-records",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("update users set status=1 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Resumed");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
//========================Donors==========================================
//==============Fetch Donors Angular Records===================================================
app.get("/get-donor-records",function(req,resp)
{
     //saving data in table
    
    
         //fixed                             //same seq. as in table
    dbCon.query("select * from donors ",function(err,resultTableJson)
    {
          if(err==null)
             resp.send(resultTableJson);
            else
              resp.send(Error);
            
    })
})
//=================Block Donors Angular JS=======================================================
app.get("/block-angular-records-donor",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("update donors set status=0 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Blocked");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
//====================Resume Donors Angular JS====================================================
app.get("/resume-angular-records-donor",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("update donors set status=1 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Resumed");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
//======================Needy=================================
//==============Fetch Needy Angular Records===================================================
app.get("/get-needy-records",function(req,resp)
{
     //saving data in table
    
    
         //fixed                             //same seq. as in table
    dbCon.query("select * from needy ",function(err,resultTableJson)
    {
          if(err==null)
             resp.send(resultTableJson);
            else
              resp.send(Error);
            
    })
})
//=================Block Needy Angular JS=======================================================
app.get("/block-angular-records-needy",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("update needy set status=0 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Blocked");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
//====================Resume Needy Angular JS====================================================
app.get("/resume-angular-records-needy",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("update needy set status=1 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Resumed");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
//===========================Fetch Med Angular Data==================================================
app.get("/get-med-records",function(req,resp)
{
    
    var email=req.query.emailkuch;
    dbCon.query("select * from medsavailable where email=?",[email],function(err,resultTableJson)
    {
          if(err==null)
             resp.send(resultTableJson);
            else
              resp.send(Error);
            
    })
})
//==========================Delete Med Angular Data=====================================================
app.get("/get-angular-med-delete",function(req,resp)
{
  var srno=req.query.kuchsrno;
    dbCon.query("delete from medsavailable where srno=?",[srno],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Med Deleted");

            }
              else
            resp.send(err);
    })
})
//================Distinct City Finder======================================
app.get("/get-city-name",function(req,resp)
{
     //saving data in table
    
    
         //fixed                             //same seq. as in table
    dbCon.query("select distinct city from donors ",function(err,resultTableJson)
    {
          if(err==null)
             resp.send(resultTableJson);
            else
              resp.send(Error);
            
    })
})

//================Distinct Med Name Finder==================================
app.get("/get-med-name",function(req,resp)
{
     //saving data in table
    
    
         //fixed                             //same seq. as in table
    dbCon.query("select distinct med from medsavailable ",function(err,resultTableJson)
    {
          if(err==null)
             resp.send(resultTableJson);
            else
              resp.send(Error);
            
    })
})
//=========================Get Donors In Cards Inner Join Query=========================================================
app.get("/fetch-donors",function(req,resp)
{
  console.log(req.query);
  var med=req.query.kuchmed;
  var city=req.query.kuchcity;

  var query="select donors.*,medsavailable.* from donors inner join medsavailable on donors.email=medsavailable.email where medsavailable.med=? and donors.city=?";


  dbCon.query(query,[med,city],function(err,resultTable)
  {
    //console.log(resultTable+"      "+err);
  if(err==null)
    resp.send(resultTable);
  else
    resp.send(err);
  })
})
//===========================================NodeMailer===============================================================
/*const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-gmail-email@gmail.com', // Your Gmail address
    pass: 'your-gmail-password', // Your Gmail password or application-specific password
  },
});
// Set up a route to handle the form submission via AJAX
app.post("/chk-submit", (req, res) => {
  const userEmail = req.body.kuchemail;

  // Validate the email (you can add more validation if needed)
  if (!userEmail) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  // Email options
  const mailOptions = {
    from: 'your-gmail-email@gmail.com', // Sender address (should be your Gmail address)
    to: userEmail, // Recipient address (using the email submitted in the form)
    subject: 'Welcome to our website', // Subject line
    text: 'Thank you for signing up!', // Plain text body
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
      res.status(500).json({ error: 'Error sending email.' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'Signup successful! Check your email for confirmation.' });
    }
  });
});*/


