require('dotenv').config()

const axios = require('axios')
const numeral = require('numeral')
const moment = require('moment-timezone')
const tc = require('title-case')

const Client = require('coinbase').Client

const getTime = () => {
  return [{
    key: `${moment().tz(process.env.TIME_ZONE).format('MMM Do, YYYY')}`,
    value: `${moment().tz(process.env.TIME_ZONE).format('ddd h:mm a')}`
  }]
}

const getWeather = async () => {
  if (!process.env.WEATHER_CITY) return []

  const city = process.env.WEATHER_CITY.split(',')
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${city[1]}&lon=${city[2]}&units=metric&exclude=minutely,daily&appid=${process.env.WEATHER_API_KEY}`)

  const weatherInfo = response.data
  const current = weatherInfo.current
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
  if (!process.env.YOUTUBE_CHANNEL_ID || !process.env.YOUTUBE_API_KEY) return []

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
  if (!process.env.COINBASE_API_KEY || !process.env.COINBASE_API_SECRET) return []

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

      const messages = []
      if (accounts.length > 0) {
        const nativeBalanceCurrency = accounts[0].native_balance.currency
        const totalNativeBalance = accounts.map(a => parseFloat(a.native_balance.amount || '0.00')).reduce((p, c) => {
          return p + c
        })

        messages.push({
          key: 'Coinbase Wallet',
          value: `Total: ${numeral(totalNativeBalance).format('0,0')} ${nativeBalanceCurrency}`
        })
      }

      if (messages.length === 0) {
        messages.push(
          {
            key: 'Coinbase Status',
            value: 'Wallet Offline'
          }
        )
      }

      return resolve(messages)
    })
  })
}

const getExhangeRate = async () => {
  if (!process.env.CONVERTER_API_KEY || !process.env.CONVERTER_API_KEY) return []

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
