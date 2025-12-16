const http = require("node:http");
const fs = require("fs");
const path = require("path");
const url = require("url");
let port = 3000;

const USERS_FILE = path.join(__dirname, 'users.json');

// Ensure users.json file exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Helper function to read users from file
const readUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading users file:', err);
        return [];
    }
};

// Helper function to write users to file
const writeUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing users file:', err);
        return false;
    }
};

const httpServer = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;
    const method = req.method;

    console.log(`[${method}] ${pathname}`);

    // 1. GET / - Home
    if (method === "GET" && pathname === "/") {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write("<h1>Welcome to User API</h1>");
        res.write("<p>Available endpoints:</p>");
        res.write("<ul>");
        res.write("<li>GET /user - Get all users</li>");
        res.write("<li>GET /user/:id - Get user by ID</li>");
        res.write("<li>POST /user - Create new user</li>");
        res.write("<li>PATCH /user/:id - Update user</li>");
        res.write("<li>DELETE /user/:id - Delete user</li>");
        res.write("</ul>");
        res.end();
    }
    
    // 2. GET /user - Get all users (API #4)
    else if (method === "GET" && pathname === "/user") {
        const users = readUsers();
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(users));
    }
    
    // 3. GET /user/:id - Get user by ID (API #5)
    else if (method === "GET" && pathname.startsWith("/user/")) {
        const id = parseInt(pathname.split('/')[2]);
        
        if (isNaN(id)) {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid user ID." }));
            return;
        }
        
        const users = readUsers();
        const user = users.find(u => u.id === id);
        
        if (!user) {
            res.writeHead(404, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ message: "User not found." }));
        } else {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(user));
        }
    }
    
    // 4. POST /user - Create new user (API #1 from previous)
    else if (method === "POST" && pathname === "/user") {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                const { name, age, email } = userData;
                
                if (!name || !age || !email) {
                    res.writeHead(400, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ 
                        message: "All fields (name, age, email) are required." 
                    }));
                    return;
                }
                
                const users = readUsers();
                
                const emailExists = users.some(user => user.email === email);
                if (emailExists) {
                    res.writeHead(409, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ 
                        message: "Email already exists." 
                    }));
                    return;
                }
                
                const newUser = {
                    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                    name,
                    age: Number(age),
                    email
                };
                
                users.push(newUser);
                const writeSuccess = writeUsers(users);
                
                if (writeSuccess) {
                    res.writeHead(201, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ 
                        message: "User added successfully." 
                    }));
                } else {
                    res.writeHead(500, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ 
                        message: "Error saving user data." 
                    }));
                }
                
            } catch (error) {
                console.error('Error processing request:', error);
                res.writeHead(400, { 'content-type': 'application/json' });
                res.end(JSON.stringify({ 
                    message: "Invalid JSON data." 
                }));
            }
        });
    }
    
    // 5. PATCH /user/:id - Update user (API #2)
    else if (method === "PATCH" && pathname.startsWith("/user/")) {
        let body = '';
        const id = parseInt(pathname.split('/')[2]);
        
        if (isNaN(id)) {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid user ID." }));
            return;
        }
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const updateData = JSON.parse(body);
                const { name, age, email } = updateData;
                
                // Validate at least one field is provided
                if (!name && !age && !email) {
                    res.writeHead(400, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ 
                        message: "At least one field (name, age, email) must be provided." 
                    }));
                    return;
                }
                
                // Check if email is being updated to an existing email
                if (email) {
                    const users = readUsers();
                    const otherUserWithEmail = users.find(u => u.email === email && u.id !== id);
                    if (otherUserWithEmail) {
                        res.writeHead(409, { 'content-type': 'application/json' });
                        res.end(JSON.stringify({ 
                            message: "Email already exists for another user." 
                        }));
                        return;
                    }
                }
                
                // Update the user
                let users = readUsers();
                const userIndex = users.findIndex(u => u.id === id);
                
                if (userIndex === -1) {
                    res.writeHead(404, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ message: "User ID not found." }));
                    return;
                }
                
                // Update only provided fields
                if (name) users[userIndex].name = name;
                if (age) users[userIndex].age = Number(age);
                if (email) users[userIndex].email = email;
                
                // Determine which field was updated for response message
                let updatedField = "information";
                if (name && !age && !email) updatedField = "name";
                if (age && !name && !email) updatedField = "age";
                if (email && !name && !age) updatedField = "email";
                
                const writeSuccess = writeUsers(users);
                
                if (writeSuccess) {
                    res.writeHead(200, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ 
                        message: `User ${updatedField} updated successfully.` 
                    }));
                } else {
                    res.writeHead(500, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ 
                        message: "Error updating user data." 
                    }));
                }
                
            } catch (error) {
                console.error('Error processing request:', error);
                res.writeHead(400, { 'content-type': 'application/json' });
                res.end(JSON.stringify({ 
                    message: "Invalid JSON data." 
                }));
            }
        });
    }
    
    // 6. DELETE /user/:id - Delete user (API #3)
    else if (method === "DELETE" && pathname.startsWith("/user/")) {
        const id = parseInt(pathname.split('/')[2]);
        
        if (isNaN(id)) {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid user ID." }));
            return;
        }
        
        let users = readUsers();
        const initialLength = users.length;
        
        users = users.filter(u => u.id !== id);
        
        if (users.length === initialLength) {
            res.writeHead(404, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ message: "User ID not found." }));
            return;
        }
        
        const writeSuccess = writeUsers(users);
        
        if (writeSuccess) {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ 
                message: "User deleted successfully." 
            }));
        } else {
            res.writeHead(500, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ 
                message: "Error deleting user." 
            }));
        }
    }
    
    // 7. POST /signup (existing from your code)
    else if (method === "POST" && pathname === "/signup") {
        res.writeHead(201, { 'content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "done"
        }));
    }
    
    // 8. 404 for all other routes
    else {
        res.writeHead(404, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ 
            message: "Endpoint not found. Available endpoints: GET /, GET /user, GET /user/:id, POST /user, PATCH /user/:id, DELETE /user/:id" 
        }));
    }
});

function listen() {
    return httpServer.listen(port, 'localhost', () => {
        console.log(`Server is running on http://localhost:${port}`);
        console.log(`Users file: ${USERS_FILE}`);
    });
}

listen();

httpServer.on("error", (error) => {
    console.log(error);

    if (error.code === "EADDRINUSE") {
        ++port;
        listen();
    } else {
        httpServer.close();
    }
});

httpServer.on("close", () => {
    console.log(`Server is offline`);
});