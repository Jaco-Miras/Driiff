import React from "react";
import styled from "styled-components";

const MobileOverlayContainer = styled.div``;

const MobileOverlay = () => {
  const closeMobileModal = () => {
    document.body.classList.remove("navigation-show");
    // document.body.classList.remove("mobile-modal-open");
  };

  return (
    <>
      <MobileOverlayContainer className="overlay" onClick={closeMobileModal} />
      {/* <MobileOverlayFilter className="mobile-overlay" onClick={closeMobileModal} /> */}
    </>
  );
};

export default React.memo(MobileOverlay);
