import lodash from "lodash";
import { useEffect, useState } from "react";

export const useTooltipOrientation = (mainRef, tooltipRef, scrollEl = null, when, offset = {}) => {
  const { horizontal: horizontalOffset = 0 } = offset;

  const [orientation, setOrientation] = useState({
    vertical: null,
    horizontal: null,
    clientHeight: null,
  });

  const verticalOrientation = () => {
    if (!mainRef) {
      return null;
    }

    const elPos = mainRef.current.getBoundingClientRect();
    if (scrollEl) {
      if (window.innerHeight - (elPos.y + 150) < tooltipRef.current.clientHeight) {
        return "top";
      } else {
        return "bottom";
      }
      // if (scrollEl.clientHeight - elPos.y > tooltipRef.current.clientHeight) {
      //   console.log(scrollEl.clientHeight, elPos.y, tooltipRef.current.clientHeight, "bottom");
      //   return "bottom";
      // } else {
      //   console.log(scrollEl.clientHeight, elPos.y, tooltipRef.current.clientHeight, "top");
      //   return "top";
      // }
    } else {
      if (elPos.y - tooltipRef.current.clientHeight < tooltipRef.current.clientHeight) {
        return "bottom";
      } else {
        return "top";
      }
    }
    // let benchMark = window.innerHeight / 2;
    // let adjust = verticalOffset;
    // if (scrollEl) {
    //   adjust = scrollEl.parentElement.getBoundingClientRect().y;
    //   benchMark = scrollEl.parentElement.clientHeight / 2;
    // }

    // adjust += verticalOffset;
    // if (elPos.y - adjust < benchMark) {
    //   return "bottom";
    // } else {
    //   return "top";
    // }
  };

  const horizontalOrientation = () => {
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
  };

  const calculatePosition = lodash.debounce(() => {
    if (tooltipRef.current) {
      setOrientation({
        vertical: verticalOrientation(),
        horizontal: horizontalOrientation(),
        clientHeight: tooltipRef.current.clientHeight,
      });
    }
  }, 100);

  useEffect(() => {
    if (when) {
      calculatePosition();
      if (scrollEl) {
        scrollEl.addEventListener("scroll", calculatePosition);
      }

      return () => {
        if (scrollEl) scrollEl.removeEventListener("scroll", calculatePosition);
      };
    }
  }, [when]);

  useEffect(() => {
    //recalculate if initial clientheight is zero
    if (when && orientation.clientHeight === 0) {
      calculatePosition();
    }
  }, [when, orientation]);

  return {
    orientation,
  };
};
