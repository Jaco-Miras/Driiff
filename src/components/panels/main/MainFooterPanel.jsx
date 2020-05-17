import React from "react";
import styled from "styled-components";

const Wrapper = styled.footer`    
`;

const MainFooterPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`${className}`}>
            <div className={`container-fluid`}>
                <div>&copy; {`2020`} Made with {`<3`} by Driff</div>
                <div>
                    <nav className="nav">
                        <a href="https://themeforest.net/licenses/standard"
                           className="nav-link">Licenses</a><a
                        href="/" className="nav-link">Change Log</a><a href="/" className="nav-link">Get Help</a></nav>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(MainFooterPanel);