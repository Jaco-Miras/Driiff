import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useAdminActions, useTranslationActions, useToaster } from "../../hooks";
import { SvgIconFeather, Avatar } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";
import { copyTextToClipboard } from "../../../helpers/commonFunctions";

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

const BotAvatarTitle = styled.div`
  display: flex;
  align-items: center;
`;

const BotTitleChannels = styled.div`
  display: flex;
  flex-flow: column;
  h5 {
    margin: 0;
  }
`;

const AdminBotBody = () => {
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const toaster = useToaster();

  const { setAdminFilter, fetchUserBot, removeUserBot } = useAdminActions();
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

  const handleUpdateBot = (bot) => {
    let modal = {
      type: "update_bot",
      item: bot,
    };

    dispatch(addToModals(modal));
  };

  const handleCopyLink = (bot) => {
    copyTextToClipboard(toaster, bot.url_webhook);
  };

  const handleDeleteBot = (bot) => {
    const handleSubmit = () => {
      removeUserBot({ id: bot.id });
    };
    let modal = {
      type: "confirmation",
      headerText: _t("MODAL.DELETE_BOT_HEADER", "Delete ::name::", { name: bot.name }),
      submitText: dictionary.buttonRemove,
      cancelText: dictionary.buttonCancel,
      bodyText: dictionary.deleteBotBody,
      actions: {
        onSubmit: handleSubmit,
      },
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
            return (
              <div className="col-12 col-md-6" key={bot.id}>
                <div className="card border">
                  <div className="card-body admin-bot-card">
                    <BotAvatarTitle className="mb-2">
                      <div>
                        <Avatar isBot={true} imageLink={bot.image_path} name={bot.name} noDefaultClick={true} showSlider={false} />
                      </div>
                      <BotTitleChannels>
                        <h5>{bot.name}</h5>
                        <span>{bot.channel_connected.length} Channels connected</span>
                      </BotTitleChannels>
                    </BotAvatarTitle>
                    <div>
                      <button className="btn btn-danger mr-2" onClick={() => handleDeleteBot(bot)}>
                        <SvgIconFeather icon="x" />
                      </button>
                      <button className="btn btn-primary mr-2" onClick={() => handleUpdateBot(bot)}>
                        <SvgIconFeather icon="edit" />
                      </button>
                      <button className="btn btn-info mr-2">
                        <SvgIconFeather icon="upload" />
                      </button>
                      <button className="btn btn-light mr-2" onClick={() => handleCopyLink(bot)}>
                        <SvgIconFeather icon="link" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Wrapper>
  );
};

export default AdminBotBody;
