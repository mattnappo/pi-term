# Pi Term
An HTML and CSS wrapper to send commands to Raspberry Pis.

## Start the Web Server
This project is written in NodeJS, so you must ```npm install``` before doing anything.
### Running
Now you can run the server with ```npm run server```

## Adding Your Own Raspis
This web app is currently configured for my own Raspberry Pis, their ips, and ssh credentials. To add your own Raspberry Pi(s), edit ```src/server/data/conndata.json```.
### Passwords
The passwords in the `conndata.json` file are automatically decrypted by a key called `key.pem` in the project root (`/`). The keys are in pkcs8 format.

<hr>

## TODO
A list of stuff that I still need to do on this project.
### Client side
1. Finish the mockups
 * Button JS
 * HTML sttucture
### Client side
1. Fix authentication
2. Make the app work