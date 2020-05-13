import React from "react";
import styled from "styled-components";

const Wrapper = styled.footer`    
`;

const DashboardFooterPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`container-fluid ${className}`}>
            <div>&copy; {`2020`} Made with {`<3`} by Driff</div>
            <div>
                <nav className="nav">
                    <a href="https://themeforest.net/licenses/standard"
                       className="nav-link">Licenses</a><a
                    href="/" className="nav-link">Change Log</a><a href="/" className="nav-link">Get Help</a></nav>
            </div>
        </Wrapper>
    );
};

export default React.memo(DashboardFooterPanel);