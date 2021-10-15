import { ChangeEvent } from "react";
import { IngredientOutputDto, RecipeIngredientInputDto } from "../../types/dtos.type";

interface Props {
  recipeIngredients: RecipeIngredientInputDto[];
  options: IngredientOutputDto[];
  onChangeIngredient: (event: ChangeEvent, index: number) => void;
  onCreateNewIngredient: (index: number) => void;
}

export const RecipeIngredientsInput = (props: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor="ingredients" className="form-label">
        Ingredientes
      </label>
      {props.recipeIngredients.map((recipeIngredient, index) => (
        <div className="row mb-2">
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              id={`ingredient.quantity-${index}`}
              name="quantity"
              key={index}
              placeholder="quantidade"
              value={recipeIngredient.quantity}
              onChange={(event) => {
                props.onChangeIngredient(event, index);
              }}
            />
          </div>

          <div className="col d-flex align-items-center justify-content-center">de</div>

          <div className="col-sm-4">
            <select
              className="form-select"
              id={`ingredient.ingredient-${index}`}
              name={`ingredientId`}
              key={index}
              value={recipeIngredient.ingredientId}
              onChange={(event) => {
                props.onChangeIngredient(event, index);
              }}
            >
              <option value="">Seleccione o Ingrediente</option>
              {props.options.map((ingredient) => (
                <option value={ingredient.id}>{ingredient.name}</option>
              ))}
              <option
                value={-1}
                style={{ backgroundColor: "lightblue" }}
                onClick={() => {
                  props.onCreateNewIngredient(index);
                }}
              >
                Criar novo Ingrediente...
              </option>
            </select>
          </div>

          <div className="col-sm-4">
            <input
              type="text"
              className="form-control"
              id={`ingredient.specification-${index}`}
              name={`specification`}
              placeholder="detalhes (opcional)"
              key={index}
              value={recipeIngredient.specification}
              onChange={(event) => {
                props.onChangeIngredient(event, index);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeIngredientsInput;
