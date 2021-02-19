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

example value:

```
TIME_ZONE=Asia/Kuala_Lumpur
YOUTUBE_CHANNEL_ID=2gFfLzvRjF_omjFlEjV7O
YOUTUBE_API_KEY=PgFAq3y33KWF6McWUQXB_Z47urE2VfH
WEATHER_CITY=Kuala Lumpur,3.113060967492328,101.71680245642064
WEATHER_API_KEY=d3617f6469d943b381a4547223b88f26
COINBASE_ACCOUNTS=52ef9bcb-aa24-45e3-b88b-178e5399400f,7df05ffb-e715-4ac0-b78f-f5f55a513851
COINBASE_API_KEY=f166f553a1564
COINBASE_API_SECRET=leaAqCHBio6GzOmCNR0pfbPYamO5KdZ1
CONVERTER_API_KEY=fb347eb47fa48f54d5e517428d
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
