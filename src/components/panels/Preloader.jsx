import React, {forwardRef, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";

const Wrapper = styled.div`
    ${props => props.isLoading === 0 ? `display: none;` : `opacity: ${props.isLoading};`};
`;

const PreLoader = forwardRef((props, ref) => {

    const [loading, setLoading] = useState(useSelector(state => state.global.isLoading));

    useEffect(() => {
        if (loading > 0.5) {
            setTimeout(() => {
                setLoading(loading + -0.01);
            }, 10);
        }
    }, [loading]);

    return (
        <Wrapper className="preloader" isLoading={loading}>
            <div className="preloader-icon"></div>
        </Wrapper>
    );
});

export default React.memo(PreLoader);