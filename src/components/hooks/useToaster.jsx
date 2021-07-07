import React from "react";
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
  const success = (text, options = {}) => {
    options = { ...options, containerId: 'A' }
    return toast.success(
      <Wrapper>
        <Icon icon="check" strokeWidth="2" />
        <TextWrapper>{text}</TextWrapper>
      </Wrapper>,
      options
    );
  };

  const error = (text, options = {}) => {
    options = { ...options, containerId: 'A' }
    return toast.error(
      <Wrapper>
        <Icon icon="alert-x" strokeWidth="2" />
        <TextWrapper>{text}</TextWrapper>
      </Wrapper>,
      options
    );
  };

  const info = (text, options = {}) => {
    options = { ...options, containerId: 'toastA' }
    return toast.info(
      <Wrapper>
        <Icon icon="info" strokeWidth="2" />
        <TextWrapper>{text}</TextWrapper>
      </Wrapper>,
      options
    );
  };

  const warning = (text, options = {}) => {
    options = { ...options, containerId: 'toastAA' }
    return toast.warn(
      <Wrapper>
        <Icon icon="warning" strokeWidth="2" />
        <TextWrapper>{text}</TextWrapper>
      </Wrapper>,
      options
    );
  };

  const notify = (text, options = {}) => {
    options = { ...options, containerId: 'toastAA' }
    return toast(
      <Wrapper>
        <TextWrapper>{text}</TextWrapper>
      </Wrapper>,
      options
    );
  };

  const update = (text, options = {}) => {
    options = { ...options, containerId: 'toastAA' }
    toast.update(text, options);
  };

  const dismiss = (toastId, options = {}) => {
    toast.dismiss(toastId);
  };

  return {
    success,
    error,
    warning,
    info,
    notify,
    update,
    dismiss,
  };
};

export default useToaster;
