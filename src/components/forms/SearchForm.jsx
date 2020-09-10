import React, { forwardRef, useRef, useEffect } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../common";

const Wrapper = styled.form`
  .btn-cross {
    position: absolute;
    right: 0;
    opacity: 0;
    border: 0;
    background: transparent;
    padding: 0;
    height: 100%;
    width: 36px;
    border-radius: 4px;
    svg {
      width: 16px;
      color: #495057;
    }
  }
  .not-empty .btn-cross {
    z-index: 9;
    opacity: 1;
  }
`;
const Icon = styled(SvgIconFeather)``;

const SearchForm = forwardRef((props, ref) => {
  const { className = "", onChange, onClick, placeholder = "Search", value = "", onClickEmpty, closeButton = false } = props;
  const inputGroup = useRef();

  useEffect(() => {
    if (value !== "") {
      inputGroup.current.classList.add("not-empty");
    }
    if (value === "") {
      inputGroup.current.classList.remove("not-empty");
    }
  }, [onChange]);

  return (
    <Wrapper className={`${className}`}>
      <div ref={inputGroup} className="input-group">
        <input ref={ref} onChange={onChange} value={value} type="text" className="form-control" placeholder={placeholder} />
        {closeButton && (
          <button onClick={onClickEmpty} className="btn-cross" type="button">
            <Icon icon="x" />
          </button>
        )}
        <div className="input-group-append">
          <button onClick={onClick} className="btn btn-outline-light" type="button">
            <i className="ti-search"></i>
          </button>
        </div>
      </div>
    </Wrapper>
  );
});

export default React.memo(SearchForm);
