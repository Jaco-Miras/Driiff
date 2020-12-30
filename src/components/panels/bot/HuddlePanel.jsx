import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TimePicker from "react-time-picker";
import { FolderSelect } from "../../forms";
import { useSelector } from "react-redux";
import { useHuddleChatbot, useToaster } from "../../hooks";

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
  const bots = useSelector((state) => state.chat.bots);
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
  const defaultTime = addZeroBefore(currentDate.getHours()) + ":" + addZeroBefore(currentDate.getMinutes()) + ":00";
  const offSetHour = currentDate.getTimezoneOffset() / 60;

  const [channel, setChannel] = useState([]);
  const [form, setForm] = useState({
    set_start_at: defaultTime,
    set_publish_at: defaultTime,
    channel_id: null,
    user_bot_id: 247,
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
        channel_id: null,
      });
    } else {
      setChannel(e);
      setForm({
        ...form,
        channel_id: e.value,
      });
    }
  };
  useEffect(() => {
    if (!loaded) {
      //get the bots
      actions.fetchUserBots();
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

  const handleSave = () => {
    const publishAtUtcHour = parseInt(form.set_publish_at.substr(0, 2)) + offSetHour;
    const startAtUtcHour = parseInt(form.set_start_at.substr(0, 2)) + offSetHour;
    const publishAtMinutes = form.set_publish_at.substr(3, 2);
    const startAtMinutes = form.set_start_at.substr(3, 2);
    let payload = {
      ...form,
      set_publish_at: addZeroBefore(publishAtUtcHour >= 0 ? publishAtUtcHour : 24 + publishAtUtcHour) + ":" + publishAtMinutes,
      set_start_at: addZeroBefore(startAtUtcHour >= 0 ? startAtUtcHour : 24 + startAtUtcHour) + ":" + startAtMinutes,
    };
    let cb = (err, res) => {
      if (err) {
        toaster.error("Huddle bot creation failed.");
        return;
      }
      toaster.success("Huddle bot created.");
      setForm({
        set_start_at: defaultTime,
        set_publish_at: defaultTime,
        channel_id: null,
        user_bot_id: 247,
        questions: defaultQuestions,
      });
      setChannel([]);
    };
    actions.create(payload, cb);
  };

  const disableBtn = form.questions.filter((q) => q.question.trim() === "").length === form.questions.length || form.channel_id === null;

  return (
    <Wrapper className={"workspace-people container-fluid h-100"}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-5 col-xl-6">
          <div className="card">
            <div className="card-body">
              <div className="mb-2">
                <label>Channels</label>
                <FolderSelect options={channelOptions} value={channel} onChange={handleSelectChannel} isMulti={false} isClearable={true} />
              </div>
              <div className="mb-2">
                <label>Start at</label>
                <br />
                <StyledTimePicker className="react-datetime-picker" onChange={handleSelectStartAt} value={form.set_start_at} disableClock={true} />
              </div>
              <div className="mb-2">
                <label>Publish at</label>
                <br />
                <StyledTimePicker className="react-datetime-picker" onChange={handleSelectPublishAt} value={form.set_publish_at} disableClock={true} />
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
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(HuddlePanel);
