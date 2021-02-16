require('dotenv').config()

const axios = require('axios')
const numeral = require('numeral')
const moment = require('moment-timezone')
const tc = require('title-case')

const Client = require('coinbase').Client

const getTime = () => {
  return [{
    key: `${moment().tz(process.env.TIME_ZONE).format('MMM Do, YYYY')}`,
    value: `${moment().tz(process.env.TIME_ZONE).format('ddd h:mm:ss a')}`
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

const getCoinbaseBalance = () => {
  const client = new Client({
    'apiKey': process.env.COINBASE_API_KEY,
    'apiSecret': process.env.COINBASE_API_SECRET,
    strictSSL: false
  })

  return new Promise((resolve, reject) => {
    client.getAccounts({}, function (err, accounts) {
      if (err) {
        console.error(err)
        return reject([])
      }

      const checkAccounts = (process.env.COINBASE_ACCOUNTS).split(',')
      const coinbaseAccounts = checkAccounts.length >= 1 && checkAccounts[0] !== '' ? accounts.filter((ca) => checkAccounts.includes(ca.id)) : accounts

      const messages = coinbaseAccounts.map((account) => {
        return {
          key: account.name,
          value: `${account.native_balance.amount} ${account.native_balance.currency}`
        }
      })

      return resolve(messages)
    })
  })
}

module.exports = {
  getTime,
  getWeather,
  getYouTubeStats,
  getCoinbaseBalance
}
