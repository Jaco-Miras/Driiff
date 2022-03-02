import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SvgIconFeather, ToolTip } from "../../common";
import { FancyLink } from "../../common";
import { getQuickLinks, addToModals } from "../../../redux/actions/globalActions";
import { useSettings } from "../../hooks";
import { getWorkspaceQuickLinks } from "../../../redux/actions/workspaceActions";

const Wrapper = styled.div`
  > span {
    display: flex;
    align-items: center;
    //font-weight: 600;
  }
  .feather {
    width: 1rem;
    height: 1rem;
  }
  .feather-link {
    margin-right: 0.5rem;
  }
  .feather-info {
    margin-left: 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 190px;
    overflow: auto;
    li {
      padding-top: 10px;
    }
    li:not(:last-child) {
      border-bottom: 1px solid #f1f2f7;
      .dark & {
        border-bottom: 1px solid rgba(155, 155, 155, 0.1);
      }
    }
  }
  a {
    box-shadow: none !important;
  }
`;

const ShortcutsCard = (props) => {
  const { dictionary, isWorkspace = false } = props;
  const params = useParams();
  const dispatch = useDispatch();
  const companyLinks = useSelector((state) => state.global.links.filter((l) => l.id && l.menu_name.trim() !== "" && l.link.trim() !== ""));
  const linksFetched = useSelector((state) => state.global.linksFetched);
  const wsQuickLinks = useSelector((state) => state.workspaces.workspaceQuickLinks[params.workspaceId]);
  const { generalSettings, showModal } = useSettings();

  const handleAddItemClick = () => {
    showModal("personal_link_create");
  };

  const handleShowWsQuicklinksModal = () => {
    let payload = {
      type: "workspace-quicklinks",
      links: wsQuickLinks,
      workspaceId: params.workspaceId,
    };
    dispatch(addToModals(payload));
  };

  useEffect(() => {
    if (!linksFetched && !isWorkspace) dispatch(getQuickLinks());
    if (isWorkspace) dispatch(getWorkspaceQuickLinks({ workspace_id: params.workspaceId }));
  }, []);

  return (
    <Wrapper>
      <span>
        <SvgIconFeather icon="link" /> <h5 className="card-title mb-0">{dictionary.shortcuts}</h5>{" "}
        <ToolTip content={isWorkspace ? dictionary.wsShorcutsTooltip : dictionary.shorcutsTooltip}>
          <SvgIconFeather icon="info" />
        </ToolTip>
        {isWorkspace && wsQuickLinks && <SvgIconFeather className="ml-auto" icon="circle-plus" width={24} height={24} onClick={handleShowWsQuicklinksModal} />}
      </span>
      {companyLinks.length === 0 && linksFetched && !isWorkspace && <span className="mt-3">{dictionary.noQuickLinks}</span>}
      {isWorkspace && wsQuickLinks && wsQuickLinks.filter((l) => l.link !== "").length === 0 && <span className="mt-3">{dictionary.noWsQuickLinks}</span>}
      {!isWorkspace && (
        <ul className="mt-2">
          {companyLinks.map((l) => {
            return (
              <li key={l.id}>
                <FancyLink link={l.link} title={l.menu_name} />
              </li>
            );
          })}
        </ul>
      )}
      {isWorkspace && wsQuickLinks && (
        <ul className="mt-2">
          {wsQuickLinks
            .filter((l) => l.link !== "")
            .map((l) => {
              return (
                <li key={l.id}>
                  <FancyLink link={l.link} title={l.menu_name} />
                </li>
              );
            })}
        </ul>
      )}
      {!isWorkspace && (
        <>
          <span className="personal-links-label d-flex mt-2">
            {dictionary.personalLinks}
            <SvgIconFeather className="ml-auto" icon="circle-plus" width={24} height={24} onClick={handleAddItemClick} />
          </span>
          {generalSettings.personal_links.length > 0 && (
            <ul className="mt-2">
              {generalSettings.personal_links.map((l, index) => {
                return (
                  <li key={l.id}>
                    <FancyLink link={l.web_address} title={l.name} />
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default React.memo(ShortcutsCard);
