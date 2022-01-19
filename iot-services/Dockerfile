FROM node:latest
RUN mkdir /app
WORKDIR /app
ADD package*.json /app/
RUN npm install
ADD . /app/
ADD ./oak.txt ./app/
ADD ./foster.txt ./app/
ADD ./63rd.txt ./app/
CMD [ "npm", "start"]