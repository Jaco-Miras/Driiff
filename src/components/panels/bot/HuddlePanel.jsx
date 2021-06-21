import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TimePicker from "react-time-picker";
import { FolderSelect } from "../../forms";
import { useDispatch, useSelector } from "react-redux";
import { useHuddleChatbot, useToaster, useTranslationActions } from "../../hooks";
import { addToModals } from "../../../redux/actions/globalActions";

const Wrapper = styled.div`
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .card {
    height: 95%;
  }
`;

const StyledTimePicker = styled(TimePicker)`
  .dark & {
    input,
    select {
      color: #fff;
    }
    option {
      color: #000;
    }
  }
  .react-time-picker__inputGroup__minute {
    width: 18px !important;
  }
`;

const addZeroBefore = (n) => {
  return (n < 10 ? "0" : "") + n;
};

const HuddlePanel = (props) => {
  const { _t } = useTranslationActions();

  const dictionary = {
    huddleBot: _t("HUDDLE.Question", "Question"),
    huddleBotCreated: _t("HUDDLE.HUDDLE_CREATED", "Huddle bot created."),
    huddleBotUpdated: _t("HUDDLE.HUDDLE_UPDATED", "Huddle bot updated."),
    huddleBotFailed: _t("HUDDLE.HUDDLE_FAILED", "Huddle bot failed."),
    channels: _t("HUDDLE.CHANNELS", "Channels"),
    questions: _t("HUDDLE.QUESTIONS", "Questions"),
    startAt: _t("HUDDLE.START_AT", "Start at"),
    publishAt: _t("HUDDLE.PUBLISH_AT", "Publish at"),
    delete: _t("HUDDLE.DELETE", "Delete"),
    update: _t("HUDDLE.UPDATE", "Update"),
    create: _t("HUDDLE.CREATE", "Create"),
    cancel: _t("HUDDLE.CANCEL", "Cancel"),
    confirmationText: _t("HUDDLE.DELETE_CONFIRMATION_TEXT", "Are you sure you want to delete this huddle bot?"),
    deleteHuddle: _t("HUDDLE.DELETE_HUDDLE", "Delete huddle"),
  };
  const actions = useHuddleChatbot();
  const toaster = useToaster();
  const dispatch = useDispatch();
  const bots = useSelector((state) => state.chat.bots);
  const huddleBot = useSelector((state) => state.chat.huddleBot);
  const { channels, loaded } = bots;

  const defaultQuestions = [
    {
      question: "",
    },
    {
      question: "",
    },
    {
      question: "",
    },
    {
      question: "",
    },
    {
      question: "",
    },
  ];
  const currentDate = new Date();
  const defaultTime = addZeroBefore(currentDate.getHours()) + ":" + addZeroBefore(currentDate.getMinutes());
  const offSetHour = currentDate.getTimezoneOffset() / 60;

  const [channel, setChannel] = useState([]);
  const [form, setForm] = useState({
    set_start_at: defaultTime,
    set_publish_at: defaultTime,
    channel_id: null,
    user_bot_id: huddleBot ? huddleBot.id : null,
    questions: defaultQuestions,
    introduction_message: "",
    closing_message: "",
  });
  const channelOptions = channels.map((c) => {
    return {
      ...c,
      value: c.id,
      label: c.name,
      icon: "compass",
    };
  });

  const handleSelectChannel = (e) => {
    console.log(e);
    if (e === null) {
      setChannel([]);
      setForm({
        ...form,
        set_start_at: defaultTime,
        set_publish_at: defaultTime,
        channel_id: null,
        user_bot_id: huddleBot.id,
        questions: defaultQuestions,
      });
    } else {
      setChannel(e);
      if (e.huddle) {
        console.log(e.huddle);
        const publishAtHour = parseInt(e.huddle.publish_at.time.substr(0, 2)) - offSetHour;
        const startAtHour = parseInt(e.huddle.start_at.time.substr(0, 2)) - offSetHour;
        setForm({
          ...form,
          introduction_message: e.huddle.introduction_message,
          closing_message: e.huddle.closing_message,
          channel_id: e.value,
          questions: e.huddle.questions,
          user_bot_id: huddleBot.id,
          set_publish_at: addZeroBefore(publishAtHour > 23 ? 24 - publishAtHour : publishAtHour) + ":" + e.huddle.publish_at.time.substr(3, 2),
          set_start_at: addZeroBefore(startAtHour > 23 ? 24 - startAtHour : startAtHour) + ":" + e.huddle.start_at.time.substr(3, 2),
        });
      } else {
        setForm({
          ...form,
          channel_id: e.value,
          questions: defaultQuestions,
        });
      }
    }
  };

  useEffect(() => {
    if (!loaded) {
      //get the bots
      let cb = (err, res) => {
        if (err) return;
        if (res.data.user_bots && res.data.user_bots.length === 0) {
          actions.createUserBot({ bot_name: "Huddle" });
        }
      };
      actions.fetchUserBots({}, cb);
    }
  }, []);

  const handleSelectStartAt = (time) => {
    setForm({
      ...form,
      set_start_at: time,
    });
  };

  const handleSelectPublishAt = (time) => {
    setForm({
      ...form,
      set_publish_at: time,
    });
  };

  const handleInputChange = (e) => {
    setForm({
      ...form,
      questions: form.questions.map((q, k) => {
        if (k === parseInt(e.target.dataset.name)) {
          return {
            ...q,
            question: e.target.value,
          };
        } else {
          return q;
        }
      }),
    });
  };

  const handleMessageChange = (e) => {
    setForm({
      ...form,
      [e.target.dataset.name]: e.target.value,
    });
  };

  const setDefaultForm = () => {
    setForm({
      set_start_at: defaultTime,
      set_publish_at: defaultTime,
      channel_id: null,
      user_bot_id: huddleBot.id,
      questions: defaultQuestions,
    });
  };

  const handleSave = () => {
    const publishAtUtcHour = parseInt(form.set_publish_at.substr(0, 2)) + offSetHour;
    const startAtUtcHour = parseInt(form.set_start_at.substr(0, 2)) + offSetHour;
    const publishAtMinutes = form.set_publish_at.substr(3, 2);
    const startAtMinutes = form.set_start_at.substr(3, 2);
    let payload = {
      ...form,
      questions: form.questions.filter((q) => q.question.trim() !== ""),
      user_bot_id: huddleBot.id,
      set_publish_at: addZeroBefore(publishAtUtcHour >= 0 ? publishAtUtcHour : 24 + publishAtUtcHour) + ":" + publishAtMinutes,
      set_start_at: addZeroBefore(startAtUtcHour >= 0 ? startAtUtcHour : 24 + startAtUtcHour) + ":" + startAtMinutes,
    };
    let cb = (err, res) => {
      if (err) {
        toaster.error(dictionary.huddleBotFailed);
        return;
      }
      if (channel.huddle) {
        toaster.success(dictionary.huddleBotUpdated);
      } else {
        toaster.success(dictionary.huddleBotCreated);
      }
      setDefaultForm();
      setChannel([]);
    };
    if (channel.huddle) {
      payload = {
        ...payload,
        huddle_id: channel.huddle.id,
        update_questions: payload.questions,
        new_questions: [],
        remove_question_ids: [],
      };
      actions.update(payload, cb);
    } else {
      actions.create(payload, cb);
    }
  };

  const handleDelete = () => {
    let cb = (err, res) => {
      if (err) return;
      setDefaultForm();
      setChannel([]);
    };

    let confirmModal = {
      type: "confirmation",
      headerText: dictionary.deleteHuddle,
      submitText: dictionary.delete,
      cancelText: dictionary.cancel,
      bodyText: dictionary.confirmationText,
      actions: {
        onSubmit: () => actions.remove({ huddle_id: channel.huddle.id }, cb),
      },
    };

    dispatch(addToModals(confirmModal));
  };

  const disableBtn = form.questions.filter((q) => q.question.trim() === "").length === form.questions.length || form.channel_id === null;

  return (
    <Wrapper className={"workspace-people container-fluid h-100"}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-5 col-xl-6">
          <div className="card">
            {huddleBot && (
              <div className="card-body">
                <div className="mb-2">
                  <label>{dictionary.channels}</label>
                  <FolderSelect options={channelOptions} value={channel} onChange={handleSelectChannel} isMulti={false} isClearable={true} />
                </div>
                <div className="mb-2">
                  <label>{dictionary.startAt}</label>
                  <br />
                  <StyledTimePicker className="react-datetime-picker start_at" onChange={handleSelectStartAt} value={form.set_start_at} disableClock={true} />
                </div>
                <div className="mb-2">
                  <label>{dictionary.publishAt}</label>
                  <br />
                  <StyledTimePicker className="react-datetime-picker publish_at" onChange={handleSelectPublishAt} value={form.set_publish_at} disableClock={true} />
                </div>
                <div className="mb-2">
                  <label>Welcome message</label>
                  <div className="mb-2">
                    <div className="input-group">
                      <input
                        onChange={handleMessageChange}
                        data-name={"introduction_message"}
                        type="text"
                        className="form-control"
                        placeholder={"Welcome message"}
                        aria-describedby="button-addon1"
                        autoFocus
                        value={form.introduction_message}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <label>Thank you message</label>
                  <div className="mb-2">
                    <div className="input-group">
                      <input onChange={handleMessageChange} data-name={"closing_message"} type="text" className="form-control" placeholder={"Thank you message"} aria-describedby="button-addon1" autoFocus value={form.closing_message} />
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <label>{dictionary.questions}</label>
                  {form.questions.map((q, k) => {
                    return (
                      <div className="mb-2" key={k}>
                        <div className="input-group">
                          <input onChange={handleInputChange} data-name={k} type="text" className="form-control" placeholder={"Question"} aria-describedby="button-addon1" autoFocus value={q.question} />
                        </div>
                      </div>
                    );
                  })}
                  <button className="btn btn-primary" onClick={handleSave} disabled={disableBtn}>
                    {channel.huddle ? dictionary.update : dictionary.create}
                  </button>
                  {channel.huddle && (
                    <button className="btn btn-primary ml-3" onClick={handleDelete} disabled={disableBtn}>
                      {dictionary.delete}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(HuddlePanel);
