const path = require("path");
const express = require("express");
const transporter = require("./config");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require('cors');
const corsOptions ={
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const buildPath = path.join(__dirname, "..", "build");
app.use(express.json());
app.use(express.static(buildPath));

app.post("/send", (req, res) => {
  try {
    const mailOptions = {
      from: req.body.email, // sender address
      to: process.env.email, // list of receivers
      html: `
      <p>You have a new contact request.</p>
      <h3>Contact Details</h3>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Message: ${req.body.message}</li>
      </ul>
      `,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      console.log("error " + err);
      if (err) {
        res.status(500).send({
          success: false,
          message: "Something went wrong. Try again later",
        });
      } else {
        res.send({
          success: true,
          message:
            "Thank you for contacting me. I will get back to you shortly",
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong. Try again later",
    });
  }
});
/*app.get("*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "..", "build", "index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});*/

app.listen(3000, () => {
  console.log("server start on port 3000");
});
