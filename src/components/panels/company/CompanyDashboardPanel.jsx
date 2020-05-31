import React from "react";
import styled from "styled-components";
import {_t} from "../../hooks/useTranslation";

const Wrapper = styled.div`
`;

const CompanyDashboardPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                {_t("DASHBOARD", "Dashboard")}
            </div>
        </Wrapper>
    );
};

export default React.memo(CompanyDashboardPanel);