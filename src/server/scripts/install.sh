# Get the repo
mkdir -p ~/git
cd ~/git
git clone https://github.com/xoreo/pi-term.git
cd ~/git/pi-term
npm i

# Make the helpers directory
mkdir -p ~/git/pi-term/helpers
cd ~/git/pi-term/helpers

# Move the scripts
cp ../src/server/scripts/* .
