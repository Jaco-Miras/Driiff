import lodash from "lodash";
import {useCallback, useEffect, useState} from "react";

export const useTooltipOrientation = (mainRef, tooltipRef, scrollEl = null, when, offset = {}) => {
  const { vertical: verticalOffset = 0, horizontal: horizontalOffset = 0 } = offset;

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
    let adjust = verticalOffset;
    if (scrollEl) {
      adjust = scrollEl.parentElement.getBoundingClientRect().y;
      benchMark = scrollEl.parentElement.clientHeight / 2;
    }

    adjust += verticalOffset;
    if (elPos.y - adjust < benchMark) {
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
      adjust = scrollEl.parentElement.getBoundingClientRect().x;
      benchMark = scrollEl.parentElement.clientWidth / 2;
    }

    adjust += horizontalOffset;
    if (elPos.x - adjust < benchMark) {
      return "right";
    } else {
      return "left";
    }
  }, [mainRef, scrollEl]);

  useEffect(() => {
    const calculatePosition = lodash.debounce(() => {
      if (tooltipRef.current) {
        setOrientation({
          vertical: verticalOrientation(),
          horizontal: horizontalOrientation(),
          clientHeight: tooltipRef.current.clientHeight,
        });
      }
    }, 200);

    if (when) {
      calculatePosition();

      if (scrollEl) {
        scrollEl.addEventListener("scroll", calculatePosition);
      }

      return () => {
        if (scrollEl) scrollEl.removeEventListener("scroll", calculatePosition);
      };
    }
  }, [when, scrollEl, horizontalOrientation, verticalOrientation]);

  return {
    orientation,
  };
};
