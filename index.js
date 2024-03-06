const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const port = 5500;

app.use(bodyParser.json());


const senderEmail = "parth.burange22@gmail.com";
const senderPassword = "swoilqobbxdafhtw";

const fixedRecipientEmail = "202201202@vupune.ac.in"; 
 app.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: '3306'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});




const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});



app.post("/send-email", (req, res) => {
  

  console.log(req.body.recipientEmail);
  const recipientEmail = req.body?.recipientEmail ? req.body.recipientEmail :fixedRecipientEmail ;
  const sixDigitRandomNumber = Math.floor(100000 + Math.random() * 900000)

  const mailOptions = {
    from: senderEmail,
    to: recipientEmail,
    subject: "Your One-Time Password (OTP) for Login",

    text: "Hello,Thank you for using the Nobel Hospital Login Portal.Your one time password (OTP) is "+  sixDigitRandomNumber +".Please use this OTP to complete the login process.Do not share this OTP with anyone for security reasons.If you did not attempt to log in your email is being used without your knowledge contact the admin as soon as possible ",
  };
  db.query('INSERT INTO message.otps (email, otp) VALUES (?, ?)', [recipientEmail , sixDigitRandomNumber], (err, result) => {
      if (err) throw err;
      console.log('OTP sent and stored in the database');
      res.status(200).send('OTP sent successfully');
  });


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error:", error);
      res.json({ success: false, message: "Error sending email." });
    } else {
      console.log("Email sent:", info.response);
      res.json({ success: true, message: "Email sent successfully." });
    }
  });
});


app.use(express.static(__dirname));

app.listen(port, () => {
  console.log("Server is running at http://localhost:${port}");
});