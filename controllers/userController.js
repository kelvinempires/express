import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OTPgenerator } from "../lib/OTPgenerator.js";
import nodemailer from "nodemailer";
dotenv.config();

//creating a user
export const CreateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const exitingUser = await User.findOne({ username });
    if (exitingUser) {
      return res.status(400).send("user already exists");
    }
    const user = new User(req.body);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();
    res.status(201).send("User created");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

//fetching all users
export const GetAllUsers = async (req, res) => {
  try {
    const getAllUser = await User.find({}, { password: 0 });
    res.status(200).send(getAllUser);
  } catch {
    res.status(500).send({ message: "err User not found" });
  }
};

//finding a particular user using it'S Id
export const findById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.massage });
  }
};

// user login requirement
export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(401).send("please provide username and password");
    }
    const user = await User.findOne({ username });
    if (!user) return res.status(401).send("username dose not exist");
    const isCorrectPassword = bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(401).send("invalid password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ massage: "login successful", token });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Changing or updating a user name
export const upDateUsernameById = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUsername } = req.body;
    const user = await User.findByIdAndUpdate(id, { username: newUsername });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.status(200).send("user name updated successfully");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updatePasswordById = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, oldPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).send("Both old and new passwords are required.");
    }
    if (newPassword === oldPassword) {
      return res
        .status(400)
        .send("new password can not be the same as old password");
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    const isMatch = bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid old password.");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send("password updated successfully");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }); //check if user exit
    if (!user) return res.status(404).send("user not found"); //Returns 404 if user not found
    //Remove ObjectId wrapper from user._id
    const userId = user._id
      .toString()
      .replace(/^new ObjectId\("(.+)"\)$/, "$1");
    //generate otp
    let otp = await OTPgenerator(userId); //generate OTP
    //send"s otp to users email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "kelvinewurum@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    const mailOptions = {
      from: "kelvinewurum@gmail",
      to: email,
      subject: "Your One-Time Password (OTP) Code",
      html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            padding: 40px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 20px auto;
          }
          .header {
            text-align: center;
            color: #333333;
          }
          .otp {
            font-size: 30px;
            font-weight: bold;
            color: #3498db;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            text-align: center;
            color: #7f8c8d;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background-color: #3498db;
            color: #ffffff;
            padding: 12px 30px;
            font-size: 16px;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #2980b9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to Our Platform!</h2>
          </div>
          <p>Hello,</p>
          <p>We received a request to verify your identity. Please use the following One-Time Password (OTP) to proceed:</p>
          <div class="otp">
            ${otp}
          </div>
          <p>This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.</p>
          <a href="#" class="button">Verify Now</a>
          <div class="footer">
            <p>Thank you for using our service.</p>
            <p>If you have any questions, feel free to contact us.</p>
          </div>
        </div>
      </body>
   </html>
`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        res.status(500).send(error.message);
      } else {
        console.log("Email sent: ", info.response);
        res.status(200).send("OTP sent successfully");
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const login_otp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) res.status(400).send("please provide email and otp");

    const user = await User.findOne({ email });
    if (!user) res.status(404).send("user not found");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ massage: "login successful", token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Changing or updating a user name
// export const upDateUsernameById= async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res.status(400).send("Previous Username and password are required.");}
//     const user = await User.findByIdAndUpdate(req.params.id,{ username: username },{ new: true, runValidators: true }
//     );
//     if (!user) {return res.status(404).send("User not found.");}
//     res.status(200).send(user);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

// Changing or updating user password
// export const upDateUserPassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     if (!oldPassword || !newPassword) {
//       return res.status(400).send("Both old and new passwords are required.");
//     }
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send("User not found.");
//     }
//     const isMatch = bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).send("Invalid old password.");
//     }
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();
//     res.status(200).send("Password updated successfully.");
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };
