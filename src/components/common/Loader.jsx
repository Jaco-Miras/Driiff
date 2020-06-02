import React, {forwardRef} from "react";
import styled from "styled-components";

const LoaderDiv = styled.div`
    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: text-bottom;
    border: .25em solid #7A1B8B;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin .75s linear infinite;
    opacity: 0.8;
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const Loader = forwardRef((props, ref) => {
    const {className = ""} = props;

    return <LoaderDiv className={`loading ${className}`}>
    </LoaderDiv>;
});

export default React.memo(Loader);