import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import emojiIcon from "../../assets/img/svgs/chat/emoji-inactive.svg";


const EmojiBtn = styled.div`
    background-image: url(${emojiIcon});
    width: 25px;
    height: 25px;
    max-width: 25px;
    max-height: 25px;
    background-size: 90%;
    background-position:center;
    background-repeat: no-repeat;
    cursor: pointer;
    position: relative;
`;

const EmojiButton = React.forwardRef((props, ref) => {
    const {className = "", onEmojiBtnClick} = props;

    return (
        <EmojiBtn
            className={`btn btn-ico btn-emoji ${className}`}
            onClick={onEmojiBtnClick}
            data-event="touchstart focus mouseover"
            data-event-off="mouseout"
            data-tip="Add emoji"
            ref={ref}
        />
    );
});

export default EmojiButton;

EmojiButton.propTypes = {
    className: PropTypes.string,
};
