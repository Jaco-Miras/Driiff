import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useHistory, useParams } from "react-router-dom";
import { Modal, ModalFooter, ModalBody, Label, InputGroup, Input, Button } from "reactstrap";
import Select, { components } from "react-select";
import styled, { useTheme } from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";
import { useTranslationActions, usePostActions, useSettings } from "../hooks";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";
import { InputFeedback } from "../forms";

const ModalWrapper = styled(Modal)`
  .btn.btn-primary {
    background-color: ${({ theme }) => theme.colors.primary}!important;
    border-color: ${({ theme }) => theme.colors.primary}!important;
  }

  .btn.btn-outline-primary {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  .btn.btn-primary:not(:disabled):not(.disabled):focus {
    box-shadow: 0 0 0 0.2rem #4e5d72 !important;
  }
  .btn.btn-outline-secondary {
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover,
  .btn.btn-outline-secondary:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
  .react-select__control,
  .react-select__control:hover,
  .react-select__control:active,
  .react-select__control:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__option--is-selected {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__option:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;
const Wrapper = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .form-control {
    :focus {
      border-color: ${(props) => props.theme.colors.primary} !important;
    }
  }
`;

const SelectOption = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  transition: background 0.15s ease;
  svg {
    transition: none;
  }
  &:hover {
    background: #25282c;
    svg {
      color: #ffffff;
    }
  }
`;

const CreateEditPostListModal = (props) => {
  const { type, mode, item, params } = props.data;
  const theme = useTheme();
  //   const history = useHistory();
  //   const params = useParams();

  const dispatch = useDispatch();
  const { createNewPostList, updatePostsList, deletePostsList, connectPostList, fetchPostList, updatePostListConnect } = usePostActions();
  const postLists = useSelector((state) => state.posts.postsLists);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const isSharedWorkspace = params && params.workspaceId && activeTopic && activeTopic.sharedSlug;
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(true);
  const [form, setForm] = useState({
    name: mode === "edit" ? item.post.name : "",
  });
  const [postListForm, setPostListForm] = useState({
    post_id: item && item.post.hasOwnProperty("id") ? item.post.id : null,
    link_id: "",
  });

  const [valid, setValid] = useState({
    name: null,
    link_id: null,
  });
  const [feedback, setFeedback] = useState({
    name: "",
    link_id: "",
  });
  const {
    generalSettings: { dark_mode },
  } = useSettings();

  const { _t } = useTranslationActions();

  const dictionary = {
    postListInfo: _t("POST.POST_LIST_INFO", "Lists help you to combine post to groups (just for you!) or todo's"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    saveList: _t("BUTTON.SAVE_LIST", "Save list"),
    addPost: _t("BUTTON.ADD_TO_LIST", "Add"),
    update: _t("BUTTON.UPDATE", "Update"),
    newList: _t("POST_LIST.NEW_LIST", "New list"),
    updateList: _t("POST_LIST.UPDATE_LIST", "Update list"),
    addToList: _t("POST_LIST.ADD_TO_LIST", "Add to list"),
    title: _t("LABEL.TITLE", "Title"),
    maxCharacters: _t("FEEDBACK.MAX_CHARACTERS", "Max 50 characters"),
    requiredTitle: _t("FEEDBACK.REQUIRED", "Title is required"),
    requiredPostList: _t("FEEDBACK.REQUIRED_POST_LIST", "Please Select Post List"),
    archiveThisList: _t("POST_LIST.POST_LIST_ARCHIVE", "Archive this list"),
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleSaveList = () => {
    if (loading) return;
    if (mode === "create") {
      if (!valid.name) return;
      setLoading(true);
      const payload = {
        name: form.name,
        sharedPayload: isSharedWorkspace ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null,
      };
      createNewPostList(payload, (err, res) => {
        if (err) return;
        toggle();
        fetchPostList({ sharedPayload: isSharedWorkspace ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
      });
    } else if (mode === "add") {
      if (!valid.link_id) return;
      setLoading(true);
      const payload = { ...postListForm, sharedPayload: isSharedWorkspace ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null };
      connectPostList(payload, (err, res) => {
        if (err) return;
        fetchPostList({ sharedPayload: isSharedWorkspace ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null }, (error, response) => {
          if (error) return;
          updatePostListConnect({ ...res.data, slug: activeTopic.slug, sharedSlug: activeTopic.sharedSlug });
          toggle();
        });
      });
    } else if (mode === "edit") {
      if (!valid.name) return;
      setLoading(true);
      const payload = {
        name: form.name,
        id: item.post.id,
        sharedPayload: isSharedWorkspace ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null,
      };
      updatePostsList(payload, (err, res) => {
        if (err) return;
        toggle();
        fetchPostList({ sharedPayload: isSharedWorkspace ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
      });
    }
  };

  const handleArchiveList = useCallback(() => {
    setLoading(true);
    deletePostsList({ id: item.post.id, sharedPayload: isSharedWorkspace ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null }, (err, res) => {
      if (err) return;
      toggle();
      fetchPostList({ sharedPayload: isSharedWorkspace ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
    });
  }, [form, item]);

  const _validateName = useCallback(() => {
    if (form.name === "") {
      setFeedback((prevState) => ({
        ...prevState,
        name: dictionary.requiredTitle,
      }));
      setValid((prevState) => ({
        ...prevState,
        name: false,
      }));
      return false;
    }

    if (form.name.length > 50) {
      setFeedback((prevState) => ({
        ...prevState,
        name: dictionary.requiredTitle,
      }));
      setValid((prevState) => ({
        ...prevState,
        name: false,
      }));
      return false;
    }

    setFeedback((prevState) => ({
      ...prevState,
      name: "",
    }));

    setValid((prevState) => ({
      ...prevState,
      name: true,
    }));
  }, [form.name, setFeedback, setValid]);

  const handleNameFocus = () => {
    setFeedback((prevState) => ({
      ...prevState,
      name: "",
    }));
    setValid((prevState) => ({
      ...prevState,
      name: true,
    }));
  };

  const handleNameChange = (e) => {
    e.persist();
    setForm((prevState) => ({
      ...prevState,
      name: e.target.value.trim(),
    }));
  };

  const handleNameBlur = () => {
    _validateName();
  };

  const handleListChange = (e) => {
    if (e === null) {
      setValid((prevState) => ({
        ...prevState,
        link_id: false,
      }));
      setFeedback((prevState) => ({
        ...prevState,
        link_id: dictionary.requiredPostList,
      }));
      setPostListForm((prevState) => ({
        ...prevState,
        link_id: "",
      }));
    } else {
      setValid((prevState) => ({
        ...prevState,
        link_id: true,
      }));
      setPostListForm((prevState) => ({
        ...prevState,
        link_id: e.id,
      }));
    }
  };

  const mappedPostLists = () => {
    return postLists.map((list) => {
      return {
        ...list,
        label: list.name,
        value: list.id,
      };
    });
  };
  // d-flex justify-content-start align-items-center
  const Option = (props) => {
    return (
      <SelectOption>
        <components.Option {...props}>
          {props.data && (
            <span className="d-flex justify-content-start align-items-center">
              <div className="select-option">{props.children}</div>
            </span>
          )}
        </components.Option>
      </SelectOption>
    );
  };
  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={"lg"} className="chat-forward-modal" centered>
      <ModalHeaderSection toggle={toggle}>{mode === "add" ? dictionary.addToList : mode === "edit" ? dictionary.updateList : dictionary.newList}</ModalHeaderSection>
      <ModalBody>
        <Wrapper className={"modal-input mt-0"}>
          <div className="w-100">
            <Label className={"modal-info pb-3 pt-3"}>{dictionary.postListInfo}</Label>
            <div className="d-flex justify-content-start align-items-center">
              <div className="name-wrapper w-100">
                {mode === "create" || mode === "edit" ? (
                  <>
                    <Label className={"modal-label"} for="name">
                      {dictionary.title}
                    </Label>
                    <Input
                      name="name"
                      onFocus={handleNameFocus}
                      onChange={handleNameChange}
                      onBlur={handleNameBlur}
                      valid={valid.name}
                      invalid={valid.name !== null && !valid.name}
                      placeholder={dictionary.title}
                      defaultValue={mode === "edit" ? item.post.name : ""}
                    />
                    <InputFeedback valid={valid.name}>{feedback.name}</InputFeedback>
                  </>
                ) : (
                  <>
                    <Select
                      className={"react-select-container"}
                      classNamePrefix="react-select"
                      styles={dark_mode === "0" ? lightTheme : darkTheme}
                      isMulti={false}
                      isClearable={true}
                      components={{ Option }}
                      options={mappedPostLists()}
                      onChange={handleListChange}
                      menuColor={theme.colors.primary}
                    />
                    <InputFeedback valid={valid.link_id}>{feedback.link_id}</InputFeedback>
                  </>
                )}
              </div>
            </div>
          </div>
        </Wrapper>
        {mode === "edit" && (
          <span onClick={handleArchiveList} className="btn-archive text-link mt-2 cursor-pointer d-flex flex-row-reverse">
            {dictionary.archiveThisList}
          </span>
        )}
      </ModalBody>
      <ModalFooter>
        <Button outline color="secondary" onClick={toggle}>
          {dictionary.cancel}
        </Button>
        <Button color="primary" onClick={handleSaveList}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
          {mode === "add" ? dictionary.addPost : mode === "edit" ? dictionary.update : dictionary.saveList}
        </Button>
      </ModalFooter>
    </ModalWrapper>
  );
};

export default React.memo(CreateEditPostListModal);
