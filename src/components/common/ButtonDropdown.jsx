import React, { useCallback, useRef, useState } from 'react';
import styled from "styled-components";
import {useOutsideClick} from "../hooks";

const Wrapper = styled.div`
`

const ButtonDropdown = props => {

    const {dropdown} = props;
    const wrapperRef = useRef();
    const [show, setShow] = useState(false);
    const toggle = useCallback(() => {
        setShow(!show)
    }, [show]);

    useOutsideClick(wrapperRef, toggle, show);

    return (
        <Wrapper ref={wrapperRef}>
            <a className={`btn btn-outline-light dropdown-toggle ${show ? "show" : ""}`} 
            data-toggle="dropdown"
            onClick={toggle}>
                {dropdown.label}
            </a>
            <div className={`dropdown-menu ${show ? "show" : ""}`}>
                {
                    dropdown.items.map(item => {
                        return <a className="dropdown-item" 
                            data-value={item.value}
                            data-name={item.label} 
                            onClick={e => {
                                item.onClick(e)
                                toggle()
                            }}>
                            {item.label}
                        </a>
                    })
                }
            </div>
        </Wrapper>
    );
};

export default ButtonDropdown;