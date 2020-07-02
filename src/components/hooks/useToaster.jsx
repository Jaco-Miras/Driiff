import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components";
import toaster from "toasted-notes";
import {ProgressBar} from "../panels/common";

const Wrapper = styled.div`
    position: initial !important;    
`;

const useToaster = () => {

    const success = useCallback((text, options = {}) => {
        if (!options.hasOwnProperty("duration")) {
            options.duration = 2000;
        }
        toaster.notify(() => <Wrapper id="toast-container">
            <div className="toast-success">{text}</div>
        </Wrapper>, options);
    }, []);

    const error = useCallback((text, options = {}) => {
        if (!options.hasOwnProperty("duration")) {
            options.duration = 2000;
        }
        toaster.notify(() => <Wrapper id="toast-container">
            <div className="toast-error">{text}</div>
        </Wrapper>, options);
    }, []);

    const info = useCallback((text, options = {}) => {
        if (!options.hasOwnProperty("duration")) {
            options.duration = 2000;
        }
        toaster.notify(() => <Wrapper id="toast-container">
            <div className="toast-info">{text}</div>
        </Wrapper>, options);
    }, []);

    const warning = useCallback((text, options = {}) => {
        if (!options.hasOwnProperty("duration")) {
            options.duration = 2000;
        }
        toaster.notify(() => <Wrapper id="toast-container">
            <div className="toast-warning">{text}</div>
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