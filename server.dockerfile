FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
# COPY . .
COPY src .

# App binds to port 3000 so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Command to run app
CMD [ "npm", "start" ]
