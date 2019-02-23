#!/bin/bash

if [ -d "$DIRECTORY" ]; then # Git pull if the repo already is cloned
    cd ~/git/pi-term
    git pull origin master

else # Get the repo if it doesn't exist
    # Init & clone
    mkdir -p ~/git
    cd ~/git
    git clone https://github.com/xoreo/pi-term.git
    
    # Make the helpers directory
    mkdir -p ~/git/pi-term/helpers
    cd ~/git/pi-term/helpers
fi

cd ~/git/pi-term
npm i

# Move the scripts
cp ../src/server/helpers/* .