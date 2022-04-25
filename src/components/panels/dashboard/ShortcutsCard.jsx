import React, { useEffect, useState } from "react";
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
  const { dictionary, isWorkspace = false } = props;
  const params = useParams();
  const dispatch = useDispatch();
  const companyLinks = useSelector((state) => state.global.links.filter((l) => l.id && l.menu_name.trim() !== "" && l.link.trim() !== ""));
  const linksFetched = useSelector((state) => state.global.linksFetched);
  const wsQuickLinks = useSelector((state) => state.workspaces.workspaceQuickLinks[params.workspaceId]);
  const [fetchingWsQuicklinks, setFetchingWsQuicklins] = useState(false);
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

  const handleEditPersonalLink = (index) => {
    showModal("personal_link_edit", {
      ...generalSettings.personal_links[index],
      index: index,
    });
  };

  useEffect(() => {
    if (!linksFetched && !isWorkspace) dispatch(getQuickLinks());
    if (isWorkspace && !wsQuickLinks) {
      dispatch(getWorkspaceQuickLinks({ workspace_id: params.workspaceId }));
    }
  }, []);

  useEffect(() => {
    if (fetchingWsQuicklinks) return;
    if (isWorkspace && !wsQuickLinks) {
      setFetchingWsQuicklins(true);
      dispatch(getWorkspaceQuickLinks({ workspace_id: params.workspaceId }, () => setFetchingWsQuicklins(false)));
    }
  }, [params.workspaceId, wsQuickLinks]);

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
            const securedLink = !l.link.startsWith("http") ? "https://" + l.link : l.link;
            return (
              <li key={l.id}>
                <FancyLink link={securedLink} title={l.menu_name} />
              </li>
            );
          })}
        </ul>
      )}
      {isWorkspace && wsQuickLinks && (
        <ul className="mt-2 ws-quicklinks-lists">
          {wsQuickLinks
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
