import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useAdminActions, useTranslationActions } from "../../hooks";
import { addToModals } from "../../../redux/actions/globalActions";
import AdminBotCard from "./AdminBotCard";

const Wrapper = styled.div`
  .admin-bot-card {
    padding: 1rem;
  }
  button {
    padding: 8px;
  }
  .create-btn {
    padding: 15px;
  }
`;

const AdminBotBody = () => {
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();

  const { setAdminFilter, fetchUserBot } = useAdminActions();
  const componentIsMounted = useRef(true);

  const dictionary = {
    adminBotLabel: _t("ADMIN.AUTOMATION_LABEL_ADMIN_BOT", "Admin bot"),
    deleteBotBody: _t("MODAL.DELETE_BOT_CONFIRMATION", "Are you sure you want to delete this bot?"),
    buttonCancel: _t("BUTTON.CANCEL", "Cancel"),
    buttonRemove: _t("BUTTON.REMOVE", "Remove"),
  };

  const filters = useSelector((state) => state.admin.filters);
  const automation = useSelector((state) => state.admin.automation);
  const { bots } = automation;

  useEffect(() => {
    fetchUserBot();
    setAdminFilter({ filters: { ...filters, automation: true } });
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const handleCreateBot = () => {
    let modal = {
      type: "create_bot",
    };

    dispatch(addToModals(modal));
  };

  return (
    <Wrapper>
      <h5 className="mb-3">{dictionary.adminBotLabel}</h5>
      <div className="mb-3">
        <button className="btn btn-primary create-btn" onClick={handleCreateBot}>
          Create new bot
        </button>
      </div>
      <div className="row">
        {bots.length > 0 &&
          bots.map((bot) => {
            return <AdminBotCard key={bot.id} bot={bot} dictionary={dictionary} />;
          })}
      </div>
    </Wrapper>
  );
};

export default AdminBotBody;
