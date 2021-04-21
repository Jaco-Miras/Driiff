import React, { useCallback } from "react";
import styled from "styled-components";
import { CheckBox, FolderSelect } from "../forms";

const CheckBoxGroup = styled.div`
  transition: all 0.3s ease !important;
  width: 100%;

  label {
    min-width: auto;
    font-size: 12.6px;

    &:hover {
      color: #972c86;
    }
  }
`;

const ApproveOptions = styled.div`
  .react-select-container {
    width: 300px !important;
    @media all and (max-width: 480px) {
      width: 100%;
    }
  }
`;

const SelectApprover = styled(FolderSelect)``;

const PostSettings = (props) => {
  const { dictionary, form, userOptions, isExternalUser, shareOption, setShareOption, setForm, user } = props;

  let approverOptions = [
    ...userOptions
      .filter((u) => u.id !== user.id)
      .map((u) => {
        return {
          ...u,
          icon: "user-avatar",
          value: u.id,
          label: u.name ? u.name : u.email,
          type: "USER",
        };
      }),
    {
      id: require("shortid").generate(),
      value: "all",
      label: "All users",
      icon: "users",
      all_ids: userOptions.filter((u) => u.id !== user.id).map((u) => u.id),
    },
  ];

  let requiredUserOptions = [...approverOptions];

  let shareOptions = [
    {
      id: "internal",
      value: "internal",
      label: dictionary.internalTeamLabel,
      icon: "eye-off",
    },
    {
      id: "external",
      value: "external",
      label: dictionary.internalAndExternalTeamLabel,
      icon: "eye",
    },
  ];

  const toggleApprover = () => {
    setForm({
      ...form,
      showApprover: !form.showApprover,
    });
  };

  const toggleCheck = useCallback(
    (e) => {
      const name = e.target.dataset.name;
      switch (name) {
        case "no_reply": {
          setForm((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
            reply_required: !prevState[name] === true ? false : prevState["reply_required"],
          }));
          break;
        }
        case "reply_required": {
          setForm((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
            no_reply: !prevState[name] === true ? false : prevState["no_reply"],
            requiredUsers:
              prevState.requiredUsers.length === 0 && prevState.selectedAddressTo.length > 0
                ? [{ id: "all", value: "all", label: "All users", icon: "users", all_ids: userOptions.filter((u) => u.id !== user.id).map((u) => u.id) }]
                : prevState.requiredUsers,
          }));
          break;
        }
        default: {
          setForm((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
            requiredUsers:
              prevState.requiredUsers.length === 0 && prevState.selectedAddressTo.length > 0
                ? [{ id: "all", value: "all", label: "All users", icon: "users", all_ids: userOptions.filter((u) => u.id !== user.id).map((u) => u.id) }]
                : prevState.requiredUsers,
          }));
        }
      }
    },
    [setForm]
  );

  const handleSelectShareOption = (e) => {
    setShareOption(e);
    if (e.id === "external") {
      setForm({
        ...form,
        shared_with_client: true,
      });
    } else {
      setForm({
        ...form,
        shared_with_client: false,
      });
    }
  };

  const handleSelectRequiredUsers = (e) => {
    if (e === null) {
      setForm({
        ...form,
        requiredUsers: [],
      });
    } else {
      if (e.find((a) => a.value === "all")) {
        setForm({
          ...form,
          requiredUsers: e.filter((a) => a.value === "all"),
        });
      } else {
        setForm({
          ...form,
          requiredUsers: e,
        });
      }
    }
  };

  const handleSelectApprover = (e) => {
    if (e === null) {
      setForm({
        ...form,
        approvers: [],
      });
    } else {
      if (e.find((a) => a.value === "all")) {
        setForm({
          ...form,
          approvers: e.filter((a) => a.value === "all"),
        });
      } else {
        setForm({
          ...form,
          approvers: e,
        });
      }
    }
  };

  if (form.requiredUsers.length && form.requiredUsers.find((a) => a.value === "all")) {
    requiredUserOptions = approverOptions.filter((a) => a.value === "all");
  }

  const hasExternal = form.selectedAddressTo.some((r) => {
    return (r.type === "TOPIC" || r.type === "WORKSPACE") && r.is_shared;
  });

  return (
    <CheckBoxGroup>
      <ApproveOptions className="d-flex align-items-center">
        <CheckBox name="must_read" checked={form.must_read} onClick={toggleCheck} type="danger">
          {dictionary.mustRead}
        </CheckBox>
        <CheckBox name="reply_required" checked={form.reply_required} onClick={toggleCheck} type="warning">
          {dictionary.replyRequired}
        </CheckBox>
      </ApproveOptions>
      <ApproveOptions className="d-flex align-items-center">
        {(form.must_read || form.reply_required) && (
          <SelectApprover options={form.selectedAddressTo.length > 0 ? requiredUserOptions : []} value={form.requiredUsers} onChange={handleSelectRequiredUsers} isMulti={true} isClearable={true} maxMenuHeight={250} menuPlacement="top" />
        )}
      </ApproveOptions>

      <ApproveOptions className="d-flex align-items-center">
        <CheckBox name="no_reply" checked={form.no_reply} onClick={toggleCheck} type="info">
          {dictionary.noReplies}
        </CheckBox>
        <CheckBox name="must_read" checked={form.showApprover} onClick={toggleApprover}>
          {dictionary.approve}
        </CheckBox>
      </ApproveOptions>
      <ApproveOptions className="d-flex align-items-center">
        {form.showApprover && <SelectApprover options={approverOptions} value={form.approvers} onChange={handleSelectApprover} isMulti={true} isClearable={true} maxMenuHeight={250} menuPlacement="top" />}
      </ApproveOptions>
      {!isExternalUser && hasExternal && (
        <ApproveOptions className="d-flex align-items-center">
          <span>{dictionary.shareWithClient}</span>
        </ApproveOptions>
      )}
      {!isExternalUser && hasExternal && (
        <ApproveOptions className="d-flex align-items-center">
          <SelectApprover options={shareOptions} value={shareOption} onChange={handleSelectShareOption} maxMenuHeight={250} menuPlacement="top" />
        </ApproveOptions>
      )}
    </CheckBoxGroup>
  );
};

export default PostSettings;
