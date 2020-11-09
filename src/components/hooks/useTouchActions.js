const useTouchActions = (touchActions) => {
  touchActions = {
    handleTouchStart: () => {
    },
    handleTouchEnd: () => {
    },
    handleSwipeLeft: () => {
    },
    handleSwipeRight: () => {
    },
    handleSwipeUp: () => {
    },
    handleSwipeDown: () => {
    },
    ...touchActions
  };

  let timerStart = 0;
  let xDown = null;
  let yDown = null;

  const touchStart = (e) => {
    timerStart = e.timeStamp;
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;
    touchActions.handleTouchStart(e);
  };

  const touchEnd = (e) => {
    if ((e.timeStamp - timerStart) <= 125) {
      touchActions.handleTouchEnd(e);
    }
  };

  const touchMove = (e) => {
    let xUp = e.touches[0].clientX;
    let yUp = e.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        touchActions.handleSwipeLeft(e);
      } else {
        touchActions.handleSwipeRight(e);
      }
    } else {
      if (yDiff > 0) {
        touchActions.handleSwipeUp(e);
      } else {
        touchActions.handleSwipeDown(e);
      }
    }

    xDown = null;
    yDown = null;
  };

  return {
    touchStart,
    touchMove,
    touchEnd
  };
};

export default useTouchActions;
