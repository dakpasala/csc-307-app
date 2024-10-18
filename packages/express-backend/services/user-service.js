import mongoose from "mongoose";
import userModel from "../models/user.js";

mongoose.set("debug", true);

function getUsers(name, job) {
    let query = {}; 
  
    if (name) {
      query.name = name;
    }
    if (job) {
      query.job = job;
    }
  
    return userModel.find(query);
  }

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function deleteUserById(id) {
    return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUserById
};