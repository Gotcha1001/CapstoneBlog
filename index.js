import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid"; // Import the UUID library

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'));

app.set("view engine", "ejs");

let posts = [];

//rendering the index.ejs file
app.get("/", (req, res) => {
    res.render("index.ejs", { blogPosts: posts });
});
//////////////////////////////////////////////////////////////////////
//loading the index.html static file
app.get("/index1", (req, res) => {
    ////////////////////////////////////////////////////////////
    res.sendFile(__dirname + "/public/index.html");
});

// using BodyParser to capture the forms input as a Post
app.post("/submit", (req, res) => {
    const { title, content } = req.body;
    const newPost = { id: uuidv4(), title, content }; // Generate a unique ID for the post
    posts.push(newPost);
    res.redirect("/");
});

// Route to display the full blog post
app.get("/post/:id", (req, res) => {
    const postId = req.params.id;
    const post = posts.find(post => post.id === postId);
    if (post) {
        res.render("post.ejs", { post });
    } else {

        ////////////////////////////////////////////////////////////
        res.redirect("/");
        /////////////////////////////////////////////////
    }
});

// Server-side route for editing a post
app.get("/edit/:id", (req, res) => {
    const postId = req.params.id;
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        const post = posts[postIndex];
        res.render("edit.ejs", { post });
    } else {
        res.redirect("index.ejs");
    }
});

// Server-side route for updating a post
app.post("/edit/:id", (req, res) => {
    const postId = req.params.id;
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        posts[postIndex].title = req.body.title;
        posts[postIndex].content = req.body.content;
    }
    res.redirect(`/post/${postId}`);
});

// Server-side route for deleting a post
app.post("/delete/:id", (req, res) => {
    if (req.body._method === 'DELETE') {
        const postId = req.params.id;
        posts = posts.filter(post => post.id !== postId);
        ///////////////////////////////////////////////////////
        res.redirect("/");
        /////////////////////////////////////////////////////
    } else {
        // Handle the case where the _method is not DELETE
        res.status(400).send('Invalid request');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
});
