// create new web server
const express = require('express');
const app = express();
// create new database connection
const db = require('./database.js');
// create new web server
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// create new web server
const HTTP_PORT = 8000;
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});
// create new web server
// Root path
app.get("/", (req, res, next) => {
    res.json({"message": "Ok"});
});
// create new web server
// GET
app.get("/api/comments", (req, res, next) => {
    const sql = "select * from comments";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});
// create new web server
// GET
app.get("/api/comments/:id", (req, res, next) => {
    const sql = "select * from comments where rowid = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});
// create new web server
// POST
app.post("/api/comments/", (req, res, next) => {
    const errors = [];
    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (!req.body.comment) {
        errors.push("No comment specified");
    }
    if (errors.length) {
        res.status(400).json({"error": errors.join(",")});
        return;
    }
    const data = {
        email: req.body.email,
        comment: req.body.comment
    };
    const sql = 'INSERT INTO comments (email, comment) VALUES (?,?)';
    const params = [data.email, data.comment];
    db.run(sql, params, function (err, result) {
        if (err) {
            res