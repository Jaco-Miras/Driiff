import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { Avatar, SvgIconFeather } from "../common";
import { CheckBox } from "../forms";
import { useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { toggleShowAbout } from "../../redux/actions/workspaceActions";
import { sessionService } from "redux-react-session";
import TeamListItem from "../list/people/item/TeamListItem";
import RecentPostItem from "../list/post/item/RecentPostItem";
import { replaceChar } from "../../helpers/stringFormatter";

const ModalHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  h4 {
    margin: 0;
  }
`;

const MainBody = styled.div`
  display: flex;
  width: 100%;
  //flex-flow: row wrap;
  min-height: 400px;
  h5 {
    font-size: 15px;
  }
  @media (max-width: 991.99px) {
    flex-flow: column;
  }
`;

const LeftBody = styled.div`
  min-width: 60%;
  display: flex;
  flex-flow: column;
  padding-right: 1rem;
  @media (max-width: 991.99px) {
    min-width: 100%;
    padding: 0;
  }
`;

const RightBody = styled.div`
  min-width: 40%;
  display: flex;
  flex-flow: column;
  padding-left: 1rem;
  border-left: 1px solid #ebebeb;
  @media (max-width: 991.99px) {
    min-width: 100%;
    border: none;
    padding: 0;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const WorkspaceDescriptionSection = styled.div`
  min-height: 200px;
  margin-bottom: 1rem;
  @media (max-width: 991.99px) {
    min-height: 100px;
  }
`;

const RecentPostSection = styled.div`
  ul.list-group > div:last-child {
    border: none;
  }
  max-height: 320px;
  overflow: auto;
`;

const WorkspaceTeamSection = styled.div`
  margin-bottom: 1rem;
  li {
    border: none;
    padding: 0.25rem 0 !important;
  }
  // .members-list {
  //   max-height: 320px;
  //   ${(props) => props.showAll && "overflow: auto"}
  // }
`;

const QuickLinksSection = styled.div`
  display: flex;
  flex-flow: column;
  .quick-links {
    display: flex;
    flex-flow: column;
    //color: #b8b8b8;
    span {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      cursor: pointer;
    }
    span:hover {
      color: #7a1b8b;
    }
  }
  .feather {
    width: 1rem;
    height: 1rem;
    margin-right: 1rem;
  }
`;

const AboutWorkspaceModal = (props) => {
  const { type } = props.data;
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const history = useHistory();

  const [modal, setModal] = useState(true);
  const [dontShowPopUp, setDontShowPopUp] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const loggedUser = useSelector((state) => state.session.user);
  const recentPosts = useSelector((state) => state.posts.recentPosts);

  const dictionary = {
    description: _t("LABEL.DESCRIPTION", "Description"),
    aboutThisWorkspace: _t("MODAL.ABOUT_THIS_WORKSPACE_HEADER", "About this workspace"),
    goToWorkspace: _t("BUTTON.GO_TO_WORKSPACE", "Go to workspace"),
    checkboxLabel: _t("CHECKBOX.DONT_SHOW_POP_UP_AGAIN", "Don't show this pop up again"),
    noRecentPosts: _t("DASHBOARD.NO_RECENT_POSTS", "No recent posts."),
    recentPosts: _t("DASHBOARD.RECENT_POSTS", "Recent posts"),
    chats: _t("ABOUT_WORKSPACE.CHATS", "Chats"),
    posts: _t("ABOUT_WORKSPACE.POSTS", "Posts"),
    reminders: _t("ABOUT_WORKSPACE.REMINDERS", "Reminders"),
    files: _t("ABOUT_WORKSPACE.FILES", "Files"),
    people: _t("ABOUT_WORKSPACE.PEOPLE", "People"),
    quickLinks: _t("ABOUT_WORKSPACE.QUICK_LINKS", "Quick links"),
    workspaceTeam: _t("ABOUT_WORKSPACE.WORKSPACE_TEAM", "Workspace team"),
    showAll: _t("ABOUT_WORKSPACE.SHOW_ALL", "Show all"),
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
    sessionService.saveUser({ ...loggedUser, dontShowIds: loggedUser.dontShowIds ? [...loggedUser.dontShowIds, workspace.id] : [workspace.id] });
    if (dontShowPopUp) {
      dispatch(toggleShowAbout({ id: workspace.id, show_about: false }));
    }
  };

  const toggleCheckBox = () => {
    setDontShowPopUp(!dontShowPopUp);
  };

  const handleQuicklinks = (type) => {
    toggle();

    if (workspace.folder_id) {
      history.push(`/workspace/${type}/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
    } else {
      history.push(`/workspace/${type}/${workspace.id}/${replaceChar(workspace.name)}`);
    }
  };

  let posts = [];
  // if (workspacePosts[workspace.id] && recentPosts[workspace.id]) {
  //   if (recentPosts[workspace.id].posts && Object.values(recentPosts[workspace.id].posts).length) {
  //     posts = Object.values(workspacePosts[workspace.id].posts).filter((p) => Object.values(recentPosts[workspace.id].posts).some((rp) => rp.id === p.id));
  //   }
  // }
  if (recentPosts[workspace.id]) {
    posts = Object.values(recentPosts[workspace.id].posts).map((p) => {
      return {
        ...p,
        author: p.post_author,
        is_must_read: !!p.must_read,
        is_must_reply: !!p.must_reply,
        users_approval: p.users_approval ? p.users_approval : [],
        must_read_users: p.must_read_users ? p.must_read_users : [],
        must_reply_users: p.must_reply_users ? p.must_reply_users : [],
        is_close: !!p.is_close,
      };
    });
  }
  const members = workspace.members;

  const slicedUsers = () => {
    if (showAll) {
      return members;
    } else {
      return members.slice(0, 4);
    }
  };

  const handleShowAll = () => {
    //setShowAll(!showAll);
    toggle();
    if (workspace.folder_id) {
      history.push(`/workspace/dashboard/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
    } else {
      history.push(`/workspace/dashboard/${workspace.id}/${replaceChar(workspace.name)}`);
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle} centered size="xl">
      <ModalHeaderSection toggle={toggle}>
        <ModalHeaderTitle>
          <Avatar imageLink={workspace.team_channel ? workspace.team_channel.icon_link : null} name={workspace.name} noDefaultClick={true} forceThumbnail={false} />
          <h4 className="ml-2">{workspace.name}</h4>
        </ModalHeaderTitle>
      </ModalHeaderSection>
      <ModalBody>
        <MainBody>
          <LeftBody>
            <WorkspaceDescriptionSection>
              <h4>{dictionary.aboutThisWorkspace}</h4>
              <div dangerouslySetInnerHTML={{ __html: workspace.description }} />
            </WorkspaceDescriptionSection>
            <RecentPostSection>
              <h5>{dictionary.recentPosts}</h5>
              <div>
                {Object.keys(posts).length ? (
                  <ul className="list-group list-group-flush">
                    {Object.values(posts)
                      .sort((a, b) => (b.created_at.timestamp > a.created_at.timestamp ? 1 : -1))
                      .map((post) => {
                        return <RecentPostItem key={post.id} post={post} workspace={workspace} closeModal={toggle} />;
                      })}
                  </ul>
                ) : (
                  <span className="medium text-muted">{dictionary.noRecentPosts}</span>
                )}
              </div>
            </RecentPostSection>
          </LeftBody>
          <RightBody>
            <WorkspaceTeamSection showAll={showAll}>
              <div className="d-flex align-items-center mb-2">
                <h5 className="m-0">{dictionary.workspaceTeam}</h5>
                {members.length > 4 && !showAll && (
                  <span className="ml-auto cursor-pointer" onClick={handleShowAll}>
                    {dictionary.showAll}
                  </span>
                )}
              </div>
              <div className="members-list">
                {slicedUsers().map((member) => {
                  return <TeamListItem key={member.id} member={member} hideOptions={true} workspace_id={workspace.id} dictionary={dictionary} showMoreButton={false} showLessButton={false} loggedUser={loggedUser} workspace={workspace} />;
                })}
              </div>
            </WorkspaceTeamSection>
            <QuickLinksSection>
              <div>
                <h5>{dictionary.quickLinks}</h5>
              </div>
              <div className="quick-links">
                <span onClick={() => handleQuicklinks("chat")}>
                  <SvgIconFeather icon="message-circle" /> {dictionary.chats}
                </span>
                <span onClick={() => handleQuicklinks("posts")}>
                  <SvgIconFeather icon="file-text" />
                  {dictionary.posts}
                </span>
                <span onClick={() => handleQuicklinks("reminders")}>
                  <SvgIconFeather icon="check-circle" />
                  {dictionary.reminders}
                </span>
                <span onClick={() => handleQuicklinks("files")}>
                  <SvgIconFeather icon="folder" />
                  {dictionary.files}
                </span>
                <span onClick={() => handleQuicklinks("people")}>
                  <SvgIconFeather icon="user" />
                  {dictionary.people}
                </span>
              </div>
            </QuickLinksSection>
          </RightBody>
        </MainBody>
        <Footer>
          <CheckBox name="pop_up" checked={dontShowPopUp} onClick={toggleCheckBox}>
            {dictionary.checkboxLabel}
          </CheckBox>
          <button className="btn btn-primary" onClick={toggle}>
            {dictionary.goToWorkspace}
          </button>
        </Footer>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(AboutWorkspaceModal);
