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

const Option = (props) => {
  return (
    <SelectOption>
      <components.Option {...props}>
        {props.data && (
          <>
            <Icon icon={props.data.icon}/>
            {props.children}
          </>
        )}
      </components.Option>
    </SelectOption>
  );
};

const PostVisibilitySelect = forwardRef((props, ref) => {
  const {className = "", postType = "company", ...otherProps} = props;

  const {
    generalSettings: {dark_mode},
  } = useSettings();

  let components = {Option};
  const options = [{
    icon: "unlock",
    value: false,
    label: postType === "company" ? "Visible to all internal members" : "Visible to all workspace members"
  }, {
    icon: "lock",
    value: true,
    label: "Responsible users only"
  }];

  return <Select
    ref={ref} className={`react-select-container ${className}`}
    styles={dark_mode === "0" ? lightTheme : darkTheme} isMulti={false} isClearable={false}
    components={components}
    options={options}
    {...otherProps} />;
});

export default PostVisibilitySelect;
