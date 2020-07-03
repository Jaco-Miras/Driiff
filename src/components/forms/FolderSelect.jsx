import React, {forwardRef} from "react";
import Select, {components} from "react-select";
import styled from "styled-components";
import {SvgIconFeather} from "../common";
import {selectTheme} from "../../helpers/selectTheme";

const SelectOption = styled.div`
    display: flex;
    flex-flow: row;
    transition: background 0.15s ease;
    svg {
        transition: none;
    }
    &:hover{
        background: #8C3B9B;
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

const Option = props => {


    return (
        <SelectOption >
            <components.Option {...props}>
            {
                props.data &&
                <>
                    <Icon
                        icon="folder"
                    />
                    {props.children}
                </>
            }
            </components.Option>
        </SelectOption>
    );
};

const MultiValueContainer = ({children, selectProps, ...props}) => {
    return (
        <components.MultiValueContainer {...props}>
            {children}
        </components.MultiValueContainer>
    );
};

const FolderSelect = forwardRef((props, ref) => {

    const {className = "", isMulti = false, isClearable = false, ...otherProps} = props;

    let components = {Option};

    if (isMulti) {
        components = {Option, MultiValueContainer};
    }

    return <Select
        ref={ref}
        className={`react-select-container ${className}`}
        styles={selectTheme}
        isMulti={isMulti}
        isClearable={isClearable}
        components={components}
        {...otherProps}
    />;
});

export default FolderSelect;