# production environment
FROM node:14.15.5-buster
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

ENV NODE_ENV production
ENV NODE_PORT 80

COPY . ./

RUN npm install --production

ENV TIME_ZONE=UTC \
  YOUTUBE_CHANNEL_ID= \
  YOUTUBE_API_KEY= \
  WEATHER_CITY= \
  WEATHER_API_KEY= \
  COINBASE_ACCOUNTS= \
  COINBASE_API_KEY= \
  COINBASE_API_SECRET= \
  CONVERTER_API_KEY=

EXPOSE 80
CMD ["node", "/app/src/index.js"]
