const supertest = require("supertest");
const server = require("../server");

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
});
