import { ChangeEvent } from "react";
import { TagOutputDto } from "../../types/dtos.type";

interface Props {
  value?: string[];
  onChange?: (event: ChangeEvent) => void;
  options: TagOutputDto[];
}

export const TagsSelect = (props: Props) => {
  return (
    <div className="mb-5">
      <label htmlFor="tags" className="form-label">
        Etiquetas
      </label>
      <select
        multiple
        size={4}
        className="form-select"
        id="tags"
        name="tags"
        value={props.value}
        onChange={props.onChange}
      >
        {props.options.map((tag) => (
          <option value={tag.id}>{tag.name}</option>
        ))}
        <option value={-1} style={{ backgroundColor: "lightblue" }}>
          Criar nova Etiqueta...
        </option>
      </select>
      <small>
        Para seleccionar várias Etiquetas, mantenha a tecla <strong>Ctrl</strong> carregada antes de
        seleccionar cada Etiqueta.
      </small>
    </div>
  );
};

export default TagsSelect;
