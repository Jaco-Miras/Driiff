import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    display: block;
`;

const InputFeedback = (props) => {

    const {className = "", valid, children} = props;

    if (valid === null)
        return <></>;

    return (
        <Wrapper className={`input-feedback ${valid ? "valid" : "invalid"}-feedback ${className}`}>
            {children}
        </Wrapper>
    );
};

export default React.memo(InputFeedback);

