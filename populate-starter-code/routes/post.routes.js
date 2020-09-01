const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const Post = require('../models/Post.model');

// ****************************************************************************************
// GET route to display the form to create a new post
// ****************************************************************************************

// localhost:3000/post-create
router.get('/post-create', (req, res) => {
  User.find()
    .then(dbUsers => {
      res.render('posts/create', { dbUsers });
    })
    .catch(err => console.log(`Err while displaying post input page: ${err}`));
});

// ****************************************************************************************
// POST route to submit the form to create a post
// ****************************************************************************************

// <form action="/post-create" method="POST">
router.post('/post-create', (req, res) => {
  const { title, content, author } = req.body;
  // 'author' represents the ID of the user document
  Post.create({ title, content, author })
    .then(dbPost => {
      // when the new post is created, the user needs to be found and its posts updated with the
      // ID of newly created post
      return User.findByIdAndUpdate(author, { $push: { posts: dbPost._id } });
    })
    .then(() => res.redirect('/posts')) // if everything is fine, redirect to list of posts
    .catch(err => console.log(`Err while creating the post in the DB: ${err}`));
});


// ... your code here

// ****************************************************************************************
// GET route to display all the posts
// ****************************************************************************************
router.get('/posts', (req, res) => {
  Post.find()
    .populate('author') // --> we are saying: give me whole user object with this ID (author represents an ID in our case)
    .then(dbPosts => {
      console.log(dbPosts);
      res.render('posts/list', { posts: dbPosts });
    })
    .catch(err => console.log(`Err while getting the posts from the DB: ${err}`));
});
// ... your code here

// ****************************************************************************************
// GET route for displaying the post details page
// shows how to deep populate (populate the populated field)
// ****************************************************************************************

// ... your code here

module.exports = router;
