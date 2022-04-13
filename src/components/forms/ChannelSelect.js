import React, { forwardRef } from "react";
import Select, { components } from "react-select";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../common";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";
import { useSettings, useTranslationActions } from "../hooks";
import AsyncSelect from "react-select/async";

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

const LockIcon = styled(SvgIconFeather)`
  width: 1rem;
  height: 1rem;
  margin-left: 5px;
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

const AvatarWrapper = styled.div`
  position: relative;
  line-height: 0;
  > span {
    font-size: 13px;
    background-color: ${(props) => (props.iconColor ? props.iconColor : "#fff")};
    color: #fff;
    display: inline-flex;
    padding: 5px;
    border-radius: 100%;
    width: 2.7rem;
    height: 2.7rem;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  > svg {
    padding: 6px;
    background-color: ${(props) => (props.iconColor ? props.iconColor : props.iconColor)};
    border-radius: 50%;
    &.dark {
      background-color: ${(props) => (props.iconColor ? props.iconColor : props.iconColor)};
    }
    &.feather-eye,
    &.feather-eye-off {
      padding: 0;
      background-color: #fff;
      border: 2px solid #fff;
      color: ${(props) => props.theme.colors.primary};
      .dark & {
        background-color: #191c20;
        color: #fff;
        border: 2px solid #191c20;
      }
    }
  }
  .chat-header-icon-left & {
    span {
      width: 28px;
      height: 28px;
    }
  }
`;
const AvatarIcon = styled(SvgIconFeather)`
  color: #ffffff !important;
  height: 2.7rem;
  width: 2.7rem;
  &.feather-home {
    background: ${(props) => props.theme.colors.primary};
    padding: 6px 0;
  }
  .chat-header-icon-left & {
    height: 28px;
    width: 28px;
  }
`;

const StyledBadge = styled.div`
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 5px !important;
  color: #363636;
  font-size: 10px;
  letter-spacing: 0;
  line-height: 12px;
  ${(props) => props.isTeam && "background:#D1EEFF !important;"}
`;

const EyeIcon = styled(SvgIconFeather)`
  width: 0.7rem;
  height: 0.7rem;
`;

const iconColor = (input) => {
  const name = input.replace(/\s/g, "");
  if (typeof name === "undefined") return "";
  let h = "";
  let s = 50;
  let l = 40;

  var hash = 0;
  for (var i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  h = hash % 360;

  return `hsla(${h}, ${s}%, ${l}%, 0.8)`;
};

const Option = (props) => {
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const { _t } = useTranslationActions();

  const dictionary = {
    withTeam: _t("CHANNEL.WITH_TEAM", "Team Chat"),
    withClient: _t("CHANNEL.WITH_CLIENT", "Client Chat"),
  };

  return (
    <SelectOption>
      <components.Option {...props}>
        {props.data && (
          <span className="d-flex justify-content-start align-items-center">
            {props.data.profile && props.data.members.length >= 1 && props.data.type === "DIRECT" && (
              <Avatar imageLink={props.data.profile.profile_image_link} userId={props.data.profile.id} id={props.data.profile.id} name={props.data.profile.name} partialName={props.data.profile.partial_name} type="USER" showSlider={false} />
            )}
            {(props.data.type === "DIRECT_TEAM" || props.data.type === "TEAM") && <Avatar imageLink={props.data.icon_link} name={props.data.title} type="TEAM" showSlider={false} />}
            {props.data.type === "GROUP" &&
              (props.data.icon_link ? (
                <Avatar forceThumbnail={false} type={props.data.type} imageLink={props.data.icon_link} id={`ws_${props.data.id}`} name={props.data.title} noDefaultClick={false} showSlider={false} />
              ) : (
                <AvatarWrapper className={"pr-3"} iconColor={iconColor(props.data.title)}>
                  <AvatarIcon icon="users" alt={props.data.title} />
                </AvatarWrapper>
              ))}
            {props.data.type === "COMPANY" && (
              <AvatarWrapper className={"pr-3"} iconColor={iconColor(props.data.title)}>
                <AvatarIcon icon="home" alt={props.data.title} />
              </AvatarWrapper>
            )}
            {props.data.type === "PERSONAL_BOT" && (
              <AvatarWrapper className={"pr-3"} iconColor={iconColor(props.data.title)}>
                <AvatarIcon icon="user" alt={props.data.title} />
              </AvatarWrapper>
            )}
            {props.data.type === "TOPIC" && <Avatar forceThumbnail={false} type={props.data.type} imageLink={props.data.icon_link} id={`ws_${props.data.id}`} name={props.data.title} noDefaultClick={false} showSlider={false} />}

            <span className="ml-2">{props.children}</span>
            {props.data.type === "TOPIC" && workspaces.hasOwnProperty(props.data.entity_id) && workspaces[props.data.entity_id].is_shared && (
              <StyledBadge className={"badge badge-external ml-1"} isTeam={props.data.team ? true : false}>
                <EyeIcon icon={props.data.team ? "eye-off" : "eye"} className={"mr-1"} />
                {props.data.team ? dictionary.withTeam : dictionary.withClient}
              </StyledBadge>
            )}
          </span>
        )}
      </components.Option>
    </SelectOption>
  );
};

const SingleValue = ({ children, ...props }) => {
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const { _t } = useTranslationActions();

  const dictionary = {
    withTeam: _t("CHANNEL.WITH_TEAM", "Team Chat"),
    withClient: _t("CHANNEL.WITH_CLIENT", "Client Chat"),
  };
  return (
    <components.SingleValue {...props}>
      {children}
      {props.data.type === "TOPIC" && workspaces.hasOwnProperty(props.data.entity_id) && workspaces[props.data.entity_id].is_shared && (
        <StyledBadge className={"badge badge-external ml-1"} isTeam={props.data.team ? true : false}>
          <EyeIcon icon={props.data.team ? "eye-off" : "eye"} className={"mr-1"} />
          {props.data.team ? dictionary.withTeam : dictionary.withClient}
        </StyledBadge>
      )}
    </components.SingleValue>
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

const ChannelSelect = forwardRef((props, ref) => {
  const { className = "", isMulti = false, isClearable = false, isDisabled = false, searchable = false, ...otherProps } = props;

  const {
    generalSettings: { dark_mode },
  } = useSettings();

  let components = { Option, SingleValue };

  if (isMulti) {
    components = { Option, MultiValueContainer };
  }

  if (searchable) {
    return (
      <AsyncSelect
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
        classNamePrefix="react-select"
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

export default ChannelSelect;
