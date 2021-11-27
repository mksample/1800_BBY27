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
    constructor(userID, contentID, reminderID, folderID, timestamp, id) {
        this.userID = userID;
        this.contentID = contentID;
        this.reminderID = reminderID;
        this.folderID = folderID;
        this.timestamp = timestamp;
        this.id = id;
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
        toFirestore: function (data) { // Converts to firestore data format when writing
            return {
                userID: data.userID,
                contentID: data.contentID,
                reminderID: data.reminderID,
                folderID: data.folderID,
                timestamp: data.timestamp
            };
        },
        fromFirestore: function (snapshot, options) { // Converts from firestore data format when reading
            const data = snapshot.data(options);
            return new noteData(data.userID, data.contentID, data.reminderID, data.folderID, data.timestamp, snapshot.id);
        }
    }

    // gets all notes and runs a callback for each note
    async getNotes(userID, callback) {
        let noteSnapshots = await this.getUserNotesData(userID);

        let noteDatas = [];
        noteSnapshots.forEach((noteSnap) => {
            noteDatas.push(noteSnap.data());
        });

        for (let noteData of noteDatas) {
            let note = await this.constructNote(noteData);
            callback(note);
        }
    }

    // gets a note with a noteID. 
    async getNote(noteID) {
        let noteData = await this.getNoteData(noteID);
        let note = this.constructNote(noteData);
        return note;
    }

    // constructs a note HTML element from content and reminder HTML elements.
    async constructNote(noteData) {
        // Get note from template
        let NoteTemplate = document.getElementById("NoteTemplate");
        let note = NoteTemplate.content.cloneNode(true);

        // Insert content into note
        let content = await this.contentDB.getContent(noteData.contentID);
        let blankContent = note.querySelector(".noteContent");
        blankContent.parentNode.replaceChild(content, blankContent)

        // Insert reminder into note
        let reminder = await this.reminderDB.getReminder(noteData.reminderID);
        let blankReminder = note.querySelector(".noteReminder");
        blankReminder.parentNode.replaceChild(reminder, blankReminder);

        // Set element ID
        note.querySelector('.note').setAttribute("id", noteData.id);
        
        return note
    }

    // Gets note data for a single note.
    async getNoteData(noteID) {
        let docRef = db.collection(this.collection).doc(noteID)
        let noteData = docRef.withConverter(this.converter).get().then(doc => {
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
        let citiesRef = db.collection(this.collection);
        let query = citiesRef.withConverter(this.converter).where("userID", "==", userID);

        let noteDatas = query.get().then((querySnapshot) => {
            return querySnapshot
        })

        return noteDatas
    }

    // Creates a whole note.
    async createNote(noteInputData) {
        let contentID = await this.contentDB.createContent(noteInputData.contentData);
        let reminderID = await this.reminderDB.createReminder(noteInputData.reminderData);
        let folderID = await this.folderDB.createFolder(noteInputData.folderData);

        let noteID = await this.createNoteData(new noteData(noteInputData.userID, contentID, reminderID, folderID, firebase.firestore.Timestamp.now()));
        return noteID;
    }

    // Writes note data.
    async createNoteData(noteData) {
        let docRef = db.collection(this.collection);
        let id = docRef.withConverter(this.converter).add(noteData).then(doc => {
            return doc.id;
        })

        return id;
    }

    // Updates a whole note.
    async updateNote(noteID, noteInputData) {
        let noteRef = await this.getNoteData(noteID);
        if (noteInputData.contentData) {
            await this.contentDB.updateContent(noteRef.contentID, noteInputData.contentData);
        }
        if (noteInputData.reminderData) {
            await this.reminderDB.updateReminder(noteRef.reminderID, noteInputData.reminderData);
        }
        if (noteInputData.folderData) {
            await this.folderDB.updateFolder(noteRef.folderID, noteInputData.folderData);
        }
    }

    // Deletes a whole note.
    async deleteNote(noteID) {
        let noteRef = await this.getNoteData(noteID);

        await this.contentDB.deleteContent(noteRef.contentID)
        await this.reminderDB.deleteReminder(noteRef.reminderID)
        await this.folderDB.deleteFolder(noteRef.folderID)

        await this.deleteNoteData(noteID)
    }

    // Deletes a notes data.
    async deleteNoteData(noteID) {
        let noteDataRef = db.collection(this.collection).doc(noteID);
        return noteDataRef.delete();
    }

    // Tests notes db by creating two notes, getting them based on userID, printing them, and deleting them.
    async testfunc() {
        // Create new note
        let id = await this.createNote(
            new noteInputData("user1",
                new contentData("note title", "note body", "note template", firebase.firestore.Timestamp.now()),
                new reminderData("reminder date", firebase.firestore.Timestamp.now()),
                new folderData("folder name", firebase.firestore.Timestamp.now()),
            )
        );

        // Get note data (userID, contentID, reminderID, folderID, timestamp)
        let nd = await this.getNoteData(id);
        console.log("Note data:");
        console.log(nd);

        // Get content data (title, body, template)
        let c = await this.contentDB.getContentData(nd.contentID);
        console.log("Content data:");
        console.log(c);

        // Update content title, template and timestamp
        await this.contentDB.updateContent(nd.contentID,
            new contentData("note title 2", null, "note template 2", firebase.firestore.Timestamp.now()),
        );
        let c2 = await this.contentDB.getContentData(nd.contentID);
        console.log("Updated content data:");
        console.log(c2);

        // Get reminder data (date, timestamp)
        let r = await this.reminderDB.getReminderData(nd.reminderID);
        console.log("Reminder data:");
        console.log(r);

        // Update reminder date
        await this.reminderDB.updateReminder(nd.reminderID,
            new reminderData("reminder date 2", null),
        );
        let r2 = await this.reminderDB.getReminderData(nd.reminderID);
        console.log("Updated reminder data:");
        console.log(r2);

        // Get folder data (name, timestamp)
        let f = await this.folderDB.getFolderData(nd.folderID);
        console.log("Folder data:");
        console.log(f);

        // Update folder name
        await this.folderDB.updateFolder(nd.folderID,
            new folderData("folder name 2", null),
        );
        let f2 = await this.folderDB.getFolderData(nd.folderID);
        console.log("Updated folder data:");
        console.log(f2);

        // Delete note (will also remove entries from contentDB, reminderDB, and folderDB)
        await this.deleteNote(id);
        console.log("Deleted note data, content data, reminder data and folder data");

    }
}

// Create a noteDatabase let for use outside the script.
var noteDatabase = new noteDB(contentDatabase, reminderDatabase, folderDatabase);