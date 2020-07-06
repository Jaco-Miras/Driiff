import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    height: ${props => props.height}px;    
`;

const Bar = styled.div`
    width: ${props => props.progress}%;
`;

const ProgressBar = (props) => {

    const {className = "", barClassName = "progress-bar-striped", height = 10, amount = 0, limit = 100} = props;

    const progress = amount / limit * 100;

    return (
        <Wrapper className={`progress ${className}`} height={height}>
            <Bar className={`progress-bar ${barClassName}`} role="progressbar"
                 progress={progress}/>
        </Wrapper>
    );
};

export default React.memo(ProgressBar);