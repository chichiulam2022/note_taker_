const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
const publicPath = path.join(__dirname, "public");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(publicPath));

//set API
app.get("/api/notes", (req, res) => {
  const APIpath = path.join(__dirname, "/db/db.json");
  res.sendFile(APIpath);
});

//add new notes to db.json
app.post("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  const updatedNotes = req.body;
  updatedNotes.id = uuid.v4();
  notes.push(updatedNotes);
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.json(notes);
  res.json("You've successfully added a note.");
});

//delete notes
app.delete("/api/notes/:id", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  const { id } = req.params;
  const deletedNotes = notes.filter((delNote) => delNote.id !== id);
  fs.writeFileSync("./db/db.json", JSON.stringify(deletedNotes));
  res.json(deletedNotes);
});

//homepage route HTML
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// /notes route HTML
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//listen the port
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
