import React, { useRef } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { SvgIconFeather } from "../../common";
import { addToModals, postToDo } from "../../../redux/actions/globalActions";
import { useToaster, useOutsideClick } from "../../hooks";

const Wrapper = styled.div`
  padding: 15px 30px 0 30px;
  color: ${({ theme }) => theme.colors.sidebarTextColor};
  > div {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    span {
      :hover {
        cursor: pointer;
        color: #fff;
      }
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
  const { dictionary, isExternal, onShowModalButtons, showButtons } = props;

  const refs = {
    btn1Ref: useRef(null),
    btn2Ref: useRef(null),
    btn3Ref: useRef(null),
    btn4Ref: useRef(null),
  };
  const dispatch = useDispatch();
  const toaster = useToaster();

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "create",
    };
    onShowModalButtons();
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
    onShowModalButtons();
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
    onShowModalButtons();
    dispatch(addToModals(payload));
  };

  const handleShowChatModal = () => {
    let payload = {
      type: "chat_create_edit",
      mode: "new",
    };
    onShowModalButtons();
    dispatch(addToModals(payload));
  };

  useOutsideClick(refs.btn1Ref, onShowModalButtons, showButtons);
  useOutsideClick(refs.btn2Ref, onShowModalButtons, showButtons);
  useOutsideClick(refs.btn3Ref, onShowModalButtons, showButtons);
  useOutsideClick(refs.btn4Ref, onShowModalButtons, showButtons);

  return (
    <CSSTransition appear={true} in={showButtons} timeout={300} unmountOnExit classNames="bslide">
      <Wrapper>
        {!isExternal && (
          <div>
            <span onClick={handleShowChatModal} ref={refs.btn1Ref}>
              <Icon icon="message-circle" />
              {dictionary.chat}
            </span>
          </div>
        )}
        <div>
          <span onClick={handleShowPostModal} ref={refs.btn2Ref}>
            <Icon icon="file-text" />
            {dictionary.post}
          </span>
        </div>
        <div>
          <span onClick={handleShowReminderModal} ref={refs.btn3Ref}>
            <Icon icon="calendar" />
            {dictionary.reminder}
          </span>
        </div>
        {!isExternal && (
          <div>
            <span onClick={handleShowWorkspaceModal} ref={refs.btn4Ref}>
              <Icon icon="compass" />
              {dictionary.workspace}
            </span>
          </div>
        )}
      </Wrapper>
    </CSSTransition>
  );
};

export default NewModalButtons;
