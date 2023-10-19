To use this app, you need to have node/npm installed
Ensure that your board is running the proper firmware to properly decode the text passed through the serial port from the website.
Run npm install to install all of the associated packages/node modules
On windows, you need to open your powershell as an admin so that it has access to the serial ports.
In '/server.js/', you need to change the port's path to be the one that the server is using to communicate with the board
On my machine, this was COM7. 
Ensure that the baudRate is set to 9600 in your device manager's settings
cd to this projects directory, until you get to ../SiteForMQP , then you can run node server.js to run the website locally.
Navigate to https://localhost:3000 on your browser, and you will see a color picker and a grid. 
Using this, draw your drawing, or change 1 pixel at a time depending on how you want to use it. 
This should update the led pixel strip
If you want to change the dimensions:
1. Change the number of pixels in server.js, changing GRID_SIZE to the desired number of pixels.
2. Change the number of columns in the styles.css sheet to the desired number of columns.
Ad. The current app was built for a 10x10 grid of LED's
The app also works if more than one person wants to change some of the LED information, by saving the information server side.
This means that everyone can see what other people are drawing and it is more collaborative.
This app is a demo, intended as a proof of concept, and can be adpated to a full website, along with using a wifi module for the adafruit board to communicate remotely, without requiring the board to be plugged directly into the server
