const note = {
    ID: "",
    content: "",    // content object
    reminder: "", // reminder object
    folder: "", // folder object
}

const noteData = {
    ID: "",
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
        // create completed note array
        // get note data
        // construct note
        // append to array
        // return array of elements
    },

    // get all note data associated with a userID
    getNoteData : function(userID) {
        // create note data array
        // get note data
        // append to array
        // return array
    },

    // construct note from note data
    constructNote : function(noteData) {
        // create blank note frame
        // get from reminderDB with remnider id
        // get from folderDB with folder id
        // get from contentDB with folder id
        // append queried data to note frame
        // return note
    },

    // checks if a note exists
    noteExists : function (noteID) {
        // query DB for note ID
        // return true or false
    },

    // creates a new note
    createNote : function(content, folder, reminder) {
        // store reminder with reminderDB, return ID
        // store folder with folderDB, return ID
        // store content with contentDB, return ID
        // create new note data with returned IDs
        // return note ID
    },

    // creates note data in the DB
    createNoteData: function(contentID, folderID, reminderID) {
        // access noteDB and append information
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