import { TagOption, TagOutputDto } from "../../types/dtos.type";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, OnChangeValue } from "react-select";
import "./Select.css";

interface Props {
  value?: TagOption[];
  handleChange?: (
    newValue: OnChangeValue<TagOption, true>,
    actionMeta: ActionMeta<TagOption>
  ) => void;
  handleCreateOption?: (newTag: string) => void;
  options: TagOutputDto[];
}

export const TagsSelect = (props: Props) => {
  return (
    <div className="mb-5">
      <label htmlFor="tags" className="form-label">
        Etiquetas
      </label>
      <CreatableSelect
        isMulti
        name="tags"
        id="tags"
        value={props.value}
        onChange={props.handleChange}
        onCreateOption={props.handleCreateOption}
        options={props.options.map((tag) => ({ value: tag.id, label: tag.name }))}
        placeholder="Seleccione uma ou mais Etiquetas"
        formatCreateLabel={(inputValue) => {
          return `Criar a Etiqueta "${inputValue}"`;
        }}
      />
    </div>
  );
};

export default TagsSelect;
