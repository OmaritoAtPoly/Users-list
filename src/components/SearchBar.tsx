import type { ChangeEvent } from "react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder,
}: SearchBarProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor="user-search">Search by name</label>
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
