const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const ADMIN = {
    username: "admin",
    password: "smartcity123"
};

let complaints = [];

// DEFAULT ROUTE → LOGIN PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

// LOGIN API
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN.username && password === ADMIN.password) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// GET COMPLAINTS
app.get("/api/complaints", (req, res) => {
    res.json(complaints);
});

// ADD COMPLAINT
app.post("/api/complaints", (req, res) => {
    complaints.push({ text: req.body.text, status: "Pending" });
    res.json({ success: true });
});

// UPDATE STATUS
app.put("/api/complaints/:id", (req, res) => {
    const id = req.params.id;

    if (complaints[id]) {
        if (complaints[id].status === "Pending")
            complaints[id].status = "In Progress";
        else if (complaints[id].status === "In Progress")
            complaints[id].status = "Resolved";
    }

    res.json({ success: true });
});

app.listen(3000, () => {
    console.log("Smart City running at http://localhost:3000");
});