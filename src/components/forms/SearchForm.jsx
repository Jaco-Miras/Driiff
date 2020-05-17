import React from "react";
import styled from "styled-components";

const Wrapper = styled.form`
`;

const SearchForm = (props) => {

    const {className = "", onChange, onClick} = props;

    return (
        <Wrapper className={`${className}`}>
            <div className="input-group">
                <input onChange={onChange} type="text" className="form-control" placeholder="Chat search"/>
                <div className="input-group-append">
                    <button onClick={onClick} className="btn btn-outline-light" type="button">
                        <i className="ti-search"></i>
                    </button>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(SearchForm);