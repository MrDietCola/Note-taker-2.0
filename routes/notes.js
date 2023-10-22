// importing files
const notes = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// function for handling get requests
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);

// reads db.json file and returns the that information to client
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// handles post request 
notes.post('/', (req, res) => {
  console.info(`${req.method} request received to submit notes`);
// set variable to the body of the request
  const note = req.body;

  if (req.body) {
    const newNote = {
      title: note.title,
      text: note.text,
      id: uuidv4()
    }
// reads db.json file and then appends the new note to the file
    readAndAppend(newNote, './db/db.json');
    
    const response = {
      status: 'success',
      body: newNote,
    };
// returns a response to the client
    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});

// handles delete request
notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);

  const noteToDelete = req.params.id;
  // reads db.json file and then check if any of the existing notes id match the id to be deleted, if it does, splice that part of the array and return the array
  readFromFile('./db/db.json').then((data) => {
    const notesData = JSON.parse(data);
    for (let i = 0; i < notesData.length; i++) {
      const noteId = notesData[i].id;
      if (noteId === noteToDelete) {
        notesData.splice(i, 1)
      }
    } 

    const response = {
      status: 'success',
      body: notesData,
    };
// write new array to db.json and then return a respons to client
    writeToFile('./db/db.json', notesData)
    res.json(response);
  })
});

module.exports = notes;