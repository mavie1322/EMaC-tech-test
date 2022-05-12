const supertest = require("supertest");
const server = require("../server");
const excludingIngredient = require("../utils/index,");

const request = supertest(server);

test("/api", async () => {
  const { body } = await request.get("/api").expect(200);
  expect(body.message).toBe("ok");
});
describe("/api/recipes", () => {
  test("returns all recipes", async () => {
    const { body } = await request.get("/api/recipes").expect(200);
    expect(Array.isArray(body.recipes)).toBe(true);
    expect(body.recipes).toHaveLength(100);
    body.recipes.forEach((recipe) => {
      expect(recipe).toEqual({
        id: expect.any(String),
        imageUrl: expect.any(String),
        instructions: expect.any(String),
        ingredients: expect.any(Array),
      });
      recipe.ingredients.forEach((ingredient) => {
        expect(ingredient).toEqual({
          name: expect.any(String),
          grams: expect.any(Number),
        });
      });
    });
  });

  test("returns error message when incorrect endpoint", async () => {
    const { body } = await request.get("/api/recipess").expect(404);
    expect(body.message).toBe("Invalid url");
  });

  test("returns list of recipes excluding specific ingredients", async () => {
    const { body } = await request
      .get("/api/recipes?exclude_ingredients=coffee")
      .expect(200);
  });
});

describe.only("test the function excludingIngredient", () => {
  test("should return empty array if the first parameter is empty array ", () => {
    const recipes = [];
    const ingredients = ["coffee"];
    expect(excludingIngredient(recipes, ingredients)).toEqual([]);
  });
  test("should return recipes if the ingredient array is empty array ", () => {
    const recipes = [
      {
        instructions:
          "60 seconds on the highest setting your blender has, or until a smooth paste has formed",
        ingredients: [
          { name: "demerara sugar", grams: 25 },
          { name: "flax", grams: 66 },
        ],
      },
    ];
    const ingredients = [];
    expect(excludingIngredient(recipes, ingredients)).toEqual(recipes);
  });
  test("should return recipes excluding the ingredients and the latter has one element", () => {
    const recipes = [
      {
        instructions: "spin it, twist it, pull it, flick it... bop it!",
        ingredients: [
          { name: "strawberries", grams: 187 },
          { name: "kale", grams: 41 },
        ],
      },
    ];
    const ingredients = ["kale"];
    // const output = [
    //   {
    //     instructions:
    //       "60 seconds on the highest setting your blender has, or until a smooth paste has formed",
    //     ingredients: [
    //       { name: "demerara sugar", grams: 25 },
    //       { name: "flax", grams: 66 },
    //     ],
    //   },
    // ];
    expect(excludingIngredient(recipes, ingredients)).toEqual([]);
    const recipe1 = [
      {
        instructions:
          "60 seconds on the highest setting your blender has, or until a smooth paste has formed",
        ingredients: [
          { name: "demerara sugar", grams: 25 },
          { name: "flax", grams: 66 },
        ],
      },
    ];
    const ingredients1 = ["coffee"];
    expect(excludingIngredient(recipe1, ingredients1)).toEqual(recipe1);
  });
});
