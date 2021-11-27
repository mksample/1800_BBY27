// Final content HTML element. Unfinished, as is the constructContent method
const content = {
    innerHTML: "",
}

// Class that organizes content data. This is then turned into the final HTML element.
class contentData {
    constructor(title, body, template, timestamp, id) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.template = template;
        this.timestamp = timestamp;
    }
}

class contentDB {

    collection = "content"

    // Converts content data into a normal object which can be stored.
    converter = {
        toFirestore: function (data) { // Converts to firestore data format when writing
            return {
                title: data.title,
                body: data.body,
                template: data.template,
                timestamp: data.timestamp
            };
        },
        fromFirestore: function (snapshot, options) { // Converts from firestore data format when reading
            const data = snapshot.data(options);
            return new contentData(data.title, data.body, data.template, data.timestamp, snapshot.id);
        }
    }

    // Gets content HTML for a note.
    async getContent(contentID) {
        let contentData = await this.getContentData(contentID);
        let content = this.constructContent(contentData);
        return content;
    }

    // Gets content data.
    getContentData(contentID) {
        let docRef = db.collection(this.collection).doc(contentID)
        let contentData = docRef.withConverter(this.converter).get().then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                console.log("No such document!");
            }
        })

        return contentData;
    }

    // Transforms content data into an HTML element. 
    constructContent(contentData) {
        // Get content temmplate
        let ContentTemplate = document.getElementById("NoteContentTemplate");
        let content = ContentTemplate.content.cloneNode(true);

        content.querySelector('.noteContentTitle').innerHTML = contentData.title;
        content.querySelector('.noteContentBody').innerHTML = contentData.body;

        // Set element ID
        content.querySelector('.noteContent').setAttribute("id", contentData.id);

        return content;
    }

    // Writes content data.
    async createContent(contentData) {
        let docRef = db.collection(this.collection)
        let id = docRef.withConverter(this.converter).add(contentData).then(doc => {
            return doc.id;
        })

        return id;
    }

    // Updates content data. Accepts null values.
    async updateContent(contentID, contentData) {
        let contentDataRef = db.collection(this.collection).doc(contentID);
        let updateObj = {};
        if (contentData.title) {
            updateObj.title = contentData.title;
        }
        if (contentData.body) {
            updateObj.body = contentData.body;
        }
        if (contentData.template) {
            updateObj.template = contentData.template;
        }
        if (contentData.timestamp) {
            updateObj.timestamp = contentData.timestamp;
        }

        return contentDataRef.update(updateObj)
    }

    // Delets content data.
    async deleteContent(contentID) {
        let contentDataRef = db.collection(this.collection).doc(contentID);
        return contentDataRef.delete();
    }
}

// Create a contentDatabase let for use outside the script.
var contentDatabase = new contentDB;