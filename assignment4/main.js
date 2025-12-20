const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// 1
app.post('/user', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json') || '[]');
    if (users.find(u => u.email === req.body.email)) {
        return res.json({ message: "Email already exists." });
    }
    users.push({ id: Date.now(), ...req.body });
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.json({ message: "User added successfully." });
});

// 2
app.patch('/user/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.json({ message: "User ID not found." });
    Object.assign(user, req.body);
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.json({ message: "User updated successfully." });
});

// 3
app.delete('/user/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json'));
    const newUsers = users.filter(u => u.id != req.params.id);
    if (users.length === newUsers.length) {
        return res.json({ message: "User ID not found." });
    }
    fs.writeFileSync('users.json', JSON.stringify(newUsers));
    res.json({ message: "User deleted successfully." });
});
app.get('/user/getByName', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json') || '[]');
    
    const name = req.query.name;
    
    const user = users.find(u => u.name === name);
    
    if (!user) {
        return res.json({ message: "User name not found." });
    }
    
    res.json(user);
});

// 5
app.get('/user', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json') || '[]');
    res.json(users);
});

// 6
app.get('/user/filter', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json') || '[]');
    const minAge = parseInt(req.query.minAge);
    
    if (!minAge) {
        return res.json(users);
    }
    const filteredUsers = users.filter(u => u.age >= minAge);
    
    res.json(filteredUsers);
});
// 7
app.get('/user/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json') || '[]');
    const user = users.find(u => u.id == req.params.id);
    
    if (!user) {
        return res.json({ message: "User ID not found." });
    }
    
    res.json(user);
});

app.listen(3000, () => console.log('Server running'));