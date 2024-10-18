import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Specify the correct env file path
dotenv.config({ path: './.env' });

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const { name, job } = req.query;

  userService
    .getUsers(name, job) 
    .then((users) => {
      res.json({ users_list: users });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving users", error: err });
    });
});

app.get("/users/search", (req, res) => {
  const { name, job } = req.query;

  userService
    .getUsers(name, job) 
    .then((matchedUsers) => {
      res.json({ users_list: matchedUsers });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error searching users", error: err });
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .findUserById(id) 
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found.");
      }
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving user", error: err });
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService
    .addUser(userToAdd)
    .then((addedUser) => {
      res.status(201).json({
        message: "User created successfully",
        user: addedUser,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error adding user", error: err });
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .deleteUserById(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).send("User not found.");
      }
      res.status(204).send(); // 204 No Content on successful deletion
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting user", error: err });
    });
});



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
