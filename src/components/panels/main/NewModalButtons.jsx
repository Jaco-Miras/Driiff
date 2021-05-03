import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { SvgIconFeather } from "../../common";
import { addToModals, postToDo } from "../../../redux/actions/globalActions";
import { useToaster } from "../../hooks";

const Wrapper = styled.div`
  margin: 15px 15px 0 15px;
  color: #cbd4db;
  > div {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    :hover {
      cursor: pointer;
      color: #fff;
    }
  }
  .feather {
    width: 1rem;
    height: 1rem;
    margin-right: 15px;
  }
`;

const Icon = styled(SvgIconFeather)``;

const NewModalButtons = (props) => {
  const { dictionary, showButtons } = props;

  const dispatch = useDispatch();
  const toaster = useToaster;

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "create",
    };

    dispatch(addToModals(payload));
  };

  const handleShowPostModal = () => {
    let payload = {
      type: "post_modal",
      mode: "create",
      item: {
        post: null,
      },
    };
    dispatch(addToModals(payload));
  };

  const handleShowReminderModal = () => {
    const onConfirm = (payload) => {
      dispatch(
        postToDo(payload, (err, res) => {
          if (err) {
            toaster.error(dictionary.toasterGeneraError);
          }
          if (res) {
            toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterCreateTodo }} />);
          }
        })
      );
    };
    let payload = {
      type: "todo_reminder",
      actions: {
        onSubmit: onConfirm,
      },
    };
    dispatch(addToModals(payload));
  };

  const handleShowChatModal = () => {
    let payload = {
      type: "chat_create_edit",
      mode: "new",
    };

    dispatch(addToModals(payload));
  };

  return (
    <CSSTransition appear={true} in={showButtons} timeout={300} unmountOnExit classNames="bslide">
      <Wrapper>
        <div onClick={handleShowChatModal}>
          <Icon icon="message-circle" />
          {dictionary.chat}
        </div>
        <div onClick={handleShowPostModal}>
          <Icon icon="file-text" />
          {dictionary.post}
        </div>
        <div onClick={handleShowReminderModal}>
          <Icon icon="calendar" />
          {dictionary.reminder}
        </div>
        <div onClick={handleShowWorkspaceModal}>
          <Icon icon="compass" />
          {dictionary.workspace}
        </div>
      </Wrapper>
    </CSSTransition>
  );
};

export default NewModalButtons;
