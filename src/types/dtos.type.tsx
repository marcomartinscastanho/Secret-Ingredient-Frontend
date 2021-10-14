export type RecipeInputDto = {
  id?: string;

  title: string;

  portions?: number;

  tags: TagOption[];

  description: string;

  preparationTime?: number;

  cookingTime?: number;

  ingredients: RecipeIngredientInputDto[];

  preparationSteps: string[];

  user?: string;
};

export type RecipeOutputDto = {
  id: string;

  title: string;

  portions: number;

  tags: TagOutputDto[];

  description: string;

  preparationTime: number;

  cookingTime: number;

  ingredients: RecipeIngredientOutputDto[];

  preparationSteps: string[];

  user: string;
};

export type TagInputDto = {
  name: string;
};

export type TagOutputDto = {
  id: string;

  name: string;

  popularity?: number;
};

export type RecipeIngredientInputDto = {
  quantity: string;

  ingredientId: string;

  specification?: string;
};

export type RecipeIngredientOutputDto = {
  quantity: string;

  ingredient: IngredientOutputDto;

  specification?: string;
};

export type IngredientInputDto = {
  name: string;
};

export type IngredientOutputDto = {
  id: string;

  name: string;

  popularity?: number;
};

export type RestError = {
  error?: any;
  message: string;
};

export type TagOption = {
  label: string;
  value: string;
};
