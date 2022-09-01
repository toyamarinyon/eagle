import { fieldSet, label } from "./field.css";
export const FormField = (): JSX.Element => {
  return (
    <div className={fieldSet}>
      <label htmlFor="name" className={label}>
        Username
      </label>
      <input type="text" name="name" id="name" />
    </div>
  );
};
