import React, { forwardRef } from "react";
import Select, { components } from "react-select";
import styled from "styled-components";
import { SvgIconFeather } from "../common";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";
import { useSettings, useTranslation } from "../hooks";

const StyledSelect = styled(Select)`
  .dark & {
    > div {
      > div {
        background-color: #25282c;
        margin: 10px;
        border-radius: 2px;
        color: #fff;

        > div {
          color: #c7c7c7;

          &[class$="indicatorContainer"] {
            background: rgb(17, 20, 23);
          }
        }
      }
    }
    [class$="menu"] {
      > div {
        > div {
          > div {
            //background: rgb(17, 20, 23);
          }
        }
      }
    }
  }
`;

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
  min-width: 1rem;
  min-height: 1rem;
  margin: -2px 10px 0 0;
  border: none;
`;

const Option = (props) => {
  return (
    <SelectOption>
      <components.Option {...props}>
        {props.data && (
          <>
            <Icon icon={props.data.icon} />
            {props.children}
          </>
        )}
      </components.Option>
    </SelectOption>
  );
};

const PostVisibilitySelect = forwardRef((props, ref) => {
  const { className = "", ...otherProps } = props;

  const { _t } = useTranslation();

  const dictionary = {
    visibleAllInternal: _t("POST.VISIBLE_ALL_INTERNAL", "Visible to all internal members"),
    visibleAllWorkspace: _t("POST.VISIBLE_ALL_WORKSPACE", "Visible to all workspace members"),
    responsbileUsers: _t("POST.VISIBLE_RESPONSIBLE_USERS", "Visible to responsible users only"),
  };

  const {
    generalSettings: { dark_mode },
  } = useSettings();

  let components = { Option };
  const options = [
    {
      icon: "unlock",
      value: false,
      label: dictionary.visibleAllWorkspace,
    },
    {
      icon: "lock",
      value: true,
      label: dictionary.responsbileUsers,
    },
  ];

  return <StyledSelect ref={ref} className={`react-select-container ${className}`} styles={dark_mode === "0" ? lightTheme : darkTheme} isMulti={false} isClearable={false} components={components} options={options} {...otherProps} />;
});

export default PostVisibilitySelect;
