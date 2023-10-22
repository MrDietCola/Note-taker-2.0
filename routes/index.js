// connecting to exress
const express = require('express');
// creating route for notes
const notesRouter = require('./notes');
const app = express();

app.use('/notes', notesRouter);

// initializing router
module.exports = app;