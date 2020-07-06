import React, {forwardRef} from "react";
import Select, {components} from "react-select";
import styled from "styled-components";
import {Avatar} from "../common";
import {selectTheme} from "../../helpers/selectTheme";

const SelectOption = styled.div`
    display: flex;
    align-items: center;
    &:hover{
        background: #DEEBFF;
    }
    > div {
        display: flex;
        align-items: center;
    }
`;

const StyledAvatar = styled(Avatar)`
    min-width: 1.75rem;
    min-height: 1.75rem;
    ${'' /* margin: 5px; */}
    margin: -2px 10px 0 0;
    border: none;
    color: #505050 !important;
`;

const Option = props => {
    return (
        <SelectOption>
            <components.Option {...props}>
            {
                props.data &&
                <>
                    <StyledAvatar
                        className="react-select-avatar"
                        key={props.data.id}
                        imageLink={props.data.profile_image_link}
                        name={props.data.name}
                        partialName={props.data.partial_name}
                    />
                    {props.children}
                </>
            }
            </components.Option>
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
            {newChildren}
        </components.MultiValueContainer>
    );
};

const PeopleSelect = forwardRef((props, ref) => {

    const {className = "", isMulti = true, isClearable = false, ...otherProps} = props;

    return <Select
        ref={ref}
        className={`react-select-container ${className}`}
        styles={selectTheme}
        isMulti={isMulti}
        isClearable={isClearable}
        components={{Option, MultiValueContainer}}
        {...otherProps}
    />;
});

export default PeopleSelect;