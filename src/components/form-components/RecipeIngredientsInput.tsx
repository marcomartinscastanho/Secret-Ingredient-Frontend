import { ChangeEvent } from "react";
import { createFilter, OnChangeValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import {
  IngredientOutputDto,
  RecipeIngredientOutputDto,
  SelectOption,
} from "../../types/dtos.type";

interface Props {
  recipeIngredients: RecipeIngredientOutputDto[];
  options: IngredientOutputDto[];
  onChangeIngredient: (event: ChangeEvent, recipeIngredientIndex: number) => void;
  onSelectIngredient: (newValue: OnChangeValue<SelectOption, false>, index: number) => void;
  onCreateOption: (name: string, recipeIngredientIndex: number) => void;
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
            <CreatableSelect
              id={`ingredient.ingredient-${index}`}
              name="ingredient"
              value={{
                value: recipeIngredient.ingredient.id,
                label: recipeIngredient.ingredient.name,
              }}
              onChange={(newValue) => props.onSelectIngredient(newValue, index)}
              onCreateOption={(inputValue) => props.onCreateOption(inputValue, index)}
              options={props.options.map((ingredient) => ({
                value: ingredient.id,
                label: ingredient.name,
              }))}
              placeholder="Seleccione o Ingrediente" // FIXME: not working
              formatCreateLabel={(inputValue) => {
                return `Criar o Ingrediente "${inputValue}"`;
              }}
              filterOption={createFilter({ matchFrom: "start" as const })}
            />
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
