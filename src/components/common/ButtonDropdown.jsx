import React, {useCallback, useRef, useState} from "react";
import styled from "styled-components";
import {useOutsideClick} from "../hooks";

const Wrapper = styled.div`
    .dropdown-toggle {
        &:after {
            margin-left: 10px;
        }
        
        &.show {
            color: #fff;
            background: #afb8bd;
            border-color: #afb8bd;
        }
    }
    .dropdown-item {
        cursor: pointer;
        cursor: hand;
    }
`;

const ButtonDropdown = props => {

    const {className = "", value = null, dropdown} = props;

    const wrapperRef = useRef();

    const [show, setShow] = useState(false);

    const toggle = useCallback(() => {
        setShow(!show);
    }, [show]);

    useOutsideClick(wrapperRef, toggle, show);

    return (
        <Wrapper className={`button-dropdown ${className}`} ref={wrapperRef}>
            <span
                className={`btn btn-outline-light dropdown-toggle d-flex justify-content-between ${show ? "show" : ""} ${value !== null ? "active" : ""}`}
                data-toggle="dropdown"
                onClick={toggle}>
                {dropdown.label}
            </span>
            <div className={`dropdown-menu ${show ? "show" : ""}`}>
                {
                    dropdown.items.map(item => {
                        return <span
                            className={`dropdown-item d-flex justify-content-between ${value === item.value ? "active" : ""}`}
                            key={item.value}
                            data-value={item.value}
                            onClick={e => {
                                item.onClick(e);
                                toggle();
                            }}>
                            {item.label}
                        </span>;
                    })
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(ButtonDropdown);