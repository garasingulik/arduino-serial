# Arduino Serial

Display message from serial to LCD using Arduino and Node.js

# Prerequest

* Node.js
* Arduino CLI

# Environment Variables

Create `.env` before starting this project using this template.

```
YOUTUBE_CHANNEL_ID=<YouTube Channel ID>
YOUTUBE_API_KEY=<YouTube API Key>
WEATHER_CITY=<Open Weather City>
WEATHER_API_KEY=<Open Weather API Key>
COINBASE_ACCOUNTS=<Coinbase Wallet Account ID>
COINBASE_API_KEY=<Coinbase API Key>
COINBASE_API_SECRET=<Coinbase API Secret>
CONVERTER_API_KEY=<Free Currency Converter API Key>
```

# Running in Development

```
npm start
```

## Running inside docker

```
docker-compose up -d --build
```

## Stoping docker container

```
docker-compose down
```

# Arduino Development

## Compile Sketch

```
npm run compile
```

## Upload Compiled Binary

```
npm run upload
```
