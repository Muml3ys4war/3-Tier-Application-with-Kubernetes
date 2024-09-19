# Import the node base image
FROM node:18-alpine

# initialize the working directory
WORKDIR /app

# copy the json file over to container
COPY package*.json ./

# install dependencies
RUN npm install

# copy the other files 
COPY . .

# starting the npm 
CMD [ "npm","start" ]