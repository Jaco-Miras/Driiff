import React from "react";
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
  const { approverOptions, dictionary, form, requiredUserOptions, toggleCheck, toggleApprover, handleSelectApprover, handleSelectRequiredUsers, isExternalUser, shareOptions, shareOption, handleSelectShareOption } = props;
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
          {/* <CheckBox
            name="shared_with_client"
            checked={form.shared_with_client}
            onClick={(e) => {
              if (hasExternal) toggleCheck(e);
            }}
            type="success"
            disabled={!hasExternal || form.selectedAddressTo.length === 0}
          >
            {dictionary.shareWithClient}
          </CheckBox> */}
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
