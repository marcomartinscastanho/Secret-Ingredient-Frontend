import { ChangeEvent } from "react";
import { IngredientOutputDto, RecipeIngredientInputDto } from "../../types/dtos.type";

interface Props {
  recipeIngredients: RecipeIngredientInputDto[];
  options: IngredientOutputDto[];
  onAddIngredient: () => void;
  onChangeIngredient: (event: ChangeEvent, index: number) => void;
  onRemoveIngredient: (index: number) => void;
}

export const RecipeIngredientsInput = (props: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor="ingredients" className="form-label">
        Ingredientes
      </label>
      {props.recipeIngredients.map((recipeIngredient, index) => (
        <div className="row mb-3">
          <div className="col-sm-2">
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

          <div className="col-sm-1 d-flex align-items-center justify-content-center">de</div>

          <div className="col-sm-4">
            <select
              className="form-select"
              id={`ingredient.ingredient-${index}`}
              name={`ingredient`}
              key={index}
              value={recipeIngredient.ingredientId}
              onChange={(event) => {
                props.onChangeIngredient(event, index);
              }}
            >
              <option>Seleccione o Ingrediente</option>
              {props.options.map((ingredient) => (
                <option value={ingredient.id}>{ingredient.name}</option>
              ))}
              <option value={-1} style={{ backgroundColor: "lightblue" }}>
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
          {index === props.recipeIngredients.length - 1 && (
            <div className="col-sm-1 text-end">
              <button className="btn btn-primary" onClick={props.onAddIngredient}>
                <strong>&#65291;</strong>
              </button>
            </div>
          )}
          {index < props.recipeIngredients.length - 1 && (
            <div className="col-sm-1 text-end">
              <button className="btn btn-danger" onClick={() => props.onRemoveIngredient(index)}>
                <strong>&#10005;</strong>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecipeIngredientsInput;
