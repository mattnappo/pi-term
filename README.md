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