import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TimePicker from "react-time-picker";
import { FolderSelect } from "../../forms";
import { useDispatch, useSelector } from "react-redux";
import { useHuddleChatbot, useToaster } from "../../hooks";
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
`;

const addZeroBefore = (n) => {
  return (n < 10 ? "0" : "") + n;
};

const HuddlePanel = (props) => {
  const actions = useHuddleChatbot();
  const toaster = useToaster();
  const dispatch = useDispatch();
  const bots = useSelector((state) => state.chat.bots);
  const huddleBot = useSelector((state) => state.chat.huddleBot);
  const { channels, loaded, user_bots } = bots;

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
  ];
  const currentDate = new Date();
  //const defaultTime = addZeroBefore(currentDate.getHours() % 12 || 12) + ":" + addZeroBefore(currentDate.getMinutes());
  const defaultTime = addZeroBefore(currentDate.getHours()) + ":" + addZeroBefore(currentDate.getMinutes());
  const offSetHour = currentDate.getTimezoneOffset() / 60;

  const [channel, setChannel] = useState([]);
  const [form, setForm] = useState({
    set_start_at: defaultTime,
    set_publish_at: defaultTime,
    channel_id: null,
    user_bot_id: huddleBot ? huddleBot.id : null,
    questions: defaultQuestions,
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
        const publishAtHour = parseInt(e.huddle.publish_at.time.substr(0, 2)) - offSetHour;
        const startAtHour = parseInt(e.huddle.start_at.time.substr(0, 2)) - offSetHour;
        setForm({
          ...form,
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
      user_bot_id: huddleBot.id,
      set_publish_at: addZeroBefore(publishAtUtcHour >= 0 ? publishAtUtcHour : 24 + publishAtUtcHour) + ":" + publishAtMinutes,
      set_start_at: addZeroBefore(startAtUtcHour >= 0 ? startAtUtcHour : 24 + startAtUtcHour) + ":" + startAtMinutes,
    };
    let cb = (err, res) => {
      if (err) {
        toaster.error("Huddle bot creation failed.");
        return;
      }
      if (channel.huddle) {
        toaster.success("Huddle bot updated.");
      } else {
        toaster.success("Huddle bot created.");
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
      headerText: "Delete huddle",
      submitText: "Delete",
      cancelText: "Cancel",
      bodyText: "Are you sure you want to delete this huddle bot?",
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
                  <label>Channels</label>
                  <FolderSelect options={channelOptions} value={channel} onChange={handleSelectChannel} isMulti={false} isClearable={true} />
                </div>
                <div className="mb-2">
                  <label>Start at</label>
                  <br />
                  <StyledTimePicker className="react-datetime-picker start_at" onChange={handleSelectStartAt} value={form.set_start_at} disableClock={true} />
                </div>
                <div className="mb-2">
                  <label>Publish at</label>
                  <br />
                  <StyledTimePicker className="react-datetime-picker publish_at" onChange={handleSelectPublishAt} value={form.set_publish_at} disableClock={true} />
                </div>
                <div className="mb-2">
                  <label>Questions</label>
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
                    {channel.huddle ? "Update" : "Save changes"}
                  </button>
                  {channel.huddle && (
                    <button className="btn btn-primary ml-3" onClick={handleDelete} disabled={disableBtn}>
                      Delete
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
