import express from "express";
import cors from "cors";
import emailExtract from "./src/Router/emailExtract.routes.js";
import {join} from 'path';


const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb',extended: true }));


// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views","./src/views");

const PORT = 5000;

// Root route for the API
app.get("/", (req, res, next) => {
    res.send(`<center><h1>Extract Email server is up and running</h1></center>`);
});



// Route for email extraction
app.use("/api/v1/", emailExtract);

// Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 400, from = "Root of project", message = "Something went wrong" } = err;
    res.status(statusCode).json({ statusCode, from, message });
});

// Server setup
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/api/v1`);
});
