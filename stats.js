#!/usr/bin/env node
require('dotenv').config()
const numeral = require('numeral')
const axios = require('axios')

const arduinoApiUrl = `${process.env.ARDUINO_API_URL}/messages`

const start = async () => {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${process.env.CHANNEL_ID}&key=${process.env.API_KEY}`)
    const data = response.data

    const info = data.items.find((i) => i.id === process.env.CHANNEL_ID)
    const stats = info.statistics

    const messages = [
      {
        key: 'Subscribers',
        value: `YouTube: ${numeral(stats.subscriberCount).format('0,0')}`
      },
      {
        key: 'View Count',
        value: `YouTube: ${numeral(stats.viewCount).format('0,0')}`
      }
    ]
    await axios.post(arduinoApiUrl, { messages })
  } catch (error) {
    console.error(error)
  }
}

start().then(() => {
  process.exit(0)
})
