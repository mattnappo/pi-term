# Pi Term
A web app to send commands to Raspberry Pis and manage their Dockerfiles.

## Start the Web Server
This project is written in NodeJS, so you must ```npm install``` before doing anything.
### Running
Now you can run the server with ```npm run server```. You can use the Dockerfile if you like.

## Adding Your Own Raspis
This web app is currently configured for my own Raspberry Pis, their ips, and ssh credentials. To add your own Raspberry Pi(s), edit ```src/server/data/conndata.json```.
### Passwords
The passwords in the `conndata.json` file are automatically decrypted by a key called `key.pem` in the project root (`/`). The keys are in pkcs8 format.
### Note
Some code might need to be changed in order for this app to work with your Raspberry Pis. Fixes coming eventually.

<hr>

## TODO
Some stuff that I still need to do.
### Client side
1. ~~Finish the mockups~~
 * ~~Button JS~~
 * ~~HTML sttucture~~
 * ~~Docker page bug~~
 * Green "online dot" when the raspi is online (Status page)
### Server side
1. Fix authentication
2. SSH re-initialization
3. ~~Status page backend~~
4. Finishing the actual app (Docker and Git)
### Issues
1. Terminal newlines don't work
2. Everything is kind of slow (not completely sure)
3. I have some bad solutions to problems (documented in the code)
4. No unit tests
5. Status page is blocking
6. Stuff breaks when one pi is down
