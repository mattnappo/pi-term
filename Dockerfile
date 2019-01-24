# Declare node version
FROM node:8

# Create app directory
WORKDIR /usr/src/pi-term

# Copy the package to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the app
CMD [ "npm", "run", "server" ]


# Running the docker file:

# Start by building the image:
# docker build -t xoreo/pi-term .

# Then run the image:
# docker run -p local_port:container_port -d <image name>

# Docker reminders:
# docker ps lists all running containers
# docker images lists all built images on your computer
# docker container is a nice command
# docker logs <container id> shows the container's logs
# docker exec -it <container id> /bin/bash to enter the container