const express = require("express");
const shortid = require("shortid");

const server = express();

server.use(express.json());

const port = 9000;

let users = [
    {
    id: 1,
    name: "Jane", 
    bio: "Hi I'm Jane"
    },
    {
    id: shortid.generate(),
    name: "Bob", 
    bio: "Hi I'm Bob"
    },
    {
    id: shortid.generate(),
    name: "Jack", 
    bio: "Hi I'm Jack"
    }
]

server.get("/api/users", (req, res) => {
    if (!req) {
        res.status(500).json({ errorMessage: "The users information could not be retrieved."});
    }
    res.status(200).send(users);
});

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const user = users.find(u => u.id == id);

    if (!id) {
        return res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }
    if (!user) {
        return res.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
    }

    res.status(200).send(user);
})

server.post("/api/users", (req, res) => {
    const user = req.body;

    if (!user.name || !user.bio) {
        return res.status(400).json({ errorMessage: "Please provide name and bio for user." });

    }
    if (users.find(u => u.name === user.name)) {
        return res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
    } 
    
    const newUser = {id: shortid.generate(), name: user.name, bio: user.bio }
    users.push(newUser);
    res.status(200).send(newUser);
    
});

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const user = users.find(u => u.id == id);

    if (!user) {
        return res.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
    }

    users = users.filter(user => user.id !== Number(id));

    res.status(200).send(users);
});

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const user = users.find(u => u.id == id);
    const newUser = req.body;

    if (!user) {
        return res.status(400).json({ errorMessage: "The user with the specified ID does not exist." });
    }

    if(!newUser.name || !newUser.bio) {
        return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }

    user.name = newUser.name;
    user.bio = newUser.bio;

    if( user.name !== newUser.name || user.bio !== newUser.bio) {
        return res.status(500).json({ errorMessage: "The user information could not be modified." })
    }

    res.status(200).send(user);
})

server.listen(port, () => console.log(`Server running on port ${port}`));