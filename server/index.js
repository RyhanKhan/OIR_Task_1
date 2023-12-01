import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import StudentModel from "./models/Student.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/student");

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json("Unauthorized: Token is unavailable.");
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.status(401).json("Unauthorized: Token is invalid.");
      }
      req.user = decoded;
      next();
    });
  }
};

app.get("/home", verifyUser, (req, res) => {
  return res.json("Success");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      StudentModel.create({ name, email, password: hash })
        .then((students) => res.json(students))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err.message));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  StudentModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign({ email: user.email }, "jwt-secret-key", {
            expiresIn: "1d",
          });
          res.cookie("token", token);
          res.json("Success");
        } else {
          res.json("The password is incorrect");
        }
      });
    } else {
      res.json("No record exists.");
    }
  });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
