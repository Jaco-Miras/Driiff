import React, {forwardRef, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";

const Wrapper = styled.div`
    ${props => props.isLoading === false ? "display: none; opacity: 0;" : `opacity: ${props.opacity};`};    
`;

const PreLoader = forwardRef((props, ref) => {

    const loading = useSelector(state => state.global.isLoading);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (loading === false) {
            setOpacity(0.8);
        } else {
            if (opacity > 0.3) {
                setTimeout(() => {
                    setOpacity(opacity + -0.01);
                }, 10);
            }
        }
    }, [loading, opacity]);

    return (
        <Wrapper className="preloader" isLoading={loading} opacity={opacity}>
            <div className="preloader-icon"></div>
        </Wrapper>
    );
});

export default React.memo(PreLoader);