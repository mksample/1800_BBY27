// Final content HTML element. Unfinished, as is the constructContent method
const content = {
    innerHTML: "",
}

// Class that organizes content data. This is then turned into the final HTML element.
class contentData {
    constructor(title, body, images) {
        this.title = title;
        this.body = body;
        this.images = images;
        this.timestamp = firebase.firestore.Timestamp.now();
    }
}

class contentDB {

    collection = "content"

    // Converts content data into a normal object which can be stored.
    converter = {
        toFirestore: function(data) { // Converts to firestore data format when writing
            return {
                title: data.title,
                body: data.body,
                images: data.images,
                timestamp: data.timestamp
                };
        },
        fromFirestore: function(snapshot, options){ // Converts from firestore data format when reading
            const data = snapshot.data(options);
            return new contentData(data.title, data.body, data.images, data.timestamp);
        }
    }

    // Gets content HTML for a note.
    async getContent(contentID) {
        var contentData = await this.getContentData(contentID);

        // Still need to write method for contentData --> HTML
        // noteContent = this.constructContent(contentData);
        return contentData;
    }

    // Gets content data.
    getContentData(contentID) {
        var docRef = db.collection(this.collection).doc(contentID)
        var contentData = docRef.withConverter(this.converter).get().then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                console.log("No such document!");
            }
        })

        return contentData;
    }

    // UNFINISHED, transforms content data into an HTML element. 
    constructContent(contentData) {
        // construct content HTML from content data
        // return content HTML
    }

    // Writes content data.
    async setContent(contentData) {
        var docRef = db.collection(this.collection)
        var id = docRef.withConverter(this.converter).add(contentData).then(doc => {
            return doc.id;
        })

        return id;
    }

    // Updates content data. Accepts null values.
    async updateContent(contentID, contentData) {
        var contentDataRef = db.collection(this.collection).doc(contentID);
        var updateObj = {};
        if (contentData.title) {
            updateObj.title = contentData.title
        } 
        if (contentData.body) {
            updateObj.body = contentData.body
        }
        if (contentData.images) {
            updateObj.images = contentData.images
        }

        updateObj.timestamp = firebase.firestore.Timestamp.now()

        return contentDataRef.update(updateObj)
    }

    // Delets content data.
    async deleteContent(contentID) {
        var contentDataRef = db.collection(this.collection).doc(contentID);
        return contentDataRef.delete();
    }

    async testfunc() {
        var id = await this.setContent(new contentData("title", "body", "images")); // create content
        console.log("1")
        await this.updateContent(id, new contentData(null, "updated body", "updated images")); // update content
        console.log("2")
        var data = await this.getContent(id); // get updated content and print
        console.log(data);
        console.log("3")
        await this.deleteContent(id) // delete content
        console.log("4")
    }
}

// This code creates the contentDB object and runs the test function above upon loading a page. Uncomment to run and view the console for output
// var contDB = new contentDB;
// contDB.testfunc();