# base image
FROM node:10.16-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Bundle app source
# COPY . .
COPY ASG-workspace.code-workspace  /app/ASG-workspace.code-workspace
COPY bower.json  /app/bower.json
COPY build  /app/build
COPY ISSUE_TEMPLATE.md  /app/ISSUE_TEMPLATE.md
COPY jsconfig.json  /app/jsconfig.json
COPY LICENSE.md  /app/LICENSE.md
COPY package.json  /app/package.json
COPY public  /app/public
COPY README.md  /app/README.md
ADD documentation  /app/documentation
ADD src  /app/src

# New changes...

# Copy .env file and shell script to container
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# install and cache app dependencies
COPY package*.json ./
ADD package.json /app/package.json
# RUN npm install --silent
RUN rm -rf node_modules
RUN rm package-lock.json
RUN npm cache clean --force
RUN npm install
RUN npm install react-scripts@3.0.1 -g --silent


# start app
CMD ["npm", "start"]
