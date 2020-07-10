import React, { forwardRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Wrapper = styled.div`
  ${(props) => (props.isLoading === 0 ? "display: none;" : `opacity: ${props.isLoading};`)};
`;

const Toaster = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(useSelector((state) => state.global.isLoading));

  useEffect(() => {
    if (loading > 0.5) {
      setTimeout(() => {
        setLoading(loading + -0.01);
      }, 10);
    }
  }, [loading]);

  return (
    <Wrapper className="toast-top-center" isLoading={loading}>
      <div className="toast toast-success" aria-live="polite" style="">
        <div className="toast-progress" style="width: 45.85%;"></div>
        <div className="toast-message">Welcome Roxana Roussell.</div>
      </div>
    </Wrapper>
  );
});

export default React.memo(Toaster);
