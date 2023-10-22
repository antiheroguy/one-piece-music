require('dotenv').config()
const axios = require('axios')
const { model } = require('../services/mongo')

exports.handler = async ({ queryStringParameters: { api_key: apiKey, from = 1, to } }) => {
  try {
    if (!apiKey) {
      throw new Error('Missing api key')
    }

    if (apiKey !== process.env.API_KEY) {
      throw new Error('Api key is invalid')
    }

    if (!to || +to < 1 || (+from > +to)) {
      throw new Error('Invalid parameter')
    }

    model.collection.drop()
    for (let page = from; page <= to; page++) {
      try {
        const { data: { episodes } } = await axios.get(process.env.DATA_SRC, { params: { page } })
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