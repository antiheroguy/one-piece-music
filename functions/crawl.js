require('dotenv').config()
const axios = require('axios')
const { model } = require('./services/mongo')

exports.handler = async ({ queryStringParameters: { api_key: apiKey, page } }) => {
  try {
    if (!apiKey) {
      throw new Error('Missing api key')
    }

    if (apiKey !== process.env.API_KEY) {
      throw new Error('Api key is invalid')
    }

    if (!page || !Number.isInteger(page) || page < 1) {
      throw new Error('Invalid parameter')
    }

    model.collection.drop()
    for (let p = 1; p <= page; p++) {
      const params = {}
      if (p > 1) {
        params.page = p
      }

      try {
        const { data: { episodes } } = await axios.get(process.env.DATA_SRC, { params })
        await model.insertMany(episodes)
      } catch (err) {
        // Do nothing
      }
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