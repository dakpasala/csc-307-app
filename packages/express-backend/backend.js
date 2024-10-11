// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
    {
      id: "qwe123",
      job: "Zookeeper",
      name: "Cindy",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

//id generator function

const generateRandomId = () => {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userToAdd.id = generateRandomId();

  const addedUser = addUser(userToAdd);
  
  res.status(201).json({
    message: "User created successfully",
    user: addedUser,
  })
});

const deleteUserById = (id) => {
  const userIndex = users["users_list"].findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return null;
  }
  users["users_list"].splice(userIndex, 1);
  return id;
};

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const deletedUserId = deleteUserById(id);

  if (deletedUserId === null) {
    return res.status(404).send("User not found.");
  }

  res.status(204).send();
});

const findUsersByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) =>
      (name ? user.name === name : true) && (job ? user.job === job : true)
  );
};

app.get("/users/search", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  const matchedUsers = findUsersByNameAndJob(name, job);
  res.send({ users_list: matchedUsers });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
