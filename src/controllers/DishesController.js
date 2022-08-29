const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class DishesController {
  async create(request, response) {
    const { title, description, ingredients, price } = request.body;

    const { filename: imgFilename } = request.file;

    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(imgFilename);

    const dishes_id = await knex("dishes").insert({
      img: filename,
      title,
      description,
      price,
    });

    const ingredientsInsert = ingredients.map((name) => ({
      name,
      dishes_id,
    }));

    await knex("ingredients").insert(ingredientsInsert);

    return response.json();
  }

  async index(request, response) {
    const { title, ingredients } = request.query;

    let dishes;

    if (ingredients) {
      const filterIngredients = ingredients.split(",").map((tag) => tag.trim());

      dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.title",
          "dishes.description",
          "dishes.price",
          "dishes.img",
        ])
        .whereLike("dishes.title", `%${title}%`)
        .whereIn("name", filterIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dishes_id")
        .groupBy("dishes.id")
        .orderBy("dishes.title");
    } else {
      dishes = await knex("dishes")
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const listIngredients = await knex("ingredients");

    const dishesWithIngredients = dishes.map((dishe) => {
      const disheIngredients = listIngredients.filter(
        (ingredient) => ingredient.dishes_id === dishe.id
      );

      return {
        ...dishe,
        ingredients: disheIngredients,
      };
    });

    return response.json(dishesWithIngredients);
  }

  async show(request, response) {
    const { id } = request.params;

    const dishe = await knex("dishes").where({ id }).first();
    const ingredient = await knex("ingredients")
      .where({ dishes_id: id })
      .orderBy("name");

    return response.json({
      ...dishe,
      ingredient,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json();
  }

  async update(request, response) {
    const { title, description, ingredients, price } = request.body;
    const { id } = request.params;
    const { filename: imgFilename } = request.file;

    const diskStorage = new DiskStorage();

    const dishe = await knex("dishes").where({ id }).first();

    if (dishe.img) {
      await diskStorage.deleteFile(dishe.img);
    }

    const filename = await diskStorage.saveFile(imgFilename);

    dishe.img = filename;
    dishe.title = title ?? dishe.title;
    dishe.description = description ?? dishe.description;
    dishe.price = price ?? dishe.price;

    const ingredientsInsert = ingredients.map((name) => ({
      name,
      dishes_id: dishe.id,
    }));

    await knex("dishes").where({ id }).update(dishe);
    await knex("ingredients").where({ dishes_id: id }).delete();
    await knex("ingredients").insert(ingredientsInsert);

    return response.json();
  }
}
module.exports = DishesController;
