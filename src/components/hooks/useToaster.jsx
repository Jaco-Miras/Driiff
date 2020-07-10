import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import toaster from "toasted-notes";

const Wrapper = styled.div`
  position: initial !important;
  padding-bottom: 10px;
`;

const ProgressBarStyle = styled.div`
  width: ${(props) => (props.width >= 0 ? props.width : 0)}%;
  transition: all 0.2s;
`;

const useToaster = () => {
  const DurationLine = (props) => {
    const { duration } = props;
    const interval = useRef();
    const [amount, setAmount] = useState(duration);

    useEffect(() => {
      interval.current = setInterval(() => {
        setAmount((state) => state - 100);
      }, 100);
    }, []);

    if (amount <= -100) {
      clearInterval(interval.current);
    }

    const progress = (amount / duration) * 100;

    return <ProgressBarStyle className="toast-progress" width={progress} />;
  };

  const success = useCallback((text, options = {}) => {
    if (!options.hasOwnProperty("duration")) {
      options.duration = 2000;
    }
    toaster.notify(
      () => (
        <Wrapper id="toast-container">
          <div className="toast-success">
            <DurationLine duration={options.duration} />
            <div className="toast-message">{text}</div>
          </div>
        </Wrapper>
      ),
      options
    );
  }, []);

  const error = useCallback((text, options = {}) => {
    if (!options.hasOwnProperty("duration")) {
      options.duration = 2000;
    }
    toaster.notify(
      () => (
        <Wrapper id="toast-container">
          <div className="toast-error">
            <DurationLine duration={options.duration} />
            <div className="toast-message">{text}</div>
          </div>
        </Wrapper>
      ),
      options
    );
  }, []);

  const info = useCallback((text, options = {}) => {
    if (!options.hasOwnProperty("duration")) {
      options.duration = 2000;
    }
    toaster.notify(
      () => (
        <Wrapper id="toast-container">
          <div className="toast-info">
            <DurationLine duration={options.duration} />
            <div className="toast-message">{text}</div>
          </div>
        </Wrapper>
      ),
      options
    );
  }, []);

  const warning = useCallback((text, options = {}) => {
    if (!options.hasOwnProperty("duration")) {
      options.duration = 2000;
    }
    toaster.notify(
      () => (
        <Wrapper id="toast-container">
          <div className="toast-warning">
            <DurationLine duration={options.duration} />
            <div className="toast-message">{text}</div>
          </div>
        </Wrapper>
      ),
      options
    );
  }, []);

  const notify = useCallback((text, options = {}) => {
    if (!options.hasOwnProperty("duration")) {
      options.duration = 2000;
    }
    info(text, options);
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
