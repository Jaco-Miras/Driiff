import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAdminActions, useTranslationActions } from "../../hooks";
import { SvgIconFeather } from "../../common";
import GrippSyncForm from "./GrippSyncForm";
import GrippBots from "./GrippBots";

const Wrapper = styled.div`
  .gripp-card-body {
    padding: 0.8rem;
    height: 120px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    cursor: pointer;
    background-color: #fafafa;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h3,
  h5 {
    margin: 0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  h3,
  h5 {
    margin: 0;
  }
  .feather {
    width: 2rem;
    height: 2rem;
    stroke-width: 3;
  }
  > div {
    display: flex;
    flex-flow: column;
    align-items: flex-end;
    text-align: right;
    height: 100%;
    justify-content: flex-end;
  }
`;
const LabelBackButton = styled.div`
  display: flex;
  align-items: center;
  h5 {
    margin: 0;
  }
  .back-button {
    cursor: pointer;
  }
`;

const GrippBotBody = () => {
  const { _t } = useTranslationActions();

  const { setAdminFilter, fetchGrippBot } = useAdminActions();
  const componentIsMounted = useRef(true);

  const dictionary = {
    grippLabel: _t("ADMIN.GRIPP_LABEL", "Gripp"),
  };

  //["main", "sync-form", "sync-lists", "gripp-bots"]
  const [activePage, setActivePage] = useState("main");
  const filters = useSelector((state) => state.admin.filters);
  const automation = useSelector((state) => state.admin.automation);
  const { hasGrippLinked, grippBots } = automation;

  useEffect(() => {
    setAdminFilter({ filters: { ...filters, automation: true } });
    if (hasGrippLinked === null) {
      fetchGrippBot({});
    }
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  return (
    <Wrapper>
      <LabelBackButton className="mb-3">
        <h5 className="mr-3">{dictionary.grippLabel}</h5>
        {activePage !== "main" && (
          <span className="back-button" onClick={() => setActivePage("main")}>
            <SvgIconFeather icon="arrow-left" /> Back
          </span>
        )}
      </LabelBackButton>
      {hasGrippLinked === true && activePage === "main" && (
        <div className="row">
          <div className="col-12 col-md-3">
            <div className="card border">
              <div className="gripp-card-body">
                <CardHeader>
                  <SvgIconFeather icon="refresh-ccw" />
                  <div>
                    <h3>0</h3>
                    <h5>Sync gripp user</h5>
                  </div>
                </CardHeader>
                <CardFooter>
                  <h5>Detail</h5>
                  <SvgIconFeather icon="arrow-right-circle" />
                </CardFooter>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="card border">
              <div className="gripp-card-body">
                <CardHeader>
                  <SvgIconFeather icon="download" />
                  <div>
                    <h5>Import gripp user</h5>
                  </div>
                </CardHeader>
                <CardFooter>
                  <h5>Detail</h5>
                  <SvgIconFeather icon="arrow-right-circle" />
                </CardFooter>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="card border">
              <div className="gripp-card-body" onClick={() => setActivePage("gripp-bots")}>
                <CardHeader>
                  <SvgIconFeather icon="admin-bot" viewBox="0 0 54 54" />
                  <div>
                    <h3>{grippBots.length}</h3>
                    <h5>Gripp bots</h5>
                  </div>
                </CardHeader>
                <CardFooter>
                  <h5>Detail</h5>
                  <SvgIconFeather icon="arrow-right-circle" />
                </CardFooter>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="card border">
              <div className="gripp-card-body">
                <CardHeader>
                  <h5>Reset profile image</h5>
                </CardHeader>
                <CardFooter>
                  <button className="btn btn-primary">Reset</button>
                </CardFooter>
              </div>
            </div>
          </div>
        </div>
      )}
      {hasGrippLinked === false && activePage === "main" && (
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="card border">
              <div className="gripp-card-body" onClick={() => setActivePage("sync-form")}>
                <CardHeader>
                  <SvgIconFeather icon="refresh-ccw" />
                  <div>
                    <h3>0</h3>
                    <h5>Sync gripp user</h5>
                  </div>
                </CardHeader>
                <CardFooter>
                  <h5>Detail</h5>
                  <SvgIconFeather icon="arrow-right-circle" />
                </CardFooter>
              </div>
            </div>
          </div>
        </div>
      )}
      {hasGrippLinked === false && activePage === "sync-form" && <GrippSyncForm />}
      {hasGrippLinked === true && activePage === "gripp-bots" && <GrippBots bots={grippBots} />}
    </Wrapper>
  );
};

export default GrippBotBody;
