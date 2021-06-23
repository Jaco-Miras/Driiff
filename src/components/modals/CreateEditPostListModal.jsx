import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useHistory, useParams } from "react-router-dom";
import { Modal, ModalFooter, ModalBody, Label, InputGroup, Input, Button } from "reactstrap";
import Select, { components } from "react-select";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";
import { useTranslation, usePostActions, useSettings } from "../hooks";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";
import { InputFeedback } from "../forms";

const Wrapper = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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
  const { type, mode, item } = props.data;

  // const history = useHistory();
  // const params = useParams();

  const dispatch = useDispatch();
  const { createNewPostList, updatePostsList, deletePostsList, connectPostList, fetchPostList, updatePostListConnect } = usePostActions();
  const postLists = useSelector((state) => state.posts.postsLists);
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

  const { _t } = useTranslation();

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
      };
      createNewPostList(payload, (err, res) => {
        if (err) return;
        toggle();
        fetchPostList();
      });
    } else if (mode === "add") {
      if (!valid.link_id) return;
      setLoading(true);
      const payload = { ...postListForm };
      connectPostList(payload, (err, res) => {
        if (err) return;
        fetchPostList({}, (error, response) => {
          if (error) return;
          updatePostListConnect(res.data);
          toggle();
        });
      });
    } else if (mode === "edit") {
      if (!valid.name) return;
      setLoading(true);
      const payload = {
        name: form.name,
        id: item.post.id,
      };
      updatePostsList(payload, (err, res) => {
        if (err) return;
        toggle();
        fetchPostList();
      });
    }
  };

  const handleArchiveList = useCallback(() => {
    setLoading(true);
    deletePostsList({ id: item.post.id }, (err, res) => {
      if (err) return;
      toggle();
      fetchPostList();
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
    <Modal isOpen={modal} toggle={toggle} size={"lg"} className="chat-forward-modal" centered>
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
                    <Select className={"react-select-container"} styles={dark_mode === "0" ? lightTheme : darkTheme} isMulti={false} isClearable={true} components={{ Option }} options={mappedPostLists()} onChange={handleListChange} />
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
    </Modal>
  );
};

export default React.memo(CreateEditPostListModal);
