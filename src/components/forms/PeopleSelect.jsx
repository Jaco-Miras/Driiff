import React, { forwardRef } from "react";
import Select, { components } from "react-select";
import styled from "styled-components";
import { Avatar } from "../common";
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
          <>
            <StyledAvatar
              className="react-select-avatar"
              key={props.data.id}
              imageLink={props.data.profile_image_thumbnail_link ? props.data.profile_image_thumbnail_link : props.data.profile_image_link}
              name={props.data.name}
              partialName={props.data.partial_name}
            />
            <div>
              {props.children}
              {props.data.has_accepted && props.data.type === "external" && <div className={"ml-1 badge badge-info"}>{props.data.dictionary && props.data.dictionary.peopleExternal}</div>}
              {!props.data.has_accepted && props.data.type === "external" && <div className={"ml-1 badge badge-info"}>{props.data.dictionary && props.data.dictionary.peopleInvited}</div>}
              {props.data.workspaces && props.data.workspaces.length && <span className="workspaces">{props.data.workspaces && props.data.workspaces.join(", ")}</span>}
            </div>
          </>
        )}
      </components.Option>
    </SelectOption>
  );
};

const MultiValueLabel = ({ children, selectProps, ...props }) => {
  const handleClick = () => {
    if (!props.data.has_accepted && typeof props.data.id === "string") {
      selectProps.onEmailClick(props.data);
    }
  };
  return (
    <div onClick={handleClick} className={!props.data.has_accepted && typeof props.data.id === "string" ? "has-not-accepted" : "has-accepted"}>
      <components.MultiValueLabel {...props}>{children}</components.MultiValueLabel>
    </div>
  );
};

const MultiValueContainer = ({ children, selectProps, ...props }) => {
  let newChildren = children.map((c, i) => {
    if (i === 0) {
      const valueLabel = props.data.name.trim() !== "" ? `${props.data.first_name} ${props.data.middle_name} ${props.data.last_name}` : props.data.email;
      return {
        ...c,
        props: {
          ...c.props,
          children: valueLabel,
        },
      };
    } else return c;
  });
  return <components.MultiValueContainer {...props}>{newChildren}</components.MultiValueContainer>;
};

const PeopleSelect = forwardRef((props, ref) => {
  const { className = "", isMulti = true, isClearable = false, creatable = false, ...otherProps } = props;
  const {
    generalSettings: { dark_mode },
  } = useSettings();

  if (creatable) {
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
  } else {
    return <Select ref={ref} className={`react-select-container ${className}`} styles={dark_mode === "0" ? lightTheme : darkTheme} isMulti={isMulti} isClearable={isClearable} components={{ Option, MultiValueContainer }} {...otherProps} />;
  }
});

export default PeopleSelect;
