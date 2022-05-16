export const selectTheme = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected && "#000000",
    backgroundColor: state.isSelected ? "gray" : "#000000",
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:hover": {
      backgroundColor: state.isSelected ? "gray" : "#000000",
      color: "#ffffff",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#000000" : "#000000",
    boxShadow: state.isFocused ? 0 : 0,
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:hover": {
      borderColor: state.isFocused ? "#000000" : "#000000",
    },
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
};

export const lightTheme = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected && "#ffffff",
    backgroundColor: state.isSelected ? "gray" : "#ffffff",
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:hover": {
      backgroundColor: state.isSelected ? "gray" : "#8C3B9B",
      color: "#ffffff",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "gray" : "#cccccc",
    boxShadow: state.isFocused ? 0 : 0,
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:hover": {
      borderColor: state.isFocused ? "gray" : "#cccccc",
    },
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
};

export const darkTheme = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected && "#000000",
    backgroundColor: state.isSelected ? "gray" : "#000000",
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:hover": {
      backgroundColor: state.isSelected ? "gray" : "#000000",
      color: "#ffffff",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "gray" : "#ffffff",
    boxShadow: state.isFocused ? 0 : 0,
    backgroundColor: "#111417",
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:hover": {
      borderColor: state.isFocused ? "gray" : "#ffffff",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#cbd4db",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#000000" : "#000000",
    boxShadow: state.isFocused ? 0 : 0,
    backgroundColor: "#25282c",
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:hover": {
      borderColor: state.isFocused ? "#fff" : "#fff",
    },
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#c7c7c7",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#111417",
    zIndex: 9999,
  }),
  dropdownItem: (provided) => ({
    ...provided,
    backgroundColor: "red",
  }),
};
