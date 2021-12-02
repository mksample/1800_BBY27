ready(async function () {
    // Wait for the user to fully sign in, then store the user and userID in variables
    function getCurrentUser() {
        return new Promise((resolve, reject) => {
            const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                unsubscribe();
                resolve(user);
            }, reject);
        });
    }
    var user = await getCurrentUser(firebase.auth);
    var userID = user.uid;
    var dragged;

    const deviceType = () => {
        const ua = navigator.userAgent;
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "mobile";
        }
        return "desktop";
    };

    const mouseDownEvent = () => {
        if (deviceType() == "mobile") {
            return "touchstart";
        }
        return "mousedown";
    }

    const mouseUpEvent = () => {
        if (deviceType() == "mobile") {
            return "touchend";
        }
        return "mouseup";
    }

    const mouseMoveEvent = () => {
        if (deviceType() == "mobile") {
            return "touchmove";
        }
        return "mousemove"
    }

    // Event handler for expanding a note (uses jQuery).
    const expandNote = function (e) {
        if (dragged) {
            dragged = false;
            return
        }
        let note = e.currentTarget.cloneNode(true);
        let modalTitle = document.getElementById('expandNoteTitle')
        let modalContent = document.getElementById('expandNoteContent')
        let modalDate = document.getElementById('expandNoteDate')


        modalTitle.value = note.querySelector('.noteContentTitle').innerHTML;
        modalContent.value = note.querySelector('.noteContentBody').innerHTML;
        modalDate.value = note.querySelector('.noteReminderDate').innerHTML;

        $("#expandNoteModal").modal('toggle');
    };

    // Listerer that helps the delete note handler know what note to delete.
    const setDeleteModalNoteID = function (e) {
        e.stopImmediatePropagation();
        let noteID = e.currentTarget.parentNode.getAttribute("id");
        let note = document.getElementById(noteID);

        modal = document.getElementById("deleteNoteModal");
        modal.setAttribute("data-noteID", noteID);
        modal.querySelector("#deleteNoteModalLabel").innerHTML = note.querySelector('.noteContentTitle').innerHTML;
    };

    // Listerer that helps the delete note handler know what note to delete.
    const setExpandModalNoteID = function (e) {
        let noteID = e.currentTarget.getAttribute("id");
        document.getElementById("expandNoteModal").setAttribute("data-noteID", noteID);
    };


    // Section was taken from github, it creates event listeners for drag and drop functionality. Modified to use absolute vertical positioning (instead of window)
    // and to not select any inner elements. Also modified was placeholder handling in the mouseUp function.
    // Modified one last time to work for mobile and desktop event types.
    // Reference: https://github.com/1milligram/html-dom/blob/master/public/demo/drag-and-drop-element-in-a-list/index.html

    // START SECTION //
    const list = document.getElementById('notes');

    let draggingEle;
    let placeholder;
    let isDraggingStarted = false;

    // The current position of mouse relative to the dragging element
    let x = 0;
    let y = 0;

    // Swap two nodes
    const swap = function (nodeA, nodeB) {
        const parentA = nodeA.parentNode;
        const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

        // Move `nodeA` to before the `nodeB`
        nodeB.parentNode.insertBefore(nodeA, nodeB);

        // Move `nodeB` to before the sibling of `nodeA`
        parentA.insertBefore(nodeB, siblingA);
    };

    // Check if `nodeA` is above `nodeB`
    const isAbove = function (nodeA, nodeB) {
        // Get the bounding rectangle of nodes
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();

        return (rectA.top + window.scrollY) + rectA.height / 2 < (rectB.top + window.scrollY) + rectB.height / 2;
    };

    const mouseDownHandler = function (e) {
        draggingEle = e.currentTarget;

        // Calculate the mouse position
        const rect = draggingEle.getBoundingClientRect();
        if (deviceType() == "mobile") {
            x = e.touches[0].pageX - rect.left;
            y = e.touches[0].pageY - (rect.top + window.scrollY);
        } else {
            x = e.pageX - rect.left;
            y = e.pageY - (rect.top + window.scrollY);
        }

        // Attach the listeners to `document`
        document.addEventListener(mouseMoveEvent(), mouseMoveHandler, { passive: false });
        document.addEventListener(mouseUpEvent(), mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        if (deviceType() == "mobile") {
            e.preventDefault();
        }
        const draggingRect = draggingEle.getBoundingClientRect();
        if (!isDraggingStarted) {
            isDraggingStarted = true;
            dragged = true;
            // Let the placeholder take the height of dragging element
            // So the next element won't move up
            placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
            placeholder.style.height = `${draggingRect.height}px`;
        }

        // Set position for dragging element
        draggingEle.style.position = 'absolute';
        if (deviceType() == "mobile") {
            draggingEle.style.top = `${e.touches[0].pageY - y}px`
            draggingEle.style.left = `${e.touches[0].pageX -x}px`
        } else {
            draggingEle.style.top = `${e.pageY - y}px`;
            draggingEle.style.left = `${e.pageX - x}px`;
        }

        // The current order
        // prevEle
        // draggingEle
        // placeholder
        // nextEle
        const prevEle = draggingEle.previousElementSibling;
        const nextEle = placeholder.nextElementSibling;

        // The dragging element is above the previous element
        // User moves the dragging element to the top
        if (prevEle && isAbove(draggingEle, prevEle)) {
            // The current order    -> The new order
            // prevEle              -> placeholder
            // draggingEle          -> draggingEle
            // placeholder          -> prevEle
            swap(placeholder, draggingEle);
            swap(placeholder, prevEle);
            return;
        }

        // The dragging element is below the next element
        // User moves the dragging element to the bottom
        if (nextEle && isAbove(nextEle, draggingEle)) {
            // The current order    -> The new order
            // draggingEle          -> nextEle
            // placeholder          -> placeholder
            // nextEle              -> draggingEle
            swap(nextEle, placeholder);
            swap(nextEle, draggingEle);
        }
    };

    const mouseUpHandler = function (e) {
        // Remove the placeholder
        if (placeholder != null && placeholder.parentNode != null) {
            placeholder && placeholder.parentNode.removeChild(placeholder);
        }

        draggingEle.style.removeProperty('top');
        draggingEle.style.removeProperty('left');
        draggingEle.style.removeProperty('position');

        x = null;
        y = null;
        draggingEle = null;
        isDraggingStarted = false;

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener(mouseMoveEvent(), mouseMoveHandler);
        document.removeEventListener(mouseUpEvent(), mouseUpHandler);
    };

    // Add event listener
    [].slice.call(list.querySelectorAll('.note')).forEach(function (item) {
        item.addEventListener(mouseDownEvent(), mouseDownHandler);
    });
    // END SECTION

    // Display notes for the logged in user
    async function displayNotes() {
        let notesDOM = document.getElementById("notes");
        await noteDatabase.getNotes(userID, function (note) {
            let noteID = note.querySelector('.note').id;
            notesDOM.appendChild(note); // for some reason once note is appended note.id can no longer be accessed

            let appendedNote = document.getElementById(noteID);
            appendedNote.addEventListener(mouseDownEvent(), mouseDownHandler);
            appendedNote.addEventListener("click", expandNote);
            appendedNote.querySelector("#deleteNoteModalButton").addEventListener("click", setDeleteModalNoteID);
            appendedNote.addEventListener("click", setExpandModalNoteID);
        });
        console.log("Done loading notes")
    }
    await displayNotes();

    // Event handler for creating a new note.
    document.querySelector("#noteInputCreateButton").addEventListener("click", async function (e) {
        let contentTitle = document.getElementById("noteInputContentTitle").value;
        let contentText = document.getElementById("noteInputContentBody").value;
        let reminderDate = document.getElementById("noteInputReminderDate").value;

        let noteID = await noteDatabase.createNote(new noteInputData(userID,
            new contentData(contentTitle, contentText, "placeholder", firebase.firestore.Timestamp.now()),
            new reminderData(reminderDate, firebase.firestore.Timestamp.now()),
            new folderData("placeholder", firebase.firestore.Timestamp.now()),
        ));

        let notesDOM = document.getElementById("notes");
        notesDOM.appendChild(await noteDatabase.getNote(noteID));

        let noteDOM = document.getElementById(noteID);

        noteDOM.addEventListener(mouseDownEvent(), mouseDownHandler);
        noteDOM.addEventListener("click", expandNote);
        noteDOM.addEventListener("click", setExpandModalNoteID);
        noteDOM.querySelector("#deleteNoteModalButton").addEventListener("click", setDeleteModalNoteID)
        noteDOM.scrollIntoView();

        $("#" + noteID).delay(100).fadeOut().fadeIn('slow');

        document.getElementById("noteInputContentTitle").value = "";
        document.getElementById("noteInputContentBody").value = "";
        document.getElementById("noteInputReminderDate").value = "";
    });

    // Event handler for deleting a note.
    document.querySelector("#noteDeleteButton").addEventListener("click", async function (e) {
        let noteID = e.currentTarget.parentNode.parentNode.parentNode.parentNode.getAttribute("data-noteID");

        let deletedNote = document.getElementById(noteID);
        let parent = deletedNote.parentNode;

        $("#" + noteID).delay(100).fadeOut('slow', function () {
            parent.removeChild(deletedNote);
        });

        noteDatabase.deleteNote(noteID);
    });

    // Event handler for updating a note.
    document.querySelector("#noteUpdateButton").addEventListener("click", async function (e) {
        let noteID = e.currentTarget.parentNode.parentNode.parentNode.parentNode.getAttribute("data-noteID");
        let oldNote = document.getElementById(noteID);

        let contentTitle = document.getElementById("expandNoteTitle").value;
        let contentText = document.getElementById("expandNoteContent").value;
        let reminderDate = document.getElementById("expandNoteDate").value;

        await noteDatabase.updateNote(noteID, new noteInputData(userID,
            new contentData(contentTitle, contentText, "placeholder", firebase.firestore.Timestamp.now()),
            new reminderData(reminderDate, firebase.firestore.Timestamp.now()),
            new folderData("placeholder", firebase.firestore.Timestamp.now()),
        ));

        let notesDOM = document.getElementById("notes");
        let newNote = await noteDatabase.getNote(noteID)
        notesDOM.replaceChild(newNote, oldNote);

        let appendedNote = document.getElementById(noteID);
        appendedNote.addEventListener(mouseDownEvent(), mouseDownHandler);
        appendedNote.addEventListener("click", expandNote);
        appendedNote.querySelector("#deleteNoteModalButton").addEventListener("click", setDeleteModalNoteID);
        appendedNote.addEventListener("click", setExpandModalNoteID);

        $("#" + noteID).delay(100).fadeOut().fadeIn('slow');
    });
});

function ready(callback) {
    if (document.readyState != "loading") {
        callback();
        console.log("ready state is 'complete'");
    } else {
        document.addEventListener("DOMContentLoaded", callback);
        console.log("Listener was invoked");
    }
}