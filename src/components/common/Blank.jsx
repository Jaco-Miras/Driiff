import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const Blank = (props) => {

    return (
        <Wrapper className={`${props.className}`}>
        </Wrapper>
    );
};

export default React.memo(Blank);