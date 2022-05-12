const excludingIngredient = (recipes, ingredient) => {
  if (recipes.length === 0) return [];
  if (ingredient.length === 0) return recipes;
  return recipes.filter((recipe) => {
    recipe.ingredients.map((element) => {
      if (!Object.values(element).includes(ingredient[0])) return recipe;
    });
  });
};

module.exports = excludingIngredient;
