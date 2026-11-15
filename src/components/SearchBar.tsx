import type { ChangeEvent } from "react";
import "./styles/SearchBar.css";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor="user-search" className="label-text">
        Search by name
      </label>
      <input
        id="user-search"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search by name"
      />
    </div>
  );
};

export default SearchBar;
