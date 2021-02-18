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
  if (!process.env.WEATHER_CITY) return [];

  const city = process.env.WEATHER_CITY.split(',')
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${city[1]}&lon=${city[2]}&units=metric&exclude=minutely,daily&appid=${process.env.WEATHER_API_KEY}`)

  const weatherInfo = response.data
  const current = weatherInfo.current
  const next2Hour = weatherInfo.hourly[1]
  const next4Hour = weatherInfo.hourly[3]

  return [
    {
      key: city[0],
      value: `${tc.titleCase(current.weather[0].description)}`
    },
    {
      key: 'Current Temp:',
      value: `${current.temp} / ${current.feels_like} *C`
    },
    {
      key: 'Next 4 hours:',
      value: `${tc.titleCase(next4Hour.weather[0].description)}`
    }
  ]
}

const getYouTubeStats = async () => {
  if (!process.env.YOUTUBE_CHANNEL_ID || !process.env.YOUTUBE_API_KEY) return [];

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
  if (!process.env.COINBASE_API_KEY || !process.env.COINBASE_API_SECRET) return [];

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

const getExhangeRate = async () => {
  const goldResponse = await axios.get(`https://free.currconv.com/api/v7/convert?q=XAU_MYR,MYR_IDR&compact=ultra&apiKey=${process.env.CONVERTER_API_KEY}`)
  const data = goldResponse.data

  if (data) {
    return [
      {
        key: 'Gold Price =',
        value: `${numeral(data['XAU_MYR'] / 31.1034768).format('0,0')} MYR / g`
      },
      {
        key: '1 MYR =',
        value: `${numeral(data['MYR_IDR']).format('0,0')} IDR`
      }
    ]
  }

  return []
}

module.exports = {
  getTime,
  getWeather,
  getYouTubeStats,
  getCoinbaseBalance,
  getExhangeRate
}
