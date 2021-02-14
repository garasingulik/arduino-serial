#!/usr/bin/env node

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const expressPort = process.env.NODE_PORT

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 })
const parser = port.pipe(new Readline({ delimiter: '\n' }))

let displaying = false

parser.on('data', data => {
  console.log(`Arduino Response: ${data}`)
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
    // match the display time
    await sleep(displayTime)
    writeText(`${message}\n`)
  }
}

const start = async () => {
  app.get('/', (req, res) => {
    res.send('OK')
  })

  app.post('/messages', async (req, res) => {
    if (displaying) {
      return res.status(404).send('Unavailable')
    }

    displaying = true
    const messages = req.body.messages

    if (!messages || !Array.isArray(messages)) {
      displaying = false
      return res.status(400).send('Bad Request')
    }

    const formattedMessages = messages.map((m) => {
      return `${rightPad(m.key, 16)}${leftPad(m.value, 16)}`
    })

    await sendText(formattedMessages)

    displaying = false
    return res.send('OK')
  })

  app.listen(expressPort, async () => {
    await sleep(2000) // give time for serial port to connect
    console.log(`Arduino service is running at http://localhost:${expressPort}`)
  })
}

start()