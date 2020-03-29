const crypto = require('crypto')
const connection = require('../database/connection')

module.exports = {
  async create(request, response) {
    const { name, email, whatsapp, city, uf } = request.body

    const id = crypto.randomBytes(4).toString('HEX')
  
    await connection('ongs').insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf
    })
  
    return response.json({ id })
  },

  async index(request, response) {
    const ongs = await connection('ongs').select('*')

    return response.json(ongs)
  },

  async destroy(request, response) {
    const ong_id = request.headers.authorization

    const ong = await connection('ongs')
      .where('id', ong_id)
      .select('id')
      .first()

    if (!ong) {
      return response.status(401).json({
        error: 'Operation not permited'
      })
    }

    await connection('ongs').where('id', ong_id).del()

    return response.status(204).send()
  }
}