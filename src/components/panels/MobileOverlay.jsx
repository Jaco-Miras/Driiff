import React from "react";
import styled from "styled-components";

const MobileOverlayContainer = styled.div`
    ${'' /* z-index: 7; */}
`;

const MobileOverlay = () => {

    const closeMobileModal = () => {
        document.body.classList.remove("navigation-show");
    };

    return (
        <MobileOverlayContainer className="overlay" onClick={closeMobileModal}/>
    );
};

export default React.memo(MobileOverlay);