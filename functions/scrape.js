require('dotenv').config()
const axios = require('axios')
const { model, page } = require('../services/mongo')

exports.handler = async () => {
  try {
    const bulkOps = [];

    let number = 1
    const maxNumberPage = await page.findOne().sort({ number: -1 })
    if (maxNumberPage) {
      number = maxNumberPage.number + 1
    }

    const { data: { episodes } } = await axios.get(process.env.DATA_SRC, { params: { page: number } });
    episodes.forEach(episode => {
      bulkOps.push({
        updateOne: {
          filter: { episode: episode.episode },
          update: { $set: episode },
          upsert: true
        }
      });
    });
    
    if (!bulkOps.length) {
      await page.collection.drop()
    } else {
      await model.bulkWrite(bulkOps);
      await page.create({ number })
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success',
      }),
    }
  } catch ({ message }) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message }),
    }
  }
}