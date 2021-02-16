#!/usr/bin/env node

require('dotenv').config()

const axios = require('axios')
const express = require('express')
const bodyParser = require('body-parser')

const stats = require('./lib/stats')

const app = express()
app.use(bodyParser.json())

const expressPort = process.env.NODE_PORT

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 })
const parser = port.pipe(new Readline({ delimiter: '\n' }))

let isDisplaying = false

parser.on('data', async (data) => {
  // select button
  let messages = []
  switch (data) {
    case 'BTN_SELECT_PRESSED\r':
      messages = messages.concat(stats.getTime())
      messages = messages.concat(await stats.getWeather())
      messages = messages.concat(await stats.getYouTubeStats())
      messages = messages.concat(await stats.getCoinbaseBalance())
      await sendMessages(messages);
      break
    case 'BTN_UP_PRESSED\r':
      messages = messages.concat(stats.getTime())
      await sendMessages(messages);
      break
    case 'BTN_DOWN_PRESSED\r':
      messages = messages.concat(await stats.getWeather())
      await sendMessages(messages);
      break
    case 'BTN_LEFT_PRESSED\r':
      messages = messages.concat(await stats.getYouTubeStats())
      await sendMessages(messages);
      break
    case 'BTN_RIGHT_PRESSED\r':
      messages = messages.concat(await stats.getCoinbaseBalance())
      await sendMessages(messages);
      break
    default:
      console.log(data)
      if (data.startsWith('RESULT:')) {
        isDisplaying = false
      }
      break;
  }
})

port.on("open", async () => {
  console.log('Serial port is open ...')
})

const rightPad = (str, size) => {
  while (str.length < size) str = str + " ";
  return str;
}

const leftPad = (str, size) => {
  while (str.length < size) str = " " + str;
  return str;
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const writeText = async (text) => {
  port.write(text, (err) => {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
  })
}

const sendText = async (messages) => {
  const displayTime = 5000

  // init
  messages.unshift('LCD_BL_ON')
  messages.unshift(`DISP_TIME_${displayTime}`)
  messages.push('LCD_BL_OFF')

  for (const message of messages) {
    let totalSleep = 0
    writeText(`${message}\n`)

    isDisplaying = true
    while (isDisplaying && totalSleep < 10000) {
      totalSleep += 100
      await sleep(100)
    }
  }
}

const sendMessages = async (messages) => {
  const formattedMessages = messages.map((m) => {
    return `${rightPad(m.key, 16)}${leftPad(m.value, 16)}`
  })

  await sendText(formattedMessages)
}

const start = async () => {
  app.get('/', (req, res) => {
    res.send('OK')
  })

  app.post('/stats', async (req, res) => {
    let messages = []

    messages = messages.concat(stats.getTime())
    messages = messages.concat(await stats.getWeather())
    messages = messages.concat(await stats.getYouTubeStats())
    messages = messages.concat(await stats.getCoinbaseBalance())

    await sendMessages(messages);
    return res.send('OK')
  })

  app.post('/messages', async (req, res) => {
    const messages = req.body.messages

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).send('Bad Request')
    }

    await sendMessages(messages);
    return res.send('OK')
  })

  app.listen(expressPort, async () => {
    await sleep(2000) // give time for serial port to connect
    console.log(`Arduino service is running at http://localhost:${expressPort}`)
  })
}

start()