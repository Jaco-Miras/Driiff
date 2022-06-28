import React from "react";
import styled from "styled-components";
import { CheckBox, FolderSelect } from "../forms";
import RadioInput from "../forms/RadioInput";
import { SvgIconFeather } from "../common";

const CheckBoxGroup = styled.div`
  transition: all 0.3s ease !important;
  width: 100%;

  label {
    min-width: auto;
    font-size: 12.6px;

    &:hover {
      color: ${(props) => props.theme.colors.primary};
    }
  }
  @media screen and (max-height: 699px) {
    display: flex;
    flex-flow: row wrap;
  }
`;

const ApproveOptions = styled.div`
  .react-select-container {
    width: 300px !important;
    @media all and (max-width: 480px) {
      width: 100%;
    }
  }
  @media screen and (max-height: 699px) {
    margin-right: 10px;
  }
`;

const RadioInputWrapper = styled.div`
  .component-radio-input {
    display: inline-flex;
  }
  input {
    width: auto;
  }
  .client-shared {
    border-radius: 8px;
    padding: 2px 6px;
    background: ${(props) => props.theme.colors.fourth};
    color: #212529;
    margin-right: 5px;
    font-size: 0.8rem;
    .feather {
      margin-right: 5px;
    }
    &:hover {
      cursor: default;
    }
  }
  .client-not-shared {
    border-radius: 8px;
    padding: 2px 6px;
    background: #d6edff;
    color: #212529;
    margin-right: 5px;
    font-size: 0.8rem;
    .feather {
      margin-right: 5px;
    }
    &:hover {
      cursor: default;
    }
  }
`;

const LockIcon = styled(SvgIconFeather)`
  width: 12px;
  margin: 0;
`;

const Wrapper = styled.div``;

const SelectApprover = styled(FolderSelect)``;

