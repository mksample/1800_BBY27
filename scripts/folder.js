// Final folder HTML element. Unfinished, as is the constructfolder method
const folder = {
    innerHTML: "",
}

// Class that organizes folder data. This is then turned into the final HTML element.
class folderData {
    constructor(name, timestamp) {
        this.name = name;
        this.timestamp = timestamp;
    }
}

class folderDB {

    collection = "folders"
 
    // Converts folder data into a normal object which can be stored.
    converter = {
        toFirestore: function (data) { // Converts to firestore data format when writing
            return {
                name: data.name,
                timestamp: data.timestamp
            };
        },
        fromFirestore: function (snapshot, options) { // Converts from firestore data format when reading
            const data = snapshot.data(options);
            return new folderData(data.name, data.timestamp);
        }
    }

    // Gets folder HTML for a note.
    async getFolder(folderID) {
        var folderData = await this.getFolderData(folderID);

        // Still need to write method for folderData --> HTML
        // notefolder = this.constructfolder(folderData);
        return folderData;
    }

    // Gets folder data.
    getFolderData(folderID) {
        var docRef = db.collection(this.collection).doc(folderID)
        var folderData = docRef.withConverter(this.converter).get().then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                console.log("No such document!");
            }
        })

        return folderData;
    }

    // UNFINISHED, transforms folder data into an HTML element. 
    constructfolder(folderData) {
        // construct folder HTML from folder data
        // return folder HTML
    }

    // Writes folder data.
    async createFolder(folderData) {
        var docRef = db.collection(this.collection)
        var id = docRef.withConverter(this.converter).add(folderData).then(doc => {
            return doc.id;
        })

        return id;
    }

    // Updates folder data. Accepts null values.
    async updateFolder(folderID, folderData) {
        var folderDataRef = db.collection(this.collection).doc(folderID);
        var updateObj = {};
        if (folderData.name) {
            updateObj.name = folderData.name;
        } 
        if (folderData.timestamp) {
            updateObj.timestamp = folderData.timestamp;
        }

        return folderDataRef.update(updateObj)
    }

    // Delets folder data.
    async deleteFolder(folderID) {
        var folderDataRef = db.collection(this.collection).doc(folderID);
        return folderDataRef.delete();
    }
}

// Create a folderDatabase var for use outside the script.
var folderDatabase = new folderDB;

function showNote() {
    // Create a new div element
    var newDiv = document.createElement("div");
    newDiv.style.width = '40rem';
    newDiv.style.height = '10rem';
    
    // Style
    newDiv.style.backgroundColor = 'rgb(37, 183, 183)';
    newDiv.classList.add('note');
    newDiv.innerHTML = document.getElementById("note-title-input").value;
    
    // Add physical note to html of main page
    document.getElementById("notes").appendChild(newDiv);

    // Clear input fields
    document.getElementById("note-title-input").value = "";
    document.getElementById("note-text-input").value = "";
}
