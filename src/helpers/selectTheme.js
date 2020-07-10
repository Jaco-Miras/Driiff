export const selectTheme = {
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected && "#ffffff",
        backgroundColor: state.isSelected ? "#7a1b8b" : "#ffffff",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover":{
            backgroundColor: state.isSelected ? "#7a1b8b" : "#8C3B9B",
            color: "#ffffff",
        }
    }),
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? "#7a1b8b" : "#cccccc",
        boxShadow: state.isFocused ? 0 : 0,
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": {
            borderColor: state.isFocused ? "#7a1b8b" : "#cccccc",
        }
    })
};