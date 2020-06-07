import lodash from "lodash";
import {useCallback, useEffect, useState} from "react";

export const useTooltipOrientation = (mainRef, tooltipRef, scrollEl = null, when) => {

    const [orientation, setOrientation] = useState({
        vertical: null,
        horizontal: null,
    });

    const verticalOrientation = useCallback(() => {
        if (!mainRef) {
            return null;
        }

        const elPos = mainRef.current.getBoundingClientRect();

        let benchMark = window.innerHeight / 2;
        let adjust = 0;
        if (scrollEl) {
            adjust = scrollEl.offsetParent.getBoundingClientRect().y;
            benchMark = scrollEl.offsetParent.clientHeight / 2;
        }

        if ((elPos.y - adjust) < benchMark) {
            return "bottom";
        } else {
            return "top";
        }
    }, [mainRef, scrollEl]);

    const horizontalOrientation = useCallback(() => {
        if (!mainRef) {
            return null;
        }

        const elPos = mainRef.current.getBoundingClientRect();

        let benchMark = window.innerWidth / 2;
        let adjust = 0;
        if (scrollEl) {
            adjust = scrollEl.offsetParent.getBoundingClientRect().x;
            benchMark = scrollEl.offsetParent.clientWidth / 2;
        }

        if ((elPos.x - adjust) < benchMark) {
            return "right";
        } else {
            return "left";
        }
    }, [mainRef, scrollEl]);

    useEffect(() => {
        const calculatePosition = lodash.debounce(() => {
            setOrientation({
                vertical: verticalOrientation(),
                horizontal: horizontalOrientation(),
            });
        }, 200);

        if (when) {
            calculatePosition();

            if (scrollEl) {
                scrollEl.addEventListener("scroll", calculatePosition);
            }

            return () => {
                if (scrollEl)
                    scrollEl.removeEventListener("scroll", calculatePosition);
            };
        }
    }, [when, scrollEl, horizontalOrientation, verticalOrientation]);

    return {
        orientation
    };
};