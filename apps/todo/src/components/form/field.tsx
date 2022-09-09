import { fieldSet, label } from "./field.css";
interface Props {
  name: string;
  label: string;
}
export const TextField = ({ name, label }: Props): JSX.Element => {
  return (
    <div className={fieldSet}>
      <label htmlFor={name} className={label}>
        {label}
      </label>
      <input type="text" name={name} id={name} />
    </div>
  );
};

export const TextAreaField = ({ name, label }: Props): JSX.Element => {
  return (
    <div className={fieldSet}>
      <label htmlFor={name} className={label}>
        {label}
      </label>
      <textarea name={name} id={name} />
    </div>
  );
};
