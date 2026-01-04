FROM node:24-alpine

ADD . /frontend

WORKDIR /frontend

RUN npm install

ENTRYPOINT [ "node" ]

CMD ["app.js"]
