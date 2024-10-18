import React, { useState, useEffect } from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const userToDelete = characters[index];

    fetch(`http://localhost:8000/users/${userToDelete._id}`, { // Use _id here
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 204) {
          const updated = characters.filter((_, i) => i !== index);
          setCharacters(updated);
        }
        else if (response.status === 404) {
          console.log("User not found.");
        }
        else {
          console.log("Failed to delete user. Status:", response.status);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  function updateList(person) { 
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          console.log("Failed to insert user. Status:", response.status);
          return null;
        }
      })
      .then((data) => {
        if (data) {
          setCharacters([...characters, { ...data.user, _id: data.user._id }]); // Ensure _id is used here
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      })
  }

  function fetchUsers() {
    return fetch("http://localhost:8000/users");
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"].map(user => ({ ...user, _id: user._id })))) // Make sure _id is mapped correctly
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
