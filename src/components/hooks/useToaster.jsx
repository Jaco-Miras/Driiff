import React, {useCallback, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import toaster from "toasted-notes";
import {ProgressBar} from "../panels/common";

const Wrapper = styled.div`
    position: initial !important;
    padding-bottom: 10px;    
`;

const ProgressBarStyle = styled(ProgressBar)`
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    border-radius: 0 0 10px 10px;
`;

const useToaster = () => {

    const DurationLineAmount = () => {
    };

    const DurationLine = (props) => {

        const {className, duration} = props;
        const interval = useRef();
        const [amount, setAmount] = useState(duration);

        useEffect(() => {
            interval.current = setInterval(() => {
                setAmount(state => state - 500);
            }, 500);
        }, []);

        if (amount <= 0) {
            clearInterval(interval.current);
        }

        return <ProgressBarStyle className={className} barClassName={`${className} progress-bar-striped`} amount={amount} limit={duration} height={8}/>;
    };

    const success = useCallback((text, options = {}) => {
        if (!options.hasOwnProperty("duration")) {
            options.duration = 2000;
        }
        toaster.notify(() => <Wrapper id="toast-container">
            <div className="toast-success">
                {text}
                <DurationLine className="bg-success" duration={options.duration}/>
            </div>
        </Wrapper>, options);
    }, []);

    const error = useCallback((text, options = {}) => {
        if (!options.hasOwnProperty("duration")) {
            options.duration = 2000;
        }
        toaster.notify(() => <Wrapper id="toast-container">
            <div className="toast-error">
                {text}
                <DurationLine className="bg-error" duration={options.duration}/>
            </div>
        </Wrapper>, options);
    }, []);

    const info = useCallback((text, options = {}) => {
        if (!options.hasOwnProperty("duration")) {
            options.duration = 2000;
        }
        toaster.notify(() => <Wrapper id="toast-container">
            <div className="toast-info">
                {text}
                <DurationLine className="bg-info" duration={options.duration}/>
            </div>
        </Wrapper>, options);
    }, []);

    const warning = useCallback((text, options = {}) => {
        if (!options.hasOwnProperty("duration")) {
            options.duration = 2000;
        }
        toaster.notify(() => <Wrapper id="toast-container">
            <div className="toast-warning">
                {text}
                <DurationLine className="bg-warning" duration={options.duration}/>
            </div>
        </Wrapper>, options);
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