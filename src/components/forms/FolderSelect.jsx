import React, {forwardRef} from "react";
import Select, {components} from "react-select";
import styled from "styled-components";
import {SvgIconFeather} from "../common";

const SelectOption = styled.div`
    display: flex;
    flex-flow: row;
    align-items: center;
    padding-left: 5px;
    :hover{
        background: #DEEBFF;
    }
`;

const Icon = styled(SvgIconFeather)`
    min-width: 2rem;
    min-height: 2rem;
    margin: 5px;
    border: none;
`;

const Option = props => {
    return (
        <SelectOption>
            {
                props.data &&
                <Icon
                    icon="folder"
                />
            }
            <components.Option {...props}></components.Option>
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
        classNamePrefix={"react-select"}
        isMulti={isMulti}
        isClearable={isClearable}
        components={components}
        {...otherProps}
    />;
});

export default FolderSelect;