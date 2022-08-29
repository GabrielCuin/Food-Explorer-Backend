const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const authConfig = require("../config/auth");

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    const checkedUser = await knex("users").where({ email }).first();

    if (!checkedUser) {
      throw new AppError("Email e/ou senha incorreto(s).", 401);
    }

    const matchedPassword = await compare(password, checkedUser.password);

    if (!matchedPassword) {
      throw new AppError("Email e/ou senha incorreto(s).", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: String(checkedUser.id),
      expiresIn,
    });

    return response.json({ checkedUser, token });
  }
}

module.exports = SessionsController;
