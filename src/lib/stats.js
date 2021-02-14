require('dotenv').config()

const axios = require('axios')
const numeral = require('numeral')
const moment = require('moment-timezone')
const tc = require('title-case')

const getTime = () => {
  return [{
    key: `${moment().tz(process.env.TIME_ZONE).format('MMM Do, YYYY')}`,
    value: `${moment().tz(process.env.TIME_ZONE).format('h:mm:ss a')}`
  }]
}

const getWeather = async () => {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(process.env.WEATHER_CITY)}&appid=${process.env.WEATHER_API_KEY}&units=metric`)
  const weatherInfo = response.data

  return [
    {
      key: `${process.env.WEATHER_CITY}`,
      value: `${tc.titleCase(weatherInfo.weather[0].description)}`
    },
    {
      key: `${process.env.WEATHER_CITY}`,
      value: `${weatherInfo.main.temp} / ${weatherInfo.main.feels_like} *C`
    }
  ]
}

const getYouTubeStats = async () => {
  const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`)
  const data = response.data

  const info = data.items.find((i) => i.id === process.env.YOUTUBE_CHANNEL_ID)
  const youtubeStats = info.statistics

  return [
    {
      key: 'Subscribers',
      value: `YouTube: ${numeral(youtubeStats.subscriberCount).format('0,0')}`
    },
    {
      key: 'View Count',
      value: `YouTube: ${numeral(youtubeStats.viewCount).format('0,0')}`
    }
  ]
}

module.exports = {
  getTime,
  getWeather,
  getYouTubeStats
}