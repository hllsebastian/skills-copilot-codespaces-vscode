// Create web server
 // ----------------

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Store comments in memory
const commentsByPostId = {};

// Handle requests to /posts/:id/comments
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// Handle requests to /posts/:id/comments
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = Math.random().toString(36).substring(2);
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;

  // Emit an event to the Event Bus
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

// Handle requests to /events
app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);
  res.send({});
});

// Start server on port 4001
app.listen(4001, () => {
  console.log('Listening on 4001');
});