import React, { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";
import emptyStateImg1 from "../../assets/img/empty-states-img/empty_state_1.svg";
import emptyStateImg2 from "../../assets/img/empty-states-img/empty_state_2.svg";
import emptyStateImg3 from "../../assets/img/empty-states-img/empty_state_3.svg";
import emptyStateImg4 from "../../assets/img/empty-states-img/empty_state_4.svg";

const NoReplyDiv = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  img {
    width: 100%;
    max-height: 40%;
    margin: auto;
  }
`;

const NoReply = forwardRef((props, ref) => {
  const { className = "" } = props;
  const emptyStateImgArr = [emptyStateImg1, emptyStateImg2, emptyStateImg3, emptyStateImg4];
  const [emptyStateImg, setEmptyStateImg] = useState("");

  useEffect(() => {
    let img = emptyStateImgArr[Math.floor(Math.random() * emptyStateImgArr.length)];
    setEmptyStateImg(img);
  }, [emptyStateImgArr]);

  return (
    <NoReplyDiv ref={ref} className={`no-reply-container ${className}`}>
      {<img src={emptyStateImg} alt="#" />}
    </NoReplyDiv>
  );
});

export default React.memo(NoReply);
