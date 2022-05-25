import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { useSettings, useTranslationActions, useWorkspaceActions, useUpdateSmartBannerMeta } from "../../hooks";
import { FavoriteWorkspacesPanel, MainSidebarLinks, MainLogo } from "./index";
import NewModalButtons from "./NewModalButtons";

const FONT_COLOR_DARK_MODE = "#CBD4DB";

const Wrapper = styled.div`
  .navigation-menu-tab-header {
    display: flex;
    justify-content: center;
    align-items: center;
    //padding: 30px;
    margin-bottom: 1rem;
    min-height: 74px;
    max-height: 74px;
    background-color: ${({ theme }) => theme.colors.fifth};
    .driff-logo {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background-color: #fff3;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #fff3;
      @media (max-width: 620px) {
        width: 75px;
        height: 75px;
      }
    }
    @media (max-width: 620px) {
      padding: 20px 0;
    }
    .dark & {
      background-color: inherit;
    }
  }
  .driff-company-name {
    display: flex;
    align-items: center;
    position: relative;

    &.active {
      svg {
        &.action {
          opacity: 1;
        }
      }
    }

    &:hover {
      svg {
        &.action {
          opacity: 1;
        }
      }
    }

    a {
      width: 100%;
      input {
        width: calc(100% - 28px);
        background-color: #fff;
        border: none;
        color: #000;
        border-radius: 6px;
        padding-left: 6px;
      }
    }

    svg {
      &.action {
        opacity: 0;
        cursor: pointer;
        width: 14px;
        color: #fff;
        top: 8px;
        right: 22px;
        position: absolute;
        transition: all 0.5s ease;
      }
    }
  }
  .your-workspaces-title {
    margin: 0 15px;
    padding: 15px 10px 10px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff9;
    border-top: 1px solid #fff3;
    svg {
      color: #ffffff;
    }
    @media (max-width: 620px) {
      padding: 15px 2px 15px 2px;
      font-size: 10px;
      text-transform: uppercase;
      svg {
        margin-right: 3px;
        stroke: #fff9;
        width: 16px;
        height: 16px;
      }
    }
  }
  li {
    position: relative;
  }
  .navigation-menu-group {
    -ms-overflow-style: none;
    scrollbar-width: none;
    height: 78vh;
    overflow: scroll;
    overscroll-behavior: contain;
    margin: 0 15px;
    &::-webkit-scrollbar {
      display: none;
    }
    ul li a {
      justify-content: space-between;
      height: 40px;
      padding: 0 10px;
      @media (max-width: 620px) {
        color: #ffffff;
        padding: 0 8px;
      }
    }
  }
  .navigation-menu-tab-header-options {
    margin-bottom: 1rem;
    @media (max-width: 620px) {
      margin-bottom: 10px;
    }
  }
`;

const CirclePlus = styled(SvgIconFeather)`
  height: 14px;
  width: 14px;
  margin-right: 4px;
`;

const NavNewWorkspace = styled.button`
  background: #fff3 !important;
  border: 0 !important;
  margin: 0;
  width: 100%;
  height: 40px;
  justify-content: center;
  align-items: center;
  color: ${({ theme, dark_mode }) => (dark_mode === "1" ? FONT_COLOR_DARK_MODE : theme.colors.sidebarTextColor)} !important;

  div {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
  }
`;

const NewBtnWrapper = styled.div`
  margin: 15px 30px;
  /* color: ${({ theme }) => theme.colors.sidebarTextColor}!important; */
`;

const MainNavigationTabPanel = (props) => {
  const { className = "", isExternal } = props;

  const count = useSelector((state) => state.global.todos.count);
  const { updateCompanyName, driffSettings, generalSettings } = useSettings();
  const user = useSelector((state) => state.session.user);
  const { _t } = useTranslationActions();
  useUpdateSmartBannerMeta();
  const params = useParams();
  const actions = useWorkspaceActions();
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const channels = useSelector((state) =>
    Object.values(state.chat.channels).map((channel) => {
      return { id: channel.id, code: channel.code };
    })
  );

  const { dark_mode } = generalSettings;

  useEffect(() => {
    if (params.workspaceId && activeTopic) {
      if (parseInt(params.workspaceId) !== activeTopic.id && !activeTopic.sharedSlug && workspaces[params.workspaceId]) {
        // if url params of workspace id is not equal to active workspace id then set workspace and channel
        actions.selectWorkspace(workspaces[params.workspaceId]);
      }
    }
    if (params.code && selectedChannel) {
      if (selectedChannel.code !== params.code) {
        // if active channel code is not equal to chat url channel code then set channel
        let channel = channels.find((c) => c.code === params.code);
        if (channel) actions.selectChannel({ id: channel.id });
      }
    }
  }, [params, workspaces, activeTopic, selectedChannel]);

  const [showButtons, setShowbuttons] = useState(false);

  const dictionary = {
    allWorkspaces: _t("SIDEBAR.ALL_WORKSPACES", "Browse workspaces"),
    people: _t("SIDEBAR.PEOPLE", "All people"),
    workspace: _t("SIDEBAR.WORKSPACE", "Workspace"),
    workspaces: _t("SIDEBAR.WORKSPACES", "Workspaces"),
    chats: _t("SIDEBAR.CHATS", "Chats"),
    yourWorkspaces: _t("SIDEBAR.YOUR_WORKSPACES", "Your workspaces"),
    newWorkspace: _t("SIDEBAR.NEW_WORKSPACE", "New workspace"),
    addNewWorkspace: _t("SIDEBAR.ADD_NEW_WORKSPACES", "Add new workspace"),
    workspacesFolder: _t("SIDEBAR.WORKSPACES_FOLDER", "Workspaces"),
    generalFolder: _t("SIDEBAR.GENERAL_FOLDER", "General"),
    archivedFolder: _t("SIDEBAR.ARCHIVED_FOLDER", "Archived workspaces"),
    shortcuts: _t("SIDEBAR.SHORTCUTS", "Shortcuts"),
    personalLinks: _t("SIDEBAR.PERSONAL_LINKS", "Personal"),
    companyLinks: _t("SIDEBAR.COMPANY_LINKS", "Company"),
    addPersonalShortcut: _t("SIDEBAR.ADD_PERSONAL_SHORTCUT", "Add personal shortcut"),
    todoLinks: _t("SIDEBAR.TODO_LINKS", "Reminders"),
    addTodoItem: _t("SIDEBAR.ADD_TODO_ITEM", "Add reminder"),
    createWorkspace: _t("WORKSPACE.CREATE_WORKSPACE", "Create workspace"),
    sidebarTextCreateWorkspace: _t("WORKSPACE.TEXT_CREATE_WORKSPACE", "Create workspace"),
    bots: _t("SIDEBAR.BOTS", "Bots"),
    favoriteWorkspaces: _t("SIDEBAR.FAVORITE_WORKSPACES", "Favorite workspaces"),
    browseAll: _t("SIDEBAR.BROWSE_ALL", "Browse all..."),
    toasterCreateTodo: _t("TOASTER.TODO_CREATE_SUCCESS", "You will be reminded about this comment under <b>Reminders</b>."),
    toasterGeneraError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    chat: _t("SIDEBAR.CHAT", "Chat"),
    post: _t("SIDEBAR.POST", "Post"),
    reminder: _t("SIDEBAR.REMINDER", "Reminder"),
    addNew: _t("SIDEBAR.ADD_NEW", "Add new"),
    startBrowsing: _t("SIDEBAR.START_BROWSING", "Start browsing..."),
    addYourFavWs: _t("SIDEBAR.ADD_YOUR_FAVORITE_WORKSPACE", "Add your favorite <br/>workspaces here, ::name::!", { name: user.first_name }),
    newFolder: _t("TOOLTIP.NEW_FOLDER", "New folder"),
    meeting: _t("SIDEBAR.MEETING", "Meeting"),
    toasterMeetingTodo: _t("TOASTER.VIDEO_MEETING_CREATE_SUCCESS", "You will be reminded about this meeting under <b>Meetings</b>."),
  };

  const handleShowModalButtons = () => {
    setShowbuttons((prevState) => !prevState);
  };

  return (
    <Wrapper className={`navigation-menu-tab ${className}`}>
      <div className="navigation-menu-tab-header" data-toggle="tooltip" title="Driff" data-placement="right" data-original-title="Driff">
        <MainLogo />

        {/* <MainBackButton /> */}
      </div>
      <MainSidebarLinks count={count} dictionary={dictionary} isExternal={isExternal} driffSettings={driffSettings} user={user} updateCompanyName={updateCompanyName} />

      <FavoriteWorkspacesPanel dictionary={dictionary} generalSettings={generalSettings} isExternal={isExternal} user={user} />
      <NewModalButtons dictionary={dictionary} isExternal={isExternal} onShowModalButtons={handleShowModalButtons} showButtons={showButtons} />

      <NewBtnWrapper>
        <NavNewWorkspace dark_mode={dark_mode} onClick={handleShowModalButtons} className="btn btn-outline-light" type="button">
          <div>
            <CirclePlus icon="circle-plus" />
            {dictionary.addNew}
          </div>
        </NavNewWorkspace>
      </NewBtnWrapper>
    </Wrapper>
  );
};

export default MainNavigationTabPanel;