const PostSettings = (props) => {
  const { dictionary, form, userOptions, isExternalUser, shareOption, setShareOption, setForm, user, setShowNestedModal } = props;
  const externalUsersId = userOptions.filter((o) => o.user_type === "external").map((e) => e.id);
  let options = userOptions;
  if (shareOption && shareOption.value === "internal") {
    options = userOptions.filter((o) => {
      return o.user_type === "internal";
    });
  }

  let approverOptions = [
    ...options
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
    // {
    //   id: require("shortid").generate(),
    //   value: "all",
    //   label: "All users",
    //   icon: "users",
    //   all_ids: userOptions.filter((u) => u.id !== user.id).map((u) => u.id),
    // },
  ];
  if (approverOptions.length > 1) {
    approverOptions = [
      ...approverOptions,
      {
        id: require("shortid").generate(),
        value: "all",
        label: "All users",
        icon: "users",
        all_ids: userOptions.filter((u) => u.id !== user.id).map((u) => u.id),
      },
    ];
  }

  let mustReadUserOptions = [...approverOptions];

  let mustReplyUserOptions = [...approverOptions];

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

  const toggleCheck = (e) => {
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
          // mustReplyUsers:
          //   prevState.mustReplyUsers.length === 0 && prevState.selectedAddressTo.length > 0 && approverOptions.length > 1
          //     ? [{ id: "all", value: "all", label: "All users", icon: "users", all_ids: userOptions.filter((u) => u.id !== user.id).map((u) => u.id) }]
          //     : prevState.mustReplyUsers,
        }));
        break;
      }
      default: {
        setForm((prevState) => ({
          ...prevState,
          [name]: !prevState[name],
          // mustReadUsers:
          //   prevState.mustReadUsers.length === 0 && prevState.selectedAddressTo.length > 0 && approverOptions.length > 1
          //     ? [{ id: "all", value: "all", label: "All users", icon: "users", all_ids: userOptions.filter((u) => u.id !== user.id).map((u) => u.id) }]
          //     : prevState.mustReadUsers,
        }));
      }
    }
  };

  // const handleSelectShareOption = (e) => {
  //   setShareOption(e);
  //   if (e.id === "external") {
  //     setForm({
  //       ...form,
  //       shared_with_client: true,
  //     });
  //   } else {
  //     const hasExternal =
  //       form.approvers.some((a) => a.user_type === "external") ||
  //       form.approvers.some((a) => a.value === "all" && a.all_ids.some((id) => externalUsersId.some((eid) => eid === id))) ||
  //       form.mustReadUsers.some((a) => a.user_type === "external") ||
  //       form.mustReadUsers.some((a) => a.value === "all" && a.all_ids.some((id) => externalUsersId.some((eid) => eid === id))) ||
  //       form.mustReplyUsers.some((a) => a.user_type === "external") ||
  //       form.mustReplyUsers.some((a) => a.value === "all" && a.all_ids.some((id) => externalUsersId.some((eid) => eid === id)));

  //     if (hasExternal) setShowNestedModal(true);
  //     else {
  //       setForm({
  //         ...form,
  //         shared_with_client: false,
  //       });
  //     }
  //   }
  // };

  const handleSelectShareOption = (e, value) => {
    setShareOption(shareOptions.find((o) => o.value === value));
    if (value === "external") {
      setForm({
        ...form,
        shared_with_client: true,
      });
    } else {
      const hasExternal =
        form.approvers.some((a) => a.user_type === "external") ||
        form.approvers.some((a) => a.value === "all" && a.all_ids.some((id) => externalUsersId.some((eid) => eid === id))) ||
        form.mustReadUsers.some((a) => a.user_type === "external") ||
        form.mustReadUsers.some((a) => a.value === "all" && a.all_ids.some((id) => externalUsersId.some((eid) => eid === id))) ||
        form.mustReplyUsers.some((a) => a.user_type === "external") ||
        form.mustReplyUsers.some((a) => a.value === "all" && a.all_ids.some((id) => externalUsersId.some((eid) => eid === id)));

      if (hasExternal) setShowNestedModal(true);
      else {
        setForm({
          ...form,
          shared_with_client: false,
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

  const handleSelectReadUsers = (e) => {
    if (e === null) {
      setForm({
        ...form,
        mustReadUsers: [],
      });
    } else {
      if (e.find((a) => a.value === "all")) {
        setForm({
          ...form,
          mustReadUsers: e.filter((a) => a.value === "all"),
          //shared_with_client: true,
        });
      } else {
        setForm({
          ...form,
          mustReadUsers: e,
        });
      }
    }
  };

  const handleSelectReplyUsers = (e) => {
    if (e === null) {
      setForm({
        ...form,
        mustReplyUsers: [],
      });
    } else {
      if (e.find((a) => a.value === "all")) {
        setForm({
          ...form,
          mustReplyUsers: e.filter((a) => a.value === "all"),
          //shared_with_client: true,
        });
      } else {
        setForm({
          ...form,
          mustReplyUsers: e,
        });
      }
    }
  };

  // useEffect(() => {
  //   if (form.mustReplyUsers.find((r) => r.value === "all") || form.mustReadUsers.find((r) => r.value === "all")) {
  //     if (!form.shared_with_client) setForm({ ...form, shared_with_client: true });
  //   }
  // }, [form]);

  // if (form.requiredUsers.length && form.requiredUsers.find((a) => a.value === "all")) {
  //   requiredUserOptions = approverOptions.filter((a) => a.value === "all");
  // }

  if (form.requiredUsers.length && form.mustReadUsers.find((a) => a.value === "all")) {
    mustReadUserOptions = approverOptions.filter((a) => a.value === "all");
  }

  if (form.requiredUsers.length && form.mustReplyUsers.find((a) => a.value === "all")) {
    mustReplyUserOptions = approverOptions.filter((a) => a.value === "all");
  }

  const hasExternal = form.selectedAddressTo.some((r) => {
    return (r.type === "TOPIC" || r.type === "WORKSPACE") && r.is_shared;
  });

  return (
    <CheckBoxGroup>
      <Wrapper>
        <ApproveOptions className="d-flex align-items-center">
          <CheckBox name="must_read" checked={form.must_read} onClick={toggleCheck} type="danger">
            {dictionary.mustRead}
          </CheckBox>
        </ApproveOptions>
        <ApproveOptions className="d-flex align-items-center">
          {form.must_read && (
            <SelectApprover
              options={form.selectedAddressTo.length > 0 ? mustReadUserOptions : []}
              value={form.mustReadUsers}
              onChange={handleSelectReadUsers}
              isMulti={true}
              isClearable={true}
              maxMenuHeight={250}
              menuPlacement="top"
              placeholder={"Select must read"}
            />
          )}
        </ApproveOptions>
      </Wrapper>
      <Wrapper>
        <ApproveOptions className="d-flex align-items-center">
          <CheckBox name="reply_required" checked={form.reply_required} onClick={toggleCheck} type="warning">
            {dictionary.replyRequired}
          </CheckBox>
        </ApproveOptions>
        <ApproveOptions className="d-flex align-items-center">
          {form.reply_required && (
            <SelectApprover
              options={form.selectedAddressTo.length > 0 ? mustReplyUserOptions : []}
              value={form.mustReplyUsers}
              onChange={handleSelectReplyUsers}
              isMulti={true}
              isClearable={true}
              maxMenuHeight={250}
              menuPlacement="top"
              placeholder={"Select must reply"}
            />
          )}
        </ApproveOptions>
      </Wrapper>
      <Wrapper>
        <ApproveOptions className="d-flex align-items-center">
          <CheckBox name="no_reply" checked={form.no_reply} onClick={toggleCheck} type="info">
            {dictionary.noReplies}
          </CheckBox>
        </ApproveOptions>
      </Wrapper>
      <Wrapper>
        <ApproveOptions className="d-flex align-items-center">
          <CheckBox name="must_read" checked={form.showApprover} onClick={toggleApprover}>
            {dictionary.approve}
          </CheckBox>
        </ApproveOptions>
        <ApproveOptions className="d-flex align-items-center">
          {form.showApprover && <SelectApprover options={approverOptions} value={form.approvers} onChange={handleSelectApprover} isMulti={true} isClearable={true} maxMenuHeight={250} menuPlacement="top" />}
        </ApproveOptions>
      </Wrapper>
      {!isExternalUser && hasExternal && (
        <Wrapper className="mt-1">
          <ApproveOptions className="d-flex align-items-center mb-1">
            <span>{dictionary.shareWithClient}</span>
          </ApproveOptions>
          <ApproveOptions className="d-flex align-items-center">
            <RadioInputWrapper className="mr-2">
              <RadioInput
                readOnly
                onClick={(e) => {
                  handleSelectShareOption(e, "external");
                }}
                checked={form.shared_with_client}
                value={"external"}
                name={"role"}
              >
                <span class="receiver client-shared text-white">
                  {/* <LockIcon icon="eye" /> */}
                  {dictionary.badgeShared}
                </span>
              </RadioInput>
            </RadioInputWrapper>
            <RadioInputWrapper>
              <RadioInput
                readOnly
                onClick={(e) => {
                  handleSelectShareOption(e, "internal");
                }}
                checked={form.shared_with_client === false}
                value={"internal"}
                name={"role"}
              >
                <span class="receiver client-not-shared">
                  {/* <LockIcon icon="eye-off" /> */}
                  {dictionary.notSharedClientBadge}
                </span>
              </RadioInput>
            </RadioInputWrapper>
            {/* <SelectApprover options={shareOptions} value={shareOption} onChange={handleSelectShareOption} maxMenuHeight={250} menuPlacement="top" /> */}
          </ApproveOptions>
          <p className="text-muted">{dictionary.radioRequired}</p>
        </Wrapper>
      )}
    </CheckBoxGroup>
  );
};

export default PostSettings;
