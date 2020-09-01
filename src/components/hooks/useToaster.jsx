import React, { useCallback } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { SvgIconFeather } from "../common";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled(SvgIconFeather)`
  margin-right: 10px;
`;

const TextWrapper = styled.div`
`;

const useToaster = () => {

  const success = useCallback((text, options = {}) => {
    toast.success(
      <Wrapper>
        <Icon icon="check" strokeWidth="2"/>
        <TextWrapper>
          {text}
        </TextWrapper>
      </Wrapper>
    , options);
  }, []);

  const error = useCallback((text, options = {}) => {
    toast.error(
      <Wrapper>
        <Icon icon="alert-x" strokeWidth="2"/>
        <TextWrapper>
          {text}
        </TextWrapper>
      </Wrapper>
    , options);
  }, []);

  const info = useCallback((text, options = {}) => {
    toast.info(
      <Wrapper>
        <Icon icon="info" strokeWidth="2"/>
        <TextWrapper>
          {text}
        </TextWrapper>
      </Wrapper>
    , options);
  }, []);

  const warning = useCallback((text, options = {}) => {
    toast.warn(
      <Wrapper>
        <Icon icon="warning" strokeWidth="2"/>
        <TextWrapper>
          {text}
        </TextWrapper>
      </Wrapper>
    , options);
  }, []);

  const notify = useCallback((text, options = {}) => {
    toast(
      <Wrapper>
        <TextWrapper>
          {text}
        </TextWrapper>
      </Wrapper>
    , options);
  }, []);

  return {
    success,
    error,
    warning,
    info,
    notify,
  };
};

export default useToaster;
