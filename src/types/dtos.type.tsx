export type RecipeDto = {
  id: string;

  title: string;

  portions: number;

  tags: TagDto[];

  description: string;

  preparationTime: number;

  cookingTime: number;

  ingredients: RecipeIngredientDto[];

  preparationSteps: string[];

  user: string;
};

export type TagDto = {
  id: string;

  name: string;

  popularity: number;
};

export type RecipeIngredientDto = {
  quantity: string;

  ingredient: IngredientDto;

  specification: string;
};

export type IngredientDto = {
  id: string;

  name: string;

  popularity: number;
};
