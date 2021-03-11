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
  min-width: 24px;
`;

const TextWrapper = styled.div`
  word-break: break-word;
`;

const useToaster = () => {

  const success = useCallback((text, options = {}) => {
    return toast.success(
      <Wrapper>
        <Icon icon="check" strokeWidth="2"/>
        <TextWrapper>
          {text}
        </TextWrapper>
      </Wrapper>
    , options);
  }, []);

  const error = useCallback((text, options = {}) => {
    return toast.error(
      <Wrapper>
        <Icon icon="alert-x" strokeWidth="2"/>
        <TextWrapper>
          {text}
        </TextWrapper>
      </Wrapper>
    , options);
  }, []);

  const info = useCallback((text, options = {}) => {
   return toast.info(
      <Wrapper>
        <Icon icon="info" strokeWidth="2"/>
        <TextWrapper>
          {text}
        </TextWrapper>
      </Wrapper>
    , options);
  }, []);

  const warning = useCallback((text, options = {}) => {
    return toast.warn(
      <Wrapper>
        <Icon icon="warning" strokeWidth="2"/>
        <TextWrapper>
          {text}
        </TextWrapper>
      </Wrapper>
    , options);
  }, []);

  const notify = useCallback((text, options = {}) => {
    return toast(
      <Wrapper>
        <TextWrapper>
          {text}
        </TextWrapper>
      </Wrapper>
    , options);
  }, []);

  const update = useCallback((text, options = {}) =>{
    toast.update(text, options);
  }, []);

  return {
    success,
    error,
    warning,
    info,
    notify,
    update,
  };
};

export default useToaster;
