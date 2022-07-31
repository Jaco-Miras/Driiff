import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useRouteMatch } from "react-router-dom";
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
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }
    li {
      padding-top: 10px;
      display: flex;
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const PersonalLinkList = styled.li`
  display: flex;
  align-items: center;
  a {
    margin: 0;
  }
  .feather {
    margin-left: auto;
    display: none;
  }
  :hover {
    .feather {
      display: block;
    }
  }
`;

const ShortcutsCard = (props) => {
  const { dictionary, isWorkspace = false, workspace = null } = props;
  const route = useRouteMatch();
  const { params, url } = route;
  const dispatch = useDispatch();
  const companyLinks = useSelector((state) => state.global.links.filter((l) => l.id && l.menu_name.trim() !== "" && l.link.trim() !== ""));
  const linksFetched = useSelector((state) => state.global.linksFetched);
  const wsQuickLinks = useSelector((state) => state.workspaces.workspaceQuickLinks);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const [fetchingWsQuicklinks, setFetchingWsQuicklins] = useState(false);
  const { generalSettings, showModal } = useSettings();

  const workspaceRef = useRef(null);
  const sharedWsRef = useRef(null);

  useEffect(() => {
    if (workspace) workspaceRef.current = workspace;
    if (sharedWs) sharedWsRef.current = sharedWs;
  }, [workspace, sharedWs]);

  let hubQuicklinks = url.startsWith("/shared-hub") && workspace && workspace.sharedSlug ? wsQuickLinks[workspace.key] : wsQuickLinks[params.workspaceId];

  const handleAddItemClick = () => {
    showModal("personal_link_create");
  };

  const handleShowWsQuicklinksModal = () => {
    let payload = {
      type: "workspace-quicklinks",
      links: hubQuicklinks,
      workspaceId: params.workspaceId,
      sharedSlug: workspace && workspace.sharedSlug ? workspace.slug : null,
    };
    dispatch(addToModals(payload));
  };

  const handleEditPersonalLink = (index) => {
    showModal("personal_link_edit", {
      ...generalSettings.personal_links[index],
      index: index,
    });
  };

  useEffect(() => {
    if (!linksFetched && !isWorkspace) dispatch(getQuickLinks());
    let payload = {
      workspace_id: params.workspaceId,
    };
    if (isWorkspace && url.startsWith("/hub") && !wsQuickLinks[params.workspaceId]) {
      dispatch(getWorkspaceQuickLinks(payload));
    } else if (isWorkspace && url.startsWith("/shared-hub") && workspace && !wsQuickLinks[workspace.key]) {
      if (workspace && workspace.sharedSlug && sharedWs[workspace.slug]) {
        payload = {
          ...payload,
          sharedPayload: { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true },
        };
        dispatch(getWorkspaceQuickLinks(payload));
      }
    }
  }, []);

  useEffect(() => {
    if (fetchingWsQuicklinks) return;
    let payload = {
      workspace_id: params.workspaceId,
    };
    if (isWorkspace && url.startsWith("/hub") && !wsQuickLinks[params.workspaceId]) {
      setFetchingWsQuicklins(true);
      dispatch(getWorkspaceQuickLinks(payload, () => setFetchingWsQuicklins(false)));
    } else if (isWorkspace && url.startsWith("/shared-hub") && workspaceRef.current && !wsQuickLinks[workspaceRef.current.key]) {
      if (workspaceRef.current && workspaceRef.current.sharedSlug) {
        payload = {
          ...payload,
          sharedPayload: { slug: workspaceRef.current.slug, token: sharedWs[workspaceRef.current.slug].access_token, is_shared: true },
        };
        setFetchingWsQuicklins(true);
        dispatch(getWorkspaceQuickLinks(payload, () => setFetchingWsQuicklins(false)));
      }
    }
  }, [params.workspaceId, wsQuickLinks, url, fetchingWsQuicklinks, workspace]);

  return (
    <Wrapper>
      <span>
        <SvgIconFeather icon="link" /> <h5 className="card-title mb-0">{dictionary.shortcuts}</h5>{" "}
        <ToolTip content={isWorkspace ? dictionary.wsShorcutsTooltip : dictionary.shorcutsTooltip}>
          <SvgIconFeather icon="info" />
        </ToolTip>
        {isWorkspace && hubQuicklinks && <SvgIconFeather className="ml-auto" icon="circle-plus" width={24} height={24} onClick={handleShowWsQuicklinksModal} />}
      </span>
      {companyLinks.length === 0 && linksFetched && !isWorkspace && <span className="mt-3">{dictionary.noQuickLinks}</span>}
      {isWorkspace && hubQuicklinks && hubQuicklinks.filter((l) => l.link !== "").length === 0 && <span className="mt-3">{dictionary.noWsQuickLinks}</span>}
      {!isWorkspace && (
        <ul className="mt-2">
          {companyLinks.map((l) => {
            const securedLink = !l.link.startsWith("http") ? "https://" + l.link : l.link;
            return (
              <li key={l.id}>
                <FancyLink link={securedLink} title={l.menu_name} />
              </li>
            );
          })}
        </ul>
      )}
      {isWorkspace && hubQuicklinks && (
        <ul className="mt-2 ws-quicklinks-lists">
          {hubQuicklinks
            .filter((l) => l.link !== "")
            .map((l) => {
              const securedLink = !l.link.startsWith("http") ? "https://" + l.link : l.link;
              return (
                <li key={l.id}>
                  <FancyLink link={securedLink} title={l.menu_name} />
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
                const securedLink = !l.web_address.startsWith("http") ? "https://" + l.web_address : l.web_address;
                return (
                  <PersonalLinkList key={index}>
                    <FancyLink link={securedLink} title={l.name} key={l.id} />
                    <SvgIconFeather className="cursor-pointer" data-index={index} icon="pencil" onClick={() => handleEditPersonalLink(index)} />
                  </PersonalLinkList>
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
