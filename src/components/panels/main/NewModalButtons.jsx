import React, { useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { SvgIconFeather } from "../../common";
import { addToModals, postToDo } from "../../../redux/actions/globalActions";
import { useToaster, useOutsideClick, useSettings } from "../../hooks";

const FONT_COLOR_DARK_MODE = "#CBD4DB";

const Wrapper = styled.div`
  padding: 15px 30px 0 30px;
  color: ${({ theme, dark_mode }) => (dark_mode === "1" ? FONT_COLOR_DARK_MODE : theme.colors.sidebarTextColor)};
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
  const {
    generalSettings: { dark_mode },
  } = useSettings();
  const user = useSelector((state) => state.session.user);
  const securitySettings = useSelector((state) => state.admin.security);
  const refs = {
    btn1Ref: useRef(null),
    btn2Ref: useRef(null),
    btn3Ref: useRef(null),
    btn4Ref: useRef(null),
    btn5Ref: useRef(null),
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

  const handleShowVideoReminderModal = () => {
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
      type: "video_reminder",
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
      <Wrapper dark_mode={dark_mode}>
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
        <div>
          <span onClick={handleShowVideoReminderModal} ref={refs.btn5Ref}>
            <Icon icon="video-driff" />
            Meeting
          </span>
        </div>
        {!isExternal && user.role && user.role.id <= securitySettings.add_workspace && (
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
