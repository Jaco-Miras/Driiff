import React, {forwardRef, useEffect, useState} from "react";
import styled from "styled-components";
import {usePageLoader} from "../hooks";

const Wrapper = styled.div`
  ${(props) => (props.isLoading === false ? "display: none; opacity: 0;" : `opacity: ${props.opacity};`)};
`;

const PreLoader = forwardRef((props, ref) => {
  const {isActive} = usePageLoader();
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (isActive === false) {
      setOpacity(0.8);
    } else {
      if (opacity > 0.3) {
        setTimeout(() => {
          setOpacity(opacity + -0.01);
        }, 10);
      }
    }
  }, [isActive, opacity]);

  return (
    <Wrapper className="preloader" isLoading={isActive} opacity={opacity}>
      <div className="preloader-icon"></div>
    </Wrapper>
  );
});

export default React.memo(PreLoader);
