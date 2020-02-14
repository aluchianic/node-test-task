const fs = require('fs')

const parseContacts = () => new Promise((resolve, reject) => {
    const data = {}

    fs.readFile('contacts.csv', 'utf-8', (err, content) => {
        if (err) reject(err)

        const lines = content.split('\n')
        lines.forEach((line, index) => {
            if (index !== 0) {
                const cell = line.split(',').filter((x, index) => (index === 1 || index === 4))
                if (cell[0] !== '') {
                    data[cell[0]] = { 'name': cell[1] }
                }
            }
        })
        resolve(data)
    })
})

const parsePhones = (parsedContacts) => new Promise((resolve, reject) => {
    fs.readFile('phones.csv', 'utf-8', (err, content) => {
        if (err) reject(err)

        const lines = content.split('\n')
        lines.forEach((line, index) => {
            if (index !== 0) {
                const cell = line.split(',').filter((x, index) => (index === 2 || index === 8 || index === 9))
                
                if (cell[0] !== '') {
                    if (!parsedContacts[cell[0]].phones) {
                        parsedContacts[cell[0]]['phones'] = []
                    }
                    parsedContacts[cell[0]]['phones'].push({ [cell[2]]: cell[1] })
                }
            }
        })  
        resolve(parsedContacts)
    })
})

parseContacts().then(parsedContacts => {
    parsePhones(parsedContacts).then(data => {
        fs.writeFile('data.json', JSON.stringify(data, null, 2) , (err, res) => {
            if (err) {
                return console.error(err)
            }

            return console.log('Done !')
        })
    })
})
