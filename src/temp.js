const fs = require('fs')

const source = fs.readFileSync('./list.txt', {encoding: 'utf-8'})

const list = source.split('\r\n').map(e => e.trim())

const output = JSON.stringify(list, null, 2)

fs.writeFileSync('./wordleMain.txt', output)