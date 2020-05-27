import React, {forwardRef} from "react";
import Select, {components} from "react-select";
import styled from "styled-components";
import {Avatar} from "../common";

const SelectOption = styled.div`
    display: flex;
    flex-flow: row;
    align-items: center;
    padding-left: 5px;
    :hover{
        background: #DEEBFF;
    }
`;

const StyledAvatar = styled(Avatar)`
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
                <StyledAvatar
                    className="react-select-avatar"
                    key={props.data.id}
                    imageLink={props.data.profile_image_link}
                    name={props.data.name}
                    partialName={props.data.partial_name}
                />
            }
            <components.Option {...props}></components.Option>
        </SelectOption>
    );
};

const MultiValueContainer = ({children, selectProps, ...props}) => {
    let newChildren = children.map((c, i) => {
        if (i === 0) {
            return {
                ...c,
                props: {
                    ...c.props,
                    children: props.data.first_name,
                },
            };
        } else return c;
    });
    return (
        <components.MultiValueContainer {...props}>
            {/* {
             props.data && selectProps.inputValue === "" &&
             <StyledAvatar
             className="react-select-avatar"
             key={props.data.id}
             imageLink={props.data.profile_image_link}
             name={props.data.name}
             partialName={props.data.partial_name}
             />
             } */}
            {newChildren}
        </components.MultiValueContainer>
    );
};

const PeopleSelect = forwardRef((props, ref) => {

    const {className = "", isMulti = true, isClearable = false, ...otherProps} = props;

    return <Select
        ref={ref}
        className={`react-select-container ${className}`}
        classNamePrefix={"react-select"}
        isMulti={isMulti}
        isClearable={isClearable}
        components={{Option, MultiValueContainer}}
        {...otherProps}
    />;
});

export default PeopleSelect;