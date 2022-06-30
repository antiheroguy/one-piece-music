require('dotenv').config()
const axios = require('axios')
const model = require('./model');

(async () => {
    model.collection.drop()
    for (let p = 1; p <= process.env.VUE_APP_PAGE; p++) {
        let link = process.env.VUE_APP_DATA_SRC
        link += p > 1 ? '?page=' + p : ''

        try {
            const { data: { episodes } } = await axios.get(link)
            await model.insertMany(episodes)
            console.log(`${p}: OK`)
        } catch (err) {
            console.log(`${p}: ${err}`)
        }

    }
    process.exit(0)
})()