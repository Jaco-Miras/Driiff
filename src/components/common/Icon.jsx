import React, {forwardRef} from "react";
import styled from "styled-components";

const iconDriffLogo = require("../../assets/icon/driff-logo.svg");

const Wrapper = styled.i`
    ${props => props.rotate && `transform: rotate(${props.rotate}deg);`};    
    display: inline-block;
    width: ${props => props.width ? props.width : "18px"};
    height: ${props => props.height ? props.height : "18px"};    
    -webkit-mask-image: url(${props => props.src});
    mask-image: url(${props => props.src});
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    ${props => props.bgColor && `background-color: ${props.bgColor};`}
`;

const Icon = forwardRef((props, ref) => {

    const {className = "", dataTip = "", rotate, type, ...rest} = props;

    const getIconImageSource = (type) => {
        switch (type) {
            case "driff-logo":
                return iconDriffLogo;
            default:
                return type;
        }
    };

    return (
        <Wrapper
            ref={ref}
            alt={`${type} icon`}
            className={`icon-${type} ${className}`}
            src={getIconImageSource(type)}
            data-event="touchstart focus mouseover"
            data-event-off="mouseout"
            data-tip={dataTip}
            {...rest}
        />
    );
});

export default React.memo(Icon);