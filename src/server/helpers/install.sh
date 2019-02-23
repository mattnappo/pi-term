#!/bin/bash

ROOTDIR="$HOME/git/pi-term"

if [ -d "$DIRECTORY" ]; then # Git pull if the repo already is cloned
    cd $ROOTDIR
    git pull origin master

else # Get the repo if it doesn't exist
    # Init & clone
    mkdir -p ~/git
    cd ~/git
    git clone https://github.com/xoreo/pi-term.git
    
    # Make the helpers directory
    mkdir -p $ROOTDIR/helpers
    cd $ROOTDIR/helpers
fi

cd $ROOTDIR
npm i

# Move the scripts
cp $ROOTDIR/src/server/helpers/* $ROOTDIR/helpers