import React, {forwardRef} from "react";
import styled from "styled-components";

const LoaderDiv = styled.div`
    border: 10px solid #f3f3f3; 
    border-top: 10px solid #972c86;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
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