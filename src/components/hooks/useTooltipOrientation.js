import lodash from "lodash";
import {useEffect, useState} from "react";

export const useTooltipOrientation = (mainRef, tooltipRef, scrollEl, when, offset = 215) => {
    const [orientation, setOrientation] = useState("bottom");

    useEffect(() => {
        const calculatePosition = lodash.debounce(() => {
            if (mainRef && mainRef.current) {
                let elPos = mainRef.current.getBoundingClientRect();
                let screenHeight = window.innerHeight;
                if (tooltipRef.current) {
                    if ((screenHeight - elPos.y) < (tooltipRef.current.clientHeight + offset)) {
                        setOrientation("top");
                    } else {
                        setOrientation("bottom");
                    }
                }
            }
        }, 200);

        if (when) {
            if (scrollEl) {
                scrollEl.addEventListener("scroll", calculatePosition);
            }

            if (mainRef && mainRef.current) {
                let elPos = mainRef.current.getBoundingClientRect();
                let screenHeight = window.innerHeight;

                if (tooltipRef.current) {
                    if ((screenHeight - elPos.y) < (tooltipRef.current.clientHeight + offset)) {
                        setOrientation("top");
                    } else {
                        setOrientation("bottom");
                    }
                }
            }
            return () => {
                if (scrollEl)
                    scrollEl.removeEventListener("scroll", calculatePosition);
            };
        }
    }, [when, mainRef, scrollEl, tooltipRef, offset]);

    return [orientation];
};

export const useTooltipPosition = (mainRef, tooltipRef, scrollEl, when) => {
    const [position, setPosition] = useState(0);

    useEffect(() => {
        const calculatePosition = lodash.debounce(() => {
            if (mainRef && mainRef.current) {
                let elPos = mainRef.current.getBoundingClientRect();
                let screenHeight = window.innerHeight;

                if ((screenHeight - elPos.y) < (tooltipRef.current.clientHeight + 215)) {
                    setPosition(Math.floor(screenHeight - elPos.y));
                } else {
                    setPosition(Math.floor(elPos.y));
                }
            }
        }, 200);

        if (when) {
            if (scrollEl) {
                scrollEl.addEventListener("scroll", calculatePosition);
            }
            if (mainRef && mainRef.current) {
                let elPos = mainRef.current.getBoundingClientRect();
                let screenHeight = window.innerHeight;

                if (tooltipRef.current) {
                    if ((screenHeight - elPos.y) < (tooltipRef.current.clientHeight + 215)) {
                        setPosition(Math.floor(screenHeight - elPos.y));
                    } else {
                        setPosition(Math.floor(elPos.y));
                    }
                }
            }
            return () => {
                if (scrollEl)
                    scrollEl.removeEventListener("scroll", calculatePosition);
            };
        }
    }, [when, mainRef, scrollEl, tooltipRef]);

    return [position];
};

export const useTooltipHorizontalOrientation = (mainRef, tooltipRef, scrollEl, when) => {
    const [orientation, setOrientation] = useState("left");

    useEffect(() => {
        const calculatePosition = lodash.debounce(() => {
            if (mainRef && mainRef.current) {
                let elPos = mainRef.current.getBoundingClientRect();
                let screenWidth = window.innerWidth;
                if ((screenWidth - elPos.x) < (tooltipRef.current.clientWidth + 30)) {
                    setOrientation("left");
                } else {
                    setOrientation("right");
                }
            }
        }, 200);

        if (when) {
            if (scrollEl) {
                scrollEl.addEventListener("scroll", calculatePosition);
            }
            if (mainRef && mainRef.current) {
                let elPos = mainRef.current.getBoundingClientRect();
                let screenWidth = window.innerWidth;

                if (tooltipRef.current) {
                    if ((screenWidth - elPos.x) < (tooltipRef.current.clientWidth + 30)) {
                        setOrientation("left");
                    } else {
                        setOrientation("right");
                    }
                }
            }
            return () => {
                if (scrollEl)
                    scrollEl.removeEventListener("scroll", calculatePosition);
            };
        }
    }, [when, mainRef, scrollEl, tooltipRef]);

    return [orientation];
};