import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Transition } from "react-transition-group";

const ShowMoreBtn = styled.div`
  text-align: center;
`;

const Quote = (props) => {
  const { quote, dictionary } = props;

  const commentRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [height, setHeight] = useState(200);

  const duration = 300;

  const defaultStyle = {
    transition: `max-height ${duration}ms ease-in-out`,
    maxHeight: "200px",
    overflow: "hidden",
  };

  const transitionStyles = {
    entering: { maxHeight: `${height}px` },
    entered: { maxHeight: `${height}px` },
    exiting: { maxHeight: "200px" },
    exited: { maxHeight: "200px" },
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    if (commentRef.current) {
      setHeight(commentRef.current.scrollHeight);

      if (commentRef.current.scrollHeight > 200) {
        setShowToggle(true);
      }
    }
  }, []);

  return (
    <Transition in={showMore} timeout={duration}>
      {(state) => (
        <>
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
            ref={commentRef}
          >
            {quote.user && (
              <div className="quote-author">
                {dictionary.quotedCommentFrom} {quote.user.name}
              </div>
            )}
            <div className="quote border-side" dangerouslySetInnerHTML={{ __html: quote.body }} />
          </div>
          {showToggle && (
            <ShowMoreBtn onClick={handleShowMore} className="btn-toggle-show cursor-pointer mt-2">
              {showMore ? dictionary.showLess : dictionary.showMore}
            </ShowMoreBtn>
          )}
        </>
      )}
    </Transition>
  );
};

export default Quote;
