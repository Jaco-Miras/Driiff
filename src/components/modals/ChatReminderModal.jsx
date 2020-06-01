import moment from "moment";
import React, {useState} from "react";
import DateTimePicker from "react-datetime-picker";
import {useDispatch, useSelector} from "react-redux";
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";
import styled from "styled-components";
import toaster from "toasted-notes";
import {formatHoursAMPM, formatMonthsOrdinalDay, formatWeeekDayName} from "../../helpers/dateFormatter";
import {setChatReminder} from "../../redux/actions/chatActions";
import {clearModal} from "../../redux/actions/globalActions";
import RadioInput from "../forms/RadioInput";
import {ModalHeaderSection} from "./index";


const InputContainer = styled.div`
    display: flex;
    width: 100%;
    flex-flow: column;
    > div {
        margin-bottom: 10px;
    }
`;

const ChatReminderModal = props => {

    const {type, message} = props.data;

    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);

    const [setTimeValue, setSetTimeValue] = useState(`20m`);
    const [customTimeValue, setCustomTimeValue] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(null);

    const [modal, setModal] = useState(true);
    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const handleSetReminder = (e, setTime) => {
        setShowDateTimePicker(false);
        setSetTimeValue(setTime);
    };

    const handlePickDateTime = (e) => {
        setCustomTimeValue(e);
        //setSetTimeValue(formatDateISO8601(e));
    };

    const handleSelectPickDateTime = (e) => {
        setSetTimeValue("pick_data");
        setShowDateTimePicker(true);
    };

    const handleSnooze = (e) => {

        let payload = {
            message_id: message.id,
            set_time: setTimeValue === "pick_data" ? moment.utc(new Date(customTimeValue)).format("YYYY-MM-DD HH:mm:ss") : setTimeValue,
        };

        dispatch(
            setChatReminder(payload, (err, res) => {
                toggle();
                let messageAuthor = "You";
                let messageTime = "";
                let today = new Date();
                switch (setTimeValue) {
                    case "2m":
                        today.setMinutes(today.getMinutes() + 2);
                        messageTime = `in 2 minutes at ${formatHoursAMPM(today)} today`;
                        break;
                    case "20m":
                        today.setMinutes(today.getMinutes() + 20);
                        messageTime = `in 20 minutes at ${formatHoursAMPM(today)} today`;
                        break;
                    case "1h":
                        today.setHours(today.getHours() + 1);
                        messageTime = `in an hour at ${formatHoursAMPM(today)} today`;
                        break;
                    case "3h":
                        today.setHours(today.getHours() + 3);
                        messageTime = `in 3 hours at ${formatHoursAMPM(today)} today`;
                        break;
                    case "tomorrow":
                        today.setDate(today.getDate() + 1);
                        messageTime = `at 9 AM tomorrow`;
                        break;
                    case "next_week":
                        today.setDate(today.getDate() + 7);
                        messageTime = `at 9 AM ${formatWeeekDayName(today)}, ${formatMonthsOrdinalDay(today)}`;
                        break;
                    case "pick_data":
                        messageTime = `at ${moment(new Date(customTimeValue)).format("YYYY-MM-DD HH:mm")}`;
                        break;
                    default:
                        messageTime = setTimeValue + " at 9 AM";
                        break;
                }

                let div = document.createElement("div");
                div.innerHTML = message.body;
                if (div.innerText.length >= 15)
                    div.innerText = div.innerText.substring(0, 15) + "...";

                if (user.id !== message.user.id) {
                    messageAuthor = message.user.name;
                }

                toaster.notify(`I will remind you about this message ("${div.innerText} from ${messageAuthor} in ${messageTime}")`,
                    {position: "bottom-left"});
            }),
        );
    };

    return (
        <Modal isOpen={modal} toggle={toggle} centered className='chat-forward-modal'>
            <ModalHeaderSection toggle={toggle}>
                Chat reminder
            </ModalHeaderSection>
            <ModalBody>
                <InputContainer>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetReminder(e, `2m`);
                        }}
                        checked={setTimeValue === `2m`}
                        value={`2m`}
                        name={`role`}>
                        2 minutes
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetReminder(e, `20m`);
                        }}
                        checked={setTimeValue === `20m`}
                        value={`20m`}
                        name={`role`}>
                        20 minutes
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetReminder(e, `1h`);
                        }}
                        checked={setTimeValue === `1h`}
                        value={`1h`}
                        name={`role`}>
                        1 hour
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetReminder(e, `3h`);
                        }}
                        checked={setTimeValue === `3h`}
                        value={`3h`}
                        name={`role`}>
                        3 hours
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetReminder(e, `tomorrow`);
                        }}
                        checked={setTimeValue === `tomorrow`}
                        value={`tomorrow`}
                        name={`role`}>
                        Tomorrow
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetReminder(e, `next_week`);
                        }}
                        checked={setTimeValue === `next_week`}
                        value={`next_week`}
                        name={`role`}>
                        Next Week
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={handleSelectPickDateTime}
                        checked={setTimeValue === `pick_data`}
                        value={`pick_data`}
                        name={`role`}>
                        Pick date and time
                    </RadioInput>
                    {
                        showDateTimePicker &&
                        <DateTimePicker
                            minDate={new Date()}
                            onChange={handlePickDateTime}
                            value={customTimeValue}
                            disableClock={true}
                        />
                    }
                </InputContainer>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSnooze}>Snooze</Button>{" "}
                <Button outline color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

export default React.memo(ChatReminderModal);