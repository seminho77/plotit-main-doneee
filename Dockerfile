FROM node:alpine

RUN apk add wget && \
    apk add unzip && \
    mkdir /home/repo

WORKDIR /home/repo

COPY . /home/repo

RUN npm install && \
    npm run ng analytics disable

COPY . /home/repo/plotit-main

CMD ["npm", "start"]

EXPOSE 4200
