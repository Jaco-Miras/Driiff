import React, {forwardRef} from "react";
import styled from "styled-components";

const Wrapper = styled.form`
`;

const SearchForm = forwardRef((props, ref) => {

    const {className = "", onChange, onClick, placeholder = "Search"} = props;

    return (
        <Wrapper className={`${className}`}>
            <div className="input-group">
                <input ref={ref} onChange={onChange} type="text" className="form-control" placeholder={placeholder}/>
                <div className="input-group-append">
                    <button onClick={onClick} className="btn btn-outline-light" type="button">
                        <i className="ti-search"></i>
                    </button>
                </div>
            </div>
        </Wrapper>
    );
});

export default React.memo(SearchForm);