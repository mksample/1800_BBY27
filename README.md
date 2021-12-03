## Note App

* [General info](#general-info)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
This is an application to help people take notes with simplicity and appeal.
	
## Technologies
Technologies used for this project:
* HTML, CSS
* JavaScript
* Bootstrap
* Firebase and Firestore 
	
## Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── help.html                # help HTML file, this gives users instructions on how to create, delete, and edit notes
├── index.html               # landing HTML file, this is what users see when you come to url
├── login.html               # login HTML file, the log-in page
├── main.html                # main HTML file, the landing page after log-in or user set-up
└── README.md                # the readme file for this project

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
        /logo.jpg
        /paper.jpg
        /purple-blue-pastel.jpg
        
├── scripts                         # Folder for scripts
        /content.js                 # JS for content collection in firebase
        /firebaseAPI.js             # firebase API, shared across pages
        /folder.js                  # JS for folder collection in firebase (not used in final app)
        /help.js                    # JS for help.html
        /main.js                    # JS for main.html
        /note.js                    # JS for note collection in firebase
        /reminder.js                # JS for setting a reminder

├── styles                          # Folder for styles
        /bootstrap.css              # styles imported from Bootstrap
        /help.css                   # style for help.html
        /index.css                  # style for index.html
        /login.css                  # style for login.html
        /main.css                   # style for main.html

Firebase hosting files: 
├── .firebase
	/hosting..cache
├── .firebaserc
├── 404.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── storage.rules


```


## Resources
- Clipboard logo from unknown online source (found through Google Images)
- Paper image from: https://img.freepik.com/free-photo/design-space-paper-textured-background_53876-42312.jpg?size=626&ext=jpg&ga=GA1.2.1900120822.1638403200
- Purple blue pastel image from: https://cutewallpaper.org/21/two-color-wallpaper/view-page-21.html
- Drag and drop function reference: https://github.com/1milligram/html-dom/blob/master/public/demo/drag-and-drop-element-in-a-list/index.html

## Contact 
* Monica Bacatan - mbacatan1@my.bcit.ca 
* Waleed Ur Rehman - wurrehman@my.bcit.ca
* Markus Sample - msample4@my.bcit.ca

## Acknowledgements 
* <a href="https://fonts.google.com/">Google Fonts</a>
* <a href="https://fonts.google.com/icons">Material Icons Library</a>
* <a href="https://getbootstrap.com/">Bootstrap</a>
