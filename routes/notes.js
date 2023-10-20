const notes = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
  console.info(`${req.method} request received to submit notes`);

  const note = req.body;

  if (req.body) {
    const newNote = {
      title: note.title,
      text: note.text,
      id: uuidv4()
    }

    console.log(note);

    readAndAppend(newNote, './db/db.json');
    
    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});

notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);

  const noteToDelete = req.params.id;
  
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

    writeToFile('./db/db.json', notesData)
    res.json(response);
  })
});

module.exports = notes;