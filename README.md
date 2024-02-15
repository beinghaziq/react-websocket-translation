## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



After creating react app you need to copy the code of App.js file\
to the corresponding App.js file in your newly created project.\
And you need to create two new files RTCRecorder.js and websocketConnection.js\
within the same directory of App.js

Node version I used: 16.17.
### Prerequisites - Install the Following Packages

##### `npm install react-use-websocket`
##### `npm install file-saver`
##### `npm install recordrtc --legacy-peer-deps`
##### `npm install react-audio-visualize`


## Available Scripts

In the project directory, you can run:

##### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

##### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Additional Information

When you click on the start button, the recording will commence, sending messages\
to websockets in chunks. After stopping the recording, websockets will return the\
translated audio, which you can access in your downloads folder. Additionally,\
you can play the translated audio in the UI.
