const content = {
    innerHTML: "",
}

const contentData = {
    title: "",
    body: "",
    images: "",
}

const contentDB = {
    
    collection: "content",
    
    getContent : function(contentID) {
        // get content data
        // construct content HTML from data
        // return constructed content HTML
    },

    getContentData : function(contentID) {
        // get content data from db
        // return content data
    },

    constructContent : function(contentData) {
        // construct content HTML from content data
        // return content HTML
    },

    createContent : function(contentData) {
        // store title
        // store body
        // store image
        // return ID
    },

    updateContent : function(contentID, contentData) {
        // update content data
        // return null
    },

    deleteContent : function(contentID) {
        // delete content data
        // return null
    }
}