import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TimePicker from "react-time-picker";
import { FolderSelect } from "../../forms";
import { useDispatch, useSelector } from "react-redux";
import { useHuddleChatbot, useToaster, useTranslationActions } from "../../hooks";
import { addToModals } from "../../../redux/actions/globalActions";
import RepeatDays from "./RepeatDays";
import RadioInput from "../../forms/RadioInput";
import { DatePicker } from "../../common";
import moment from "moment";

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
  .component-radio-input input {
    z-index: 0;
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

const RadioInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .repeat-times {
    width: 60px;
    background-color: #f1f2f7;
    border: none;
  }
`;

const RepeatTimesWrapper = styled.div`
  margin: 0 10px;
  background-color: #f1f2f7;
  padding: 2px 5px;
`;

const StyledRadioInput = styled(RadioInput)`
  input {
    width: auto;
  }
`;

const DatePickerWrapper = styled.div`
  margin: 0 10px;
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
  const [publishChannel, setPublishChannel] = useState([]);
  const [repeatType, setRepeatType] = useState([{ value: "DAILY", label: "Daily" }]);
  const [form, setForm] = useState({
    set_start_at: defaultTime,
    set_publish_at: defaultTime,
    channel_id: null,
    user_bot_id: huddleBot ? huddleBot.id : null,
    questions: defaultQuestions,
    introduction_message: "",
    closing_message: "",
    publish_channel_id: null,
    repeat_type: "DAILY",
    repeat_select_weekly: null,
    repeat_select_monthly: 1,
    repeat_select_yearly: null,
    end_type: "NEVER",
    end_select_after: 1,
    end_select_on: null,
    repeat_hour: 0,
    bot_name: "",
  });
  const channelOptions = channels.map((c) => {
    return {
      ...c,
      value: c.id,
      label: c.name,
      icon: "compass",
    };
  });

  const repeatOptions = [
    { value: "DAILY", label: "Daily", icon: null },
    { value: "WEEKLY", label: "Weekly", icon: null },
    { value: "MONTHLY", label: "Monthly", icon: null },
    { value: "YEARLY", label: "Yearly", icon: null },
  ];

  const repeatMonthlyOptions = [...Array(31).keys()].map((n) => {
    return { value: n + 1, label: n + 1, icon: null };
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
          publish_channel_id: e.huddle.publish_channel.id,
          repeat_type: e.huddle.repeat_type,
          repeat_select_weekly: e.huddle.repeat_select_weekly ? e.huddle.repeat_select_weekly : [],
          repeat_select_monthly: e.huddle.repeat_select_monthly ? e.huddle.repeat_select_monthly : 1,
          repeat_select_yearly: e.huddle.repeat_select_yearly ? new Date(e.huddle.repeat_select_yearly.substr(0, 4), parseInt(e.huddle.repeat_select_yearly.substr(5, 2)) - 1, e.huddle.repeat_select_yearly.substr(8, 2)) : null,
          end_type: e.huddle.end_type,
          end_select_after: e.huddle.end_select_after ? e.huddle.end_select_after : 1,
          end_select_on: e.huddle.end_select_on ? new Date(e.huddle.end_select_on.substr(0, 4), parseInt(e.huddle.end_select_on.substr(5, 2)) - 1, e.huddle.end_select_on.substr(8, 2)) : null,
          bot_name: e.huddle.user_bot.first_name,
        });
        setPublishChannel([{ ...e.huddle.publish_channel, value: e.huddle.publish_channel.id, label: e.huddle.publish_channel.name, icon: "compass" }]);
      } else {
        setForm({
          ...form,
          channel_id: e.value,
          questions: defaultQuestions,
        });
      }
    }
  };

  const handleSelectPublishChannel = (e) => {
    console.log(e);
    if (e === null) {
      setPublishChannel([]);
      setForm({
        ...form,
        publish_channel_id: null,
      });
    } else {
      setPublishChannel(e);
      setForm({
        ...form,
        publish_channel_id: e.value,
      });
    }
  };

  useEffect(() => {
    //if (!loaded) {
    //get the bots
    let cb = (err, res) => {
      if (err) return;
      if (res.data.user_bots && res.data.user_bots.length === 0) {
        actions.createUserBot({ bot_name: "Huddle" });
      }
    };
    actions.fetchUserBots({}, cb);
    //}
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
      bot_name: "",
      publish_channel_id: null,
      repeat_type: "DAILY",
      repeat_select_weekly: null,
      repeat_select_monthly: 1,
      repeat_select_yearly: null,
      end_type: "NEVER",
      end_select_after: 1,
      end_select_on: null,
      repeat_hour: 0,
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
    if (payload.repeat_type === "DAILY") {
      delete payload.repeat_select_weekly;
      delete payload.repeat_select_monthly;
      delete payload.repeat_select_yearly;
      if (payload.end_type === "NEVER") {
        delete payload.end_select_after;
        delete payload.end_select_on;
      } else if (payload.end_type === "END_ON") {
        delete payload.end_select_after;
        payload.end_select_on = moment(form.end_select_on, "YYYY-MM-DD").format("YYYY-MM-DD");
      } else {
        delete payload.end_select_on;
      }
    } else if (payload.repeat_type === "WEEKLY") {
      delete payload.repeat_select_monthly;
      delete payload.repeat_select_yearly;
      payload.repeat_select_weekly = payload.repeat_select_weekly === "thursday" ? "TH" : payload.repeat_select_weekly.toUpperCase().charAt(0);
      if (payload.end_type === "NEVER") {
        delete payload.end_select_after;
        delete payload.end_select_on;
      } else if (payload.end_type === "END_ON") {
        delete payload.end_select_after;
        payload.end_select_on = moment(form.end_select_on, "YYYY-MM-DD").format("YYYY-MM-DD");
      } else {
        delete payload.end_select_on;
      }
    } else if (payload.repeat_type === "MONTHLY") {
      delete payload.repeat_select_weekly;
      delete payload.repeat_select_yearly;
      if (payload.end_type === "NEVER") {
        delete payload.end_select_after;
        delete payload.end_select_on;
      } else if (payload.end_type === "END_ON") {
        delete payload.end_select_after;
        payload.end_select_on = moment(form.end_select_on, "YYYY-MM-DD").format("YYYY-MM-DD");
      } else {
        delete payload.end_select_on;
      }
    } else if (payload.repeat_type === "YEARLY") {
      delete payload.repeat_select_weekly;
      delete payload.repeat_select_monthly;
      payload.repeat_select_yearly = moment(form.repeat_select_yearly, "YYYY-MM-DD").format("YYYY-MM-DD");
      if (payload.end_type === "NEVER") {
        delete payload.end_select_after;
        delete payload.end_select_on;
      } else if (payload.end_type === "END_ON") {
        delete payload.end_select_after;
        payload.end_select_on = moment(form.end_select_on, "YYYY-MM-DD").format("YYYY-MM-DD");
      } else {
        delete payload.end_select_on;
      }
    }
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
      if (payload.end_type !== "END_AFTER_REPEAT" && channel.huddle.end_type === "END_AFTER_REPEAT") {
        payload = {
          ...payload,
          reset_repeat_logs: 1,
        };
      }
      actions.update(payload, cb);
    } else {
      delete payload.user_bot_id;
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

  const handleSelectRepeat = (e) => {
    setForm({
      ...form,
      repeat_type: e.value,
    });
    setRepeatType(e);
  };

  const handleSelectDays = (e) => {
    const value = e.currentTarget.dataset.name;
    setForm({
      ...form,
      //repeat_select_weekly: form.repeat_select_weekly.find((d) => d === value) ? form.repeat_select_weekly.filter((d) => d !== value) : [...form.repeat_select_weekly, value],
      repeat_select_weekly: value,
    });
  };

  const handleTimesChange = (e) => {
    setForm({
      ...form,
      end_select_after: e.target.value,
    });
  };

  const handleRadioInput = (value) => {
    setForm({
      ...form,
      end_type: value,
    });
  };

  const handleSelectDate = (value) => {
    setForm({
      ...form,
      end_select_on: value,
    });
  };

  const handleSelectRepeatDate = (value) => {
    setForm({
      ...form,
      repeat_select_yearly: value,
    });
  };

  const handleSelectRepeatMonthly = (e) => {
    console.log(e);
    setForm({
      ...form,
      repeat_select_monthly: e.value,
    });
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
                  <label>Bot name</label>
                  <div className="mb-2">
                    <div className="input-group">
                      <input onChange={handleMessageChange} data-name={"bot_name"} type="text" className="form-control" placeholder={"Bot name"} aria-describedby="button-addon1" autoFocus value={form.bot_name} />
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <label>Publish question channel</label>
                  <FolderSelect options={channelOptions} value={channel} onChange={handleSelectChannel} isMulti={false} isClearable={true} />
                </div>
                <div className="mb-2">
                  <label>Publish answer channel</label>
                  <FolderSelect options={channelOptions} value={publishChannel} onChange={handleSelectPublishChannel} isMulti={false} isClearable={true} />
                </div>
                <div className="mb-2">
                  <label>What time do you want to ask the questions?</label>
                  <br />
                  <StyledTimePicker className="react-datetime-picker start_at" onChange={handleSelectStartAt} value={form.set_start_at} disableClock={true} />
                </div>
                <div className="mb-2">
                  <label>What time do you want to publish?</label>
                  <br />
                  <StyledTimePicker className="react-datetime-picker publish_at" onChange={handleSelectPublishAt} value={form.set_publish_at} disableClock={true} />
                </div>
                <div className="mb-2">
                  <label>Repeat every</label>
                  <FolderSelect options={repeatOptions} value={repeatType} onChange={handleSelectRepeat} isMulti={false} />
                </div>
                {form.repeat_type === "WEEKLY" && (
                  <div className="mb-2">
                    <label>Repeat on</label>
                    <RepeatDays onClick={handleSelectDays} selectedDay={form.repeat_select_weekly} />
                  </div>
                )}
                {form.repeat_type === "MONTHLY" && (
                  <div className="mb-2">
                    <label>Repeat on</label>
                    <FolderSelect options={repeatMonthlyOptions} value={repeatMonthlyOptions.find((o) => o.value === form.repeat_select_monthly)} onChange={handleSelectRepeatMonthly} isMulti={false} />
                  </div>
                )}
                {form.repeat_type === "YEARLY" && (
                  <div className="mb-2">
                    <label>Repeat on</label>
                    <div>
                      <DatePicker className="react-datetime-picker" onChange={handleSelectRepeatDate} value={form.repeat_select_yearly} />
                    </div>
                  </div>
                )}
                <div className="mb-2">
                  <label>Ending</label>
                  <RadioInputWrapper>
                    <RadioInput checked={form.end_type === "NEVER"} value={"NEVER"} name={"NEVER"} onClick={() => handleRadioInput("NEVER")}>
                      Never
                    </RadioInput>
                  </RadioInputWrapper>
                  <RadioInputWrapper>
                    <RadioInput checked={form.end_type === "END_ON"} value={"END_ON"} name={"END_ON"} onClick={() => handleRadioInput("END_ON")}>
                      On
                    </RadioInput>
                    <DatePickerWrapper>
                      <DatePicker className="react-datetime-picker" onChange={handleSelectDate} value={form.end_select_on} minDate={channel.huddle ? null : new Date(new Date().setDate(new Date().getDate() + 1))} />
                    </DatePickerWrapper>
                  </RadioInputWrapper>
                  <RadioInputWrapper>
                    <StyledRadioInput checked={form.end_type === "END_AFTER_REPEAT"} value={"END_AFTER_REPEAT"} name={"END_AFTER_REPEAT"} onClick={() => handleRadioInput("END_AFTER_REPEAT")}>
                      <span>After</span>
                    </StyledRadioInput>
                    <RepeatTimesWrapper>
                      <input type="number" value={form.end_select_after} placeholder="number" className="repeat-times" onChange={handleTimesChange} />
                      <span>times</span>
                    </RepeatTimesWrapper>
                  </RadioInputWrapper>
                </div>
                <div className="mb-2">
                  <label>Welcome message</label>
                  <div className="mb-2">
                    <div className="input-group">
                      <input onChange={handleMessageChange} data-name={"introduction_message"} type="text" className="form-control" placeholder={"Welcome message"} aria-describedby="button-addon1" value={form.introduction_message} />
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <label>Thank you message</label>
                  <div className="mb-2">
                    <div className="input-group">
                      <input onChange={handleMessageChange} data-name={"closing_message"} type="text" className="form-control" placeholder={"Thank you message"} aria-describedby="button-addon1" value={form.closing_message} />
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <label>{dictionary.questions}</label>
                  {form.questions.map((q, k) => {
                    return (
                      <div className="mb-2" key={k}>
                        <div className="input-group">
                          <input onChange={handleInputChange} data-name={k} type="text" className="form-control" placeholder={"Question"} aria-describedby="button-addon1" value={q.question} />
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
