import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    height: ${props => props.height}px;    
`;

const Bar = styled.div`
    width: ${props => props.progress}%;
`;

const ProgressBar = (props) => {

    const {className = "", height = 10, amount = 0, limit = 100} = props;

    const progress = amount / limit * 100;

    return (
        <Wrapper className={`progress ${className}`} height={height}>
            <Bar className="progress-bar progress-bar-striped" role="progressbar"
                 progress={progress}
                 aria-valuenow="10" aria-valuemin="0"
                 aria-valuemax="100"/>
        </Wrapper>
    );
};

export default React.memo(ProgressBar);