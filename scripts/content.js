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

        // Still need to write method for contentData --> HTML
        // noteContent = this.constructContent(contentData);
        return contentData;
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

    // UNFINISHED, transforms content data into an HTML element. 
    constructContent(contentData) {
        // construct content HTML from content data
        // return content HTML

        // Create new elements for each content item
        var contentLayout = document.createElement("div");
        contentLayout.id = "contentDivID";
        var contentTitleDiv = document.createElement("h2");
        var contentBodyDiv = document.createElement("textarea");

        // Set the elements to the values of the data
        contentTitleDiv.textContent = contentData.title + "\n";
        contentBodyDiv.innerHTML = contentData.body;

        // Style
        contentBodyDiv.style.width = '50%';

        // Add the elements to the page
        document.body.appendChild(contentLayout);
        contentLayout.appendChild(contentTitleDiv);
        contentLayout.appendChild(contentBodyDiv);

        // Supposed to return the html element but might not work ?
        return contentLayout;
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


// Displays users name on main.html page
function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            // Do something for the current logged-in user here: 
            console.log(user.uid);
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var user_Name = userDoc.data().name;
                    console.log(user_Name);
                    // Insert using jquery
                    $("#username").text(user_Name + "'s Notes");
                })
        } else {
            // No user is signed in.
        }
    });
}
insertName();