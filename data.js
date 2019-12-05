require('dotenv').config();
const axios = require('axios');
const model = require('./model');

(async () => {
    model.collection.drop();
    for (let p = 1; p <= process.env.VUE_APP_PAGE; p++) {
        let episodes = [];
        let link = process.env.VUE_APP_DATA_SRC;
        link += p > 1 ? '?page=' + p : '';

        await axios({
            url: link
        }).then(res => {
            episodes = res.data.episodes;
        }).catch(err => {
            console.log(`${p}: ${err}`);
        });

        await model.insertMany(episodes).then(() => console.log(`${p}: OK`));
    }
    process.exit(0);
})();