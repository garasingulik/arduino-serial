const exec = require('child_process').exec;

const execute = (command, callback) => {
  const cmd = exec(command, (error, stdout, stderr) => {
    console.log("error: " + error)
    callback(stdout)
  })
}

const reboot = () => {
  return new Promise((resolve, reject) => {
    try {
      execute('sudo reboot', (output) => {
        return resolve(output)
      })
    }
    catch (err) {
      console.log(err)
      return reject(err)
    }
  })
}

const fsck = () => {
  return new Promise((resolve, reject) => {
    try {
      execute('sudo touch /forcefsck', (output) => {
        return resolve(output)
      })
    }
    catch (err) {
      console.log(err)
      return reject(err)
    }
  })
}

module.exports = {
  execute,
  fsck,
  reboot
}
