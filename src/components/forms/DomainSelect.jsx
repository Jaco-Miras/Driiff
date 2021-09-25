import React, { forwardRef } from "react";
import { components } from "react-select";
import styled from "styled-components";
import { useSettings } from "../hooks";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";
import CreatableSelect from "react-select/creatable";

const SelectOption = styled.div`
  display: flex;
  align-items: center;
  &:hover {
    background: #deebff;
  }
  > div {
    display: flex;
    align-items: center;
  }

  .workspaces {
    display: block;
    font-size: 12px;
    width: 100%;
  }
`;

const Option = (props) => {
  return (
    <SelectOption>
      <components.Option {...props}>{props.children}</components.Option>
    </SelectOption>
  );
};

const MultiValueLabel = ({ children, selectProps, ...props }) => {
  return (
    <div>
      <components.MultiValueLabel {...props}>{children}</components.MultiValueLabel>
    </div>
  );
};

const DomainSelect = forwardRef((props, ref) => {
  const { className = "", isMulti = true, isClearable = false, ...otherProps } = props;
  const {
    generalSettings: { dark_mode },
  } = useSettings();

  return (
    <CreatableSelect
      ref={ref}
      className={`react-select-container ${className}`}
      styles={dark_mode === "0" ? lightTheme : darkTheme}
      isMulti={isMulti}
      isClearable={isClearable}
      components={{ Option, MultiValueLabel }}
      {...otherProps}
      onCreateOption={props.onCreateOption}
      onEmailClick={props.onEmailClick}
    />
  );
});

export default DomainSelect;
