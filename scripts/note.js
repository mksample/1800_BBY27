// A complete note
class note {
    constructor(innerHTML) {
        this.innerHTML = innerHTML;
    }
}

// Class for organizing new note input and writing to the DB.
class noteInputData {
    constructor(userID, contentData, reminderData, folderData) {
        this.userID = userID;
        this.contentData = contentData;
        this.reminderData = reminderData;
        this.folderData = folderData;
    }
}

// Class representing how note data is stored
class noteData {
    constructor(userID, contentID, reminderID, folderID) {
       this.userID = userID;
       this.contentID = contentID;
       this.reminderID = reminderID;
       this.folderID = folderID;
    }
}

// Represents the note database. Takes a contentDB, reminderDB, and folderDB to create.
class noteDB {

    collection = "notes"

    constructor(contentDB, reminderDB, folderDB) {
        this.contentDB = contentDB;
        this.reminderDB = reminderDB;
        this.folderDB = folderDB;
    }

    // Converts content data into a normal object which can be stored.
    converter = {
        toFirestore: function(data) { // Converts to firestore data format when writing
            return {
                userID: data.userID,
                contentID: data.contentID,
                reminderID: data.reminderID,
                folderID: data.folderID
                };
        },
        fromFirestore: function(snapshot, options){ // Converts from firestore data format when reading
            const data = snapshot.data(options);
            return new noteData(data.userID, data.contentID, data.reminderID, data.folderID);
        }
    }

    // UNFINISHED, Gets all note HTML elements with a userID.
    getNotes(userID) {
       
       var noteDatas = this.getUserNotesData(userID);
       // construct notes with note data
       // return notes
    }

    // UNFINISHED, Turns note data into an HTML element.
    async constructNote(noteData) {
        var content = await this.contentDB.getContent(noteData.contentID);
        // create html with content, reminder, and folder html
        
        return new note()
    }

    // Gets note data for a single note.
    async getNoteData(noteID) {
        var docRef = db.collection(this.collection).doc(noteID)
        var noteData = docRef.withConverter(this.converter).get().then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                console.log("No such document!");
            }
        })

        return noteData;
    }

    // Gets all note datas with the same userID.
    async getUserNotesData(userID) {
        var citiesRef = db.collection(this.collection);
        var query = citiesRef.withConverter(this.converter).where("userID", "==", userID);

        var noteDatas = query.get().then((querySnapshot) => {
            return querySnapshot
        })

        return noteDatas
    }

    // Creates a whole note.
    async createNote(noteInputData) {
        var contentID = await this.contentDB.setContent(noteInputData.contentData);
        var reminderID = await this.reminderDB.setReminder(noteInputData.reminderData);
        var folderID = await this.folderDB.setFolder(noteInputData.folderData);

        var noteID = await this.setNoteData(new noteData(noteInputData.userID, contentID, reminderID, folderID));
        return noteID;
    }

    // Writes note data.
    async setNoteData(noteData) {
        var docRef = db.collection(this.collection);
        var id = docRef.withConverter(this.converter).add(noteData).then(doc => {
            return doc.id;
        })

        return id;
    }

    // Updates a whole note.
    async updateNote(noteID, noteInputData) {
        var noteRef = await this.getNoteData(noteID);
        if (noteInputData.contentData) {
            await this.contentDB.updateContent(noteRef.contentID, noteInputData.contentData);
        } 
        if (noteInputData.reminderData) {
            await this.reminderDB.updateContent(noteRef.reminderID, noteRef.reminderData);
        } 
        if (noteInputData.folderData) {
            await this.contentDB.updateContent(noteRef.folderID, noteInputData.folderData);
        }
    }

    // Deletes a whole note.
    async deleteNote(noteID) {
        var noteRef = await this.getNoteData(noteID);
        
        await this.contentDB.deleteContent(noteRef.contentID)
        await this.reminderDB.deleteReminder(noteRef.reminderID)
        await this.folderDB.deleteFolder(noteRef.folderDB)

        await this.deleteNoteData(noteID)
    }

    // Deletes a notes data.
    async deleteNoteData(noteID) {
        var noteDataRef = db.collection(this.collection).doc(noteID);
        return noteDataRef.delete();
    }

    // Tests notes db by creating two notes, getting them based on userID, printing them, and deleting them.
    async testfunc(d1, d2) {
        var id1 = await this.createNote(d1); // create note 1
        var id2 = await this.createNote(d2); // create note 2
        var noteDatas = await this.getUserNotesData("testUserID"); // get note datas
        noteDatas.forEach((noteData) => {
            console.log(noteData.data()); // print each note data
        })
        await this.deleteNote(id1); // delete note 1
        await this.deleteNote(id2); // delete note 2
    }
}

// Create a noteDatabase var for use outside the script.
var noteDatabase = new noteDB(contentDatabase, reminderDatabase, folderDatabase);
