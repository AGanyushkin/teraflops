FROM node:boron
RUN mkdir -p /opt/application
WORKDIR /opt/application
COPY package.json /opt/application
RUN npm config set strict-ssl false
RUN npm install --production
COPY . /opt/application
RUN rm /opt/application/Dockerfile
EXPOSE 8080 5858
CMD [ "npm", "up:bundle" ]
