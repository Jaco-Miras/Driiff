import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../common";

const Wrapper = styled.div`
  font-size: 17px;
  color: #505050;
  font-weight: 600;

  button:focus {
    outline: none;
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 20px;
  height: 20px;
`;

const ModalHeaderSection = (props) => {
  const { className = "", children, toggle, showCloseButton = true, ...otherProps } = props;

  return (
    <Wrapper className={`model-header-section modal-header ${className}`} {...otherProps}>
      <h5 className="modal-title">{children}</h5>
      {showCloseButton && (
        <button type="button" onClick={toggle} className="close" aria-label="Close">
          <span aria-hidden="true">
            <Icon icon="x" />
          </span>
        </button>
      )}
    </Wrapper>
  );
};

export default React.memo(ModalHeaderSection);
