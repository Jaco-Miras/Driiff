import React from "react";
import {ModalHeader} from "reactstrap";
import styled from "styled-components";
import {SvgIconFeather} from "../common";

const Wrapper = styled(ModalHeader)`
    font-size: 17px;
    color: #505050;
    font-weight: 600;
    
    button:focus {
        outline: none;
    }
`;

const Icon = styled(SvgIconFeather)`
    width: 20px;
    height: 20px;
`;

const ModalHeaderSection = (props) => {

    const {className = "", children, ...otherProps} = props;

    return (
        <Wrapper className={`model-header-section ${className}`} charCode={<Icon icon="x"/>} {...otherProps}>
            {children}
        </Wrapper>
    );
};

export default React.memo(ModalHeaderSection);