import React, { forwardRef } from "react";
import Select, { components } from "react-select";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../common";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";
import { useSettings } from "../hooks";
import AsyncCreatableSelect from "react-select/async-creatable";

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
  .react-select__option--is-selected {
    background-color: ${(props) => props.theme.colors.primary}!important;
  }
`;

const Icon = styled(SvgIconFeather)`
  min-width: 24px;
  min-height: 24px;
  margin: -2px 10px 0 0;
  border: none;
  width: 24px;
  height: 24px;
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

const MultiValueWrapper = styled.div`
  svg {
    width: 0.8rem;
    height: 0.8rem;
  }
  .value-remove {
    > div:first-child {
      display: none;
    }
    > div:last-child:hover {
      background-color: ${(props) => (props.isPrivate ? "#1E90FF" : props.theme.colors.primary)};
      color: #fff;
    }
    display: flex;
    align-items: center;
    -webkit-box-align: center;
    align-items: center;
    border-radius: 2px;
    display: flex;
    box-sizing: border-box;
    :hover {
      // background-color: rgb(255, 189, 173);
      // color: rgb(222, 53, 11);
      background-color: ${(props) => (props.isPrivate ? "#1E90FF" : props.theme.colors.primary)};
      color: #fff;
    }
  }
  ${(props) =>
    props.isPrivate &&
    `
      > div {
        background: #f44;
        color: #fff;
      }
    `}
`;

const MultiValueLabelWrapper = styled.div`
  padding: 0 5px;
  display: flex;
  align-items: center;
  ${(props) =>
    props.isPrivate &&
    `
      background: #f44;
      color: #fff;
    `}
`;

const Option = (props) => {
  return (
    <SelectOption>
      <components.Option {...props}>
        {props.data && (
          <span className="d-flex justify-content-start align-items-center">
            {props.data.icon === "user-avatar" ? (
              <StyledAvatar
                className="react-select-avatar mr-2"
                key={props.data.id}
                imageLink={props.data.profile_image_thumbnail_link ? props.data.profile_image_thumbnail_link : props.data.profile_image_link}
                name={props.data.name}
                partialName={props.data.partial_name}
              />
            ) : (
              <Icon className="mr-2" icon={props.data.icon ? props.data.icon : "folder"} />
            )}
            {props.children}
            {props.data.is_lock === 1 && <LockIcon className="ml-1" icon="lock" strokeWidth="2" width="12" />}
            {props.data.is_shared && <LockIcon className="ml-1" icon="eye" strokeWidth="2" width="12" />}
            {props.data.huddle && <LockIcon className="ml-1" icon="cpu" strokeWidth="2" width="12" />}
          </span>
        )}
      </components.Option>
    </SelectOption>
  );
};

const MultiValueContainer = ({ children, selectProps, ...props }) => {
  return (
    <MultiValueWrapper isPrivate={props.data.is_lock === 1}>
      <components.MultiValueContainer {...props}>
        <components.MultiValueLabel {...props}>
          <MultiValueLabelWrapper isPrivate={props.data.is_lock === 1}>
            {props.data.label}
            {props.data.is_lock === 1 && <LockIcon className="ml-1" icon="lock" strokeWidth="2" width="12" height="12" />}
            {props.data.is_shared && <LockIcon className="ml-1" icon="eye" strokeWidth="2" width="12" height="12" />}
          </MultiValueLabelWrapper>
        </components.MultiValueLabel>
        <components.MultiValueRemove {...props} innerProps={{ className: "value-remove" }}>
          {children}
        </components.MultiValueRemove>
      </components.MultiValueContainer>
    </MultiValueWrapper>
  );
};

const FolderSelect = forwardRef((props, ref) => {
  const { className = "", isMulti = false, isClearable = false, creatable = false, isDisabled = false, ...otherProps } = props;

  const {
    generalSettings: { dark_mode },
  } = useSettings();

  let components = { Option };

  if (isMulti) {
    components = { Option, MultiValueContainer };
  }

  if (creatable) {
    return (
      <AsyncCreatableSelect
        ref={ref}
        className={`react-select-container ${className}`}
        classNamePrefix="react-select"
        styles={dark_mode === "0" ? lightTheme : darkTheme}
        isMulti={isMulti}
        isClearable={isClearable}
        components={components}
        isDisabled={isDisabled}
        {...otherProps}
      />
    );
  } else {
    return (
      <Select
        ref={ref}
        className={`react-select-container ${className}`}
        styles={dark_mode === "0" ? lightTheme : darkTheme}
        isMulti={isMulti}
        isClearable={isClearable}
        isDisabled={isDisabled}
        components={components}
        {...otherProps}
      />
    );
  }
});

export default FolderSelect;
