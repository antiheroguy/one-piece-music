const { model } = require('../services/mongo')

exports.handler = async () => {
  try {
    const list = await model.find().select('episode').sort({ 'episode': 'desc' }).exec()
    if (!list?.length) {
      throw new Error('No item found')
    }

    return {
      statusCode: 200,
      body: JSON.stringify(list),
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message,
    }
  }
}