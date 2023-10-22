require('dotenv').config()
const axios = require('axios')
const { model } = require('../services/mongo')

exports.handler = async ({ queryStringParameters: { api_key: apiKey, page } }) => {
  try {
    if (!apiKey) {
      throw new Error('Missing api key')
    }

    if (apiKey !== process.env.API_KEY) {
      throw new Error('Api key is invalid')
    }

    if (!page || +page < 1) {
      throw new Error('Invalid parameter')
    }

    model.collection.drop()
    for (let p = 1; p <= page; p++) {
      try {
        const { data: { episodes } } = await axios.get(process.env.DATA_SRC, {
          params: {
            page: p
          }
        })
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