const note = {
    ID: "",
    innerHTML: "",
}

const noteData = {
    content: "",
    reminder: "",
    folder: "",
}

const noteRef = {
    selfID: "",
    userID: "",
    contentID: "",
    folderID: "",
    reminderID: "",
}

const noteDB = {
    colleciton = "notes",

    // DO WE NEED THESE, COULD BE REFERENCED GLOBALLY??
    reminderDB: "", // reminderDB object
    folderDB: "",   // folderDB object
    contentDB: "",  // contentDB object

    // get all notes associated with a user
    getNotes : function(userID) {
       // get note refs
       // construct note data with ref
       // construct notes with note data
       // return notes
    },

    constructNote : function(noteData) {
        // get note skeleton
        // add reminder data
        // add folder data
        // add content data
        // return note
    },

    constructNoteData : function(noteRef) {
        // create blank noteData obj
        // get reminder data from ref
        // get content data from ref
        // get folder data from ref
        // append data to noteData
        // return noteData
    },

    getNoteRefs : function(userID) {
        // create array
        // get notes for a user
        // append to array
        // return array
    },

    createNote : function(noteData) {
        // disassemble note data
        // create reminder data
        // create folder data
        // create content data
        // create note reference with IDs
        // return null
    },

    createNoteRef : function(userID, contentID, reminderID, folderID) {
        // add IDs to noteDB with a unique ID
        // return note ID
    },

    updateNote : function(noteID) {
        // retrieve note data
        // access reminderDB, folderDB, or contentDB with note ID (depending on what's being updated)
        // update content
        // return null
    },

    deleteNote : function(noteID) {
        // delete reminder from reminderDB
        // delete folder from folderDB
        // delte content from contentDB
        // delete note data
        // return null
    },

    deleteNoteData : function(noteID) {
        // delete data from note DB
        // return null
    }
}