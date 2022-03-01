import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useToaster } from "../hooks";
import { ModalHeaderSection } from "./index";
import { useTranslationActions } from "../hooks";
import { putWorkspaceQuickLinks } from "../../redux/actions/workspaceActions";
import { FormInput } from "../forms";
import { validURL } from "../../helpers/urlContentHelper";
import { SvgIconFeather, ToolTip } from "../common";

const Wrapper = styled(Modal)`
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
  .btn.btn-primary {
    background-color: ${({ theme }) => theme.colors.primary}!important;
    border-color: ${({ theme }) => theme.colors.primary}!important;
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
  table {
    width: 100%;
  }
  .form-group {
    margin-bottom: 0.25rem;
    height: 57px;
  }
  .feather-info {
    width: 1rem;
    height: 1rem;
  }
  th > div {
    display: inline-block;
    margin-left: 0.5rem;
  }
`;

const MoreButton = styled.span`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const WorkspaceQuickLinksModal = (props) => {
  const { className = "", type, links, workspaceId } = props.data;

  const dispatch = useDispatch();
  const toaster = useToaster();
  const { _t } = useTranslationActions();

  const dictionary = {
    quickLinks: _t("ADMIN.QUICK_LINKS_SETTINGS", "Quick links settings"),
    saveQuickLinks: _t("ADMIN.SAVE_QUICK_LINKS", "Save quick links"),
    quickLinksUpdated: _t("ADMIN.QUICK_LINKS_UPDATED", "Quick links updated"),
    menuName: _t("ADMIN.MENU_NAME", "Menu name"),
    link: _t("ADMIN.LINK", "Link"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    wsQuickLinks: _t("LABEL.WS_QUICK_LINKS", "Workspace quick links"),
    wsQuickLinksUpdated: _t("TOASTER.WS_QUICK_LINKS_UPDATED", "Workspace quick links updated"),
    nameRequired: _t("FEEDBACK.NAME_REQUIRED", "Name is required."),
    linkRequired: _t("FEEDBACK.LINK_REQUIRED", "Link is required."),
    invalidUrl: _t("FEEDBACK.INVALID_URL", "Invalid URL."),
    linkText: _t("LABEL.LINK_TEXT", "Link text"),
    linkTextTooltip: _t("TOOLTIP.LINK_TEXT", "Link text tooltip"),
    linkTooltip: _t("TOOLTIP.LINK", "Link tooltip"),
    addMore: _t("BUTTON.ADD_MORE", "Add more"),
  };

  const [inputs, setInputs] = useState([...links]);
  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });
  const linksWithData = links.filter((l) => {
    return l.link.trim() !== "" || l.menu_name.trim() !== "";
  }).length;
  const [showNumberOfRows, setShowNumberOfRows] = useState(linksWithData > 0 ? linksWithData : 3);

  const handleLinkChange = (e, id) => {
    const newInputs = inputs.map((i) => {
      if (i.id === id) {
        return {
          ...i,
          link: e.target.value,
        };
      } else {
        return i;
      }
    });
    setInputs(newInputs);
  };

  const handleNameChange = (e, id) => {
    const newInputs = inputs.map((i) => {
      if (i.id === id) {
        return {
          ...i,
          menu_name: e.target.value,
        };
      } else {
        return i;
      }
    });
    setInputs(newInputs);
  };

  const toggle = () => {
    dispatch(clearModal({ type: type }));
  };

  const handleClose = () => {
    toggle();
  };

  const filteredInputs = inputs.filter((i) => {
    return i.link.trim() !== "" || i.menu_name.trim() !== "";
  });

  const validateForm = () => {
    let isValid = true;

    const validForms = filteredInputs.reduce((acc, input) => {
      if (input.menu_name.trim() === "") {
        isValid = false;
        acc[input.id] = {
          menu_name: false,
        };
      }
      if (input.link.trim() === "") {
        isValid = false;
        acc[input.id] = {
          ...acc[input.id],
          link: false,
        };
      } else {
        if (!validURL(input.link)) {
          isValid = false;
          acc[input.id] = {
            ...acc[input.id],
            link: false,
          };
        }
      }
      return acc;
    }, {});

    setFormResponse(validForms);
    return isValid;
  };

  const handleConfirm = () => {
    if (!validateForm()) return;

    const payload = {
      workspace_id: workspaceId,
      quick_links: inputs,
    };
    dispatch(
      putWorkspaceQuickLinks(payload, (err, res) => {
        if (err) return;
        toaster.success(dictionary.wsQuickLinksUpdated);
      })
    );

    toggle();
  };

  const handleAddItem = () => {
    setShowNumberOfRows(showNumberOfRows + 1);
  };

  return (
    <Wrapper isOpen={true} toggle={toggle} centered className={className} size={"lg"}>
      <ModalHeaderSection toggle={toggle}>{dictionary.wsQuickLinks}</ModalHeaderSection>
      <ModalBody>
        <div>
          <table>
            <colgroup>
              <col className="col1" />
              <col className="col2" />
            </colgroup>
            <thead>
              <tr>
                <th>
                  {dictionary.linkText}{" "}
                  <ToolTip content={dictionary.linkTextTooltip}>
                    <SvgIconFeather icon="info" />
                  </ToolTip>
                </th>
                <th>
                  {dictionary.link}
                  <ToolTip content={dictionary.linkTooltip}>
                    <SvgIconFeather icon="info" />
                  </ToolTip>
                </th>
              </tr>
            </thead>
            <tbody>
              {inputs.slice(0, showNumberOfRows).map((input, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <FormInput
                        className="w-100"
                        placeholder={dictionary.linkText}
                        value={input.menu_name}
                        onChange={(e) => handleNameChange(e, input.id)}
                        type="text"
                        isValid={formResponse[input.id] && formResponse[input.id].menu_name === false ? false : null}
                        feedback={formResponse[input.id] && formResponse[input.id].menu_name === false ? dictionary.nameRequired : null}
                      />
                    </td>
                    <td>
                      <FormInput
                        className="w-100"
                        placeholder={dictionary.link}
                        value={input.link}
                        onChange={(e) => handleLinkChange(e, input.id)}
                        type="url"
                        isValid={formResponse[input.id] && formResponse[input.id].link === false ? false : null}
                        feedback={
                          formResponse[input.id] && formResponse[input.id].link === false && input.link.trim() === ""
                            ? dictionary.linkRequired
                            : formResponse[input.id] && formResponse[input.id].link === false && input.link.trim() !== ""
                            ? dictionary.invalidUrl
                            : null
                        }
                      />
                    </td>
                  </tr>
                );
              })}
              {showNumberOfRows < 10 && (
                <tr>
                  <td>
                    <MoreButton onClick={handleAddItem}>
                      <SvgIconFeather icon="plus" /> <span>{dictionary.addMore}</span>
                    </MoreButton>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={handleClose}>
          {dictionary.cancel}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleConfirm}>
          {dictionary.saveQuickLinks}
        </button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(WorkspaceQuickLinksModal);
