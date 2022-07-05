import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Select, { useTheme } from "react-select";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";

const Wrapper = styled.div`
  padding: 1rem;
  > div {
    margin-bottom: 1rem;
  }
`;

const SettingsBody = () => {
  const theme = useTheme();
  const generalSettings = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const { dark_mode } = generalSettings;
  const options = [
    {
      value: "Disable",
      label: "Disable",
    },
    {
      value: "Enable",
      label: "Enable",
    },
  ];
  const handleGoogleChange = () => {};
  return (
    <Wrapper>
      <h4>Login settings</h4>
      <div>
        <label>Google login</label>
        <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={options.find((o) => o.value === "Enable")} onChange={handleGoogleChange} options={options} menuColor={theme.colors.primary} />
      </div>
      <div>
        <label>Magic link</label>
        <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={options.find((o) => o.value === "Enable")} onChange={handleGoogleChange} options={options} menuColor={theme.colors.primary} />
      </div>
      <div>
        <label>Sign up</label>
        <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={options.find((o) => o.value === "Enable")} onChange={handleGoogleChange} options={options} menuColor={theme.colors.primary} />
      </div>
      <div>
        <label>Password login</label>
        <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={options.find((o) => o.value === "Enable")} onChange={handleGoogleChange} options={options} menuColor={theme.colors.primary} />
      </div>
    </Wrapper>
  );
};

export default SettingsBody;
