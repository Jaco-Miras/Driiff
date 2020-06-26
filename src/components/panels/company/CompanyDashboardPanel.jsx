import React from "react";
import styled from "styled-components";
import {useTranslation} from "../../hooks";

const Wrapper = styled.div`
`;

const CompanyDashboardPanel = (props) => {

    const {className = ""} = props;

    const {_t} = useTranslation();

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                {_t("DASHBOARD", "Dashboard")}
            </div>
        </Wrapper>
    );
};

export default React.memo(CompanyDashboardPanel);