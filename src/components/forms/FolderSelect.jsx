import React, {forwardRef} from "react";
import Select, {components} from "react-select";
import styled from "styled-components";
import {SvgIconFeather} from "../common";
import {darkTheme, lightTheme} from "../../helpers/selectTheme";
import {useSettings} from "../hooks";

const SelectOption = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  transition: background 0.15s ease;
  svg {
    transition: none;
  }
  &:hover {
    background: #25282c;
    svg {
      color: #ffffff;
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  min-width: 1.75rem;
  min-height: 1.75rem;
  margin: -2px 10px 0 0;
  border: none;
`;

const LockIcon = styled(SvgIconFeather)`
  width: 1rem;
  height: 1rem;
  margin-left: 5px;
`;

const Option = (props) => {
  return (
    <SelectOption>
      <components.Option {...props}>
        {props.data && (
          <>
            <Icon icon={props.data.icon ? props.data.icon : "folder"} />
            {props.children}
            {props.data.is_lock === 1 && <LockIcon icon="lock" strokeWidth="2"/>}
          </>
        )}
      </components.Option>
    </SelectOption>
  );
};

const MultiValueContainer = ({ children, selectProps, ...props }) => {
  return <components.MultiValueContainer {...props}>{children}</components.MultiValueContainer>;
};

const FolderSelect = forwardRef((props, ref) => {
  const { className = "", isMulti = false, isClearable = false, ...otherProps } = props;

  const {
    generalSettings: { dark_mode },
  } = useSettings();

  let components = { Option };

  if (isMulti) {
    components = { Option, MultiValueContainer };
  }

  return <Select ref={ref} className={`react-select-container ${className}`} styles={dark_mode === "0" ? lightTheme : darkTheme} isMulti={isMulti} isClearable={isClearable} components={components} {...otherProps} />;
});

export default FolderSelect;
