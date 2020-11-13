import React, { forwardRef } from "react";
import Select, { components } from "react-select";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../common";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";
import { useSettings } from "../hooks";

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
  width: 2rem;
  height: 2rem;
`;

const LockIcon = styled(SvgIconFeather)`
  width: 1rem;
  height: 1rem;
  margin-left: 5px;
`;

const StyledAvatar = styled(Avatar)`
  min-width: 1.75rem;
  min-height: 1.75rem;
  margin: -2px 10px 0 0;
  border: none;
  color: #505050 !important;
  max-width: 2rem;
  max-height: 2rem;
`;

const Option = (props) => {
  return (
    <SelectOption>
      <components.Option {...props}>
        {props.data && (
          <span className="d-flex justify-content-start align-items-center">
            {
              props.data.icon === "user-avatar" ?
                <StyledAvatar className="react-select-avatar mr-2" key={props.data.id}
                              imageLink={props.data.profile_image_thumbnail_link ? props.data.profile_image_thumbnail_link : props.data.profile_image_link}
                              name={props.data.name} partialName={props.data.partial_name}/> :
                <Icon className="mr-2" icon={props.data.icon ? props.data.icon : "folder"}/>
            }
            {props.children}
            {props.data.is_lock === 1 && <LockIcon className="ml-2" icon="lock" strokeWidth="2"/>}
          </span>
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
