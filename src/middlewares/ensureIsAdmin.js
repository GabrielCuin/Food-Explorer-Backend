const knex = require('../database/knex');
const AppError = require('../utils/AppError');

async function ensureIsAdmin(request, response, next) {
  const { id } = request.user;

  const user = await knex('users').where({ id });

  const isAdmin = user[0].is_admin;

  if (isAdmin === 0) {
    throw new AppError('Você não é um administrador', 401);
  }

  return next();
}

module.exports = ensureIsAdmin;