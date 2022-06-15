import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import { useFocusInput, useTranslationActions, useUserChannels, useFetchWsCount, useGetSlug } from "../../hooks";
import { PeopleListItem } from "../../list/people/item";
import { replaceChar } from "../../../helpers/stringFormatter";
import { SvgIconFeather } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";
import { useDispatch, useSelector } from "react-redux";

const Wrapper = styled.div`
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  .people-header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 1rem;
    flex-flow: row wrap;
  }
`;

const Search = styled(SearchForm)`
  width: 50%;
  margin-bottom: 1rem;
  min-width: 250px;
  padding-right: 14px;
  @media all and (max-width: 991.99px) {
    width: 100%;
    padding-right: 1rem;
  }
`;

const WorkspacePeoplePanel = (props) => {
  const { className = "", isExternal, isMember, workspace } = props;

  const dispatch = useDispatch();
  const { selectUserChannel, loggedUser } = useUserChannels();
  const { activeTopic } = useSelector((state) => state.workspaces);

  const history = useHistory();

  useFetchWsCount();

  const [search, setSearch] = useState("");

  const refs = {
    search: useRef(),
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const emptySearchInput = () => {
    setSearch("");
  };

  const handleUserNameClick = (user) => {
    history.push(`/profile/${user.id}/${replaceChar(user.name)}`);
  };

  const handleUserChat = (user) => selectUserChannel(user);

  useEffect(() => {
    refs.search.current.focus();
  }, []);

  let members = [];
  if (workspace) {
    members = workspace.members;
  }
  const userSort = members
    .filter((user) => {
      if (search !== "") {
        if (user.name.toLowerCase().search(search.toLowerCase()) === -1 && user.email.toLowerCase().search(search.toLowerCase()) === -1) return false;
      }

      return true;
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  const handleEditWorkspace = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "edit",
      item: activeTopic,
    };

    dispatch(addToModals(payload));
  };

  const { _t } = useTranslationActions();
  const slug = useGetSlug();

  const dictionary = {
    searchPeoplePlaceholder: _t("PLACEHOLDER.SEARCH_PEOPLE", "Search by name or email"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited"),
    peopleManage: _t("PEOPLE.MANAGE", "Manage People"),
    roleAdvisor: _t("ROLE.ADVISOR", "Advisor"),
    roleApprover: _t("ROLE.APPROVER", "Approver"),
    roleClient: _t("ROLE.CLIENT", "Client"),
    roleCommunicationLead: _t("ROLE.COMMUNICATION_LEAD", "Communication lead"),
    roleDesigner: _t("ROLE.DESIGNER", "Designer"),
    roleDeveloper: _t("ROLE.DEVELOPER", "Developer"),
    roleFreelancer: _t("ROLE.FREELANCER", "Freelancer"),
    roleSupervisor: _t("ROLE.SUPERVISOR", "Supervisor"),
    roleTeamLead: _t("ROLE.TEAM_LEAD", "Team lead"),
    roleTechnicalAdvisor: _t("ROLE.TECHNICAL_ADVISOR", "Technical advisor"),
    roleTechnicalLead: _t("ROLE.TECHNICAL_LEAD", "Technical lead"),
    roleWatcher: _t("ROLE.WATCHER", "Watcher"),
    connectedWorkspaceIcon: _t("TOOLTIP.CONNECTED_WORKSPACE", "Connected workspace"),
    phoneIcon: _t("TOOLTIP.PHONE", "Call profile phone number"),
    messageIcon: _t("TOOLTIP.MESSAGE_BUBBLE", "Send a chat to this person"),
  };

  useFocusInput(refs.search.current);
  const sharedWorkspace = workspace && workspace.slug ? workspace.slug !== slug : false;

  return (
    <Wrapper className={`workspace-people fadeIn container-fluid ${className}`}>
      <div className="card">
        <div className="card-body">
          <div className="people-header">
            <Search ref={refs.search} value={search} closeButton="true" onClickEmpty={emptySearchInput} placeholder={dictionary.searchPeoplePlaceholder} onChange={handleSearchChange} autoFocus />
            {!isExternal && isMember && (
              <div>
                <button className="btn btn-primary" onClick={handleEditWorkspace}>
                  <SvgIconFeather className="mr-2" icon="user-plus" /> {dictionary.peopleManage}
                </button>
              </div>
            )}
          </div>
          <div className="row">
            {userSort.map((user) => {
              return (
                <PeopleListItem
                  key={user.id}
                  loggedUser={loggedUser}
                  user={user}
                  onNameClick={handleUserNameClick}
                  onChatClick={handleUserChat}
                  dictionary={dictionary}
                  showWorkspaceRole={true}
                  sharedUser={workspace.sharedSlug}
                  isSharedWorkspace={sharedWorkspace}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspacePeoplePanel);
