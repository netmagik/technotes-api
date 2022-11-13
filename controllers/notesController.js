const User = require("../models/User");
const Note = require("../models/Note");

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
  const notes = await Note.find().lean();

  // If no notes found
  if (!notes?.length) {
    return res.status(400).json({ message: "No notes found" });
  }

  // Add username to each note before sending the response
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );
  res.json(notesWithUser);
};

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = async (req, res) => {
  const { title, text, user } = req.body;

  // Confirm data
  if (!title || !text || !user) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check for Duplicate title
  // Collation checks for case insensitivity
  const duplicate = await Note.findOne({ title }).collation({
    locale: 'en', strength: 2 }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate title" });
  }

  // Create and store new note
  const noteObject = { user, title, text };
  const note = await Note.create(noteObject);

  if (note) {
    // created
    res.status(201).json({ message: `New note "${title}" created` });
  } else {
    res.status(400).json({ message: "Invalid note data received" });
  }
};

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = async (req, res) => {
  const { id, title, text, completed, user } = req.body;

  // Confirm data
  if (!id || !title || !text || !user || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Does the note exist to update?
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).collation({
    locale: 'en', strength: 2 }).lean().exec();

  // Allow updates to the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate title" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json({ message: `${updatedNote.title} updated` });
};


// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm note exists to delete
  const note = await Note.findById(id).exec();

  if (!note) {
      return res.status(400).json({ message: 'Note not found'})
  }

  const result = await note.deleteOne();

  const reply = `Note ${result.title} with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
