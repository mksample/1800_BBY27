// Final reminder HTML element. Unfinished, as is the constructreminder method
const reminder = {
    innerHTML: "",
}

// Class that organizes reminder data. This is then turned into the final HTML element.
class reminderData {
    constructor(date, timestamp, id) {
        this.date = date;
        this.timestamp = timestamp;
        this.id = id;
    }
}

class reminderDB {

    collection = "reminders"
 
    // Converts reminder data into a normal object which can be stored.
    converter = {
        toFirestore: function(data) { // Converts to firestore data format when writing
            return {
                date: data.date,
                timestamp: data.timestamp
                };
        },
        fromFirestore: function(snapshot, options){ // Converts from firestore data format when reading
            const data = snapshot.data(options);
            return new reminderData(data.date, data.timestamp, snapshot.id);
        }
    }

    // Gets reminder HTML for a note.
    async getReminder(reminderID) {
        let reminderData = await this.getReminderData(reminderID);

        // Still need to write method for reminderData --> HTML
        // notereminder = this.constructreminder(reminderData);
        return reminderData;
    }

    // Gets reminder data.
    getReminderData(reminderID) {
        let docRef = db.collection(this.collection).doc(reminderID)
        let reminderData = docRef.withConverter(this.converter).get().then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                console.log("No such document!");
            }
        })

        return reminderData;
    }

    // UNFINISHED, transforms reminder data into an HTML element. 
    constructReminder(reminderData) {
        // construct reminder HTML from reminder data
        // return reminder HTML
    }

    // Writes reminder data.
    async createReminder(reminderData) {
        let docRef = db.collection(this.collection)
        let id = docRef.withConverter(this.converter).add(reminderData).then(doc => {
            return doc.id;
        })

        return id;
    }

    // Updates reminder data. Accepts null values.
    async updateReminder(reminderID, reminderData) {
        let reminderDataRef = db.collection(this.collection).doc(reminderID);
        let updateObj = {};
        if (reminderData.date) {
            updateObj.date = reminderData.date;
        } 
        if (reminderData.timestamp) {
            updateObj.date = reminderData.timestamp
        }

        updateObj.timestamp = firebase.firestore.Timestamp.now();

        return reminderDataRef.update(updateObj);
    }

    // Delets reminder data.
    async deleteReminder(reminderID) {
        let reminderDataRef = db.collection(this.collection).doc(reminderID);
        return reminderDataRef.delete();
    }
}

// Create a reminderDatabase let for use outside the script.
var reminderDatabase = new reminderDB;

//// WIP CODE ////

// $('#datetime').datetimepicker({
  
// });



// //const db = firebase.firestore();
// const form = document.getElementById("reminder-form");

// form.addEventListener('submit', (e) => {
//   event.preventDefault();

//   //console.log(form.timeForm);
//   const date = db.collection('reminders').add({
//     date: form.timeForm.value
    
    
//   })

  
// });