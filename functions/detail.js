const { model } = require('../services/mongo')

exports.handler = async ({ episode }) => {
  try {
    const item = episode !== null ?
      await model.findOne({ episode }).exec()
      : await model.findOne().sort({ episode: 'desc' }).exec()
    if (!item) {
      throw new Error('Model not found')
    }

    return {
      statusCode: 200,
      body: JSON.stringify(item),
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message,
    }
  }
}