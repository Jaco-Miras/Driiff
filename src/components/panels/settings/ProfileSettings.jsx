import momentTZ from "moment-timezone";
import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import Select from "react-select";
import {CustomInput} from "reactstrap";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import Flag from "../../common/Flag";
import {useSettings, useTranslation} from "../../hooks";
import {getDriffName} from "../../hooks/useDriff";
import {selectTheme} from "../../../helpers/selectTheme";
import {useToaster} from "../../hooks";


const Wrapper = styled.div`
    .card {
        overflow: visible;
    }

    .custom-switch {
        padding: 0;
        min-height: 34px;
        justify-content: left;
        align-items: center;
        display: flex;
        min-height: 38px;
        .custom-control-label::after{
            right: -11px;
            left: auto;
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 100%;
            top: 2px;
        }

        input[type="checkbox"]:checked + .custom-control-label::after {
            right: -23px;
        }

        .custom-control-label::before {
            right: -2.35rem;
            left: auto;
            width: 3rem;
            height: 1.5rem;
            border-radius: 48px;
            top: 0;
        }

        input {
            cursor: pointer;
        }
        label {
            cursor: pointer;
            width: calc(100% - 40px);
            min-height: 25px;
            display: flex;
            align-item: center;

            span {
                display: flex;
                align-item: center;

                display: block;
                width: calc(100% - 35px);
            }
        }
    }
`;

const ProfileSettings = (props) => {

    const {className = ""} = props;

    const toaster = useToaster();

    const {user: loggedUser} = useSelector(state => state.session);

    const {
        generalSettings: {language, timezone, date_format, time_format},
        chatSettings: {order_channel, sound_enabled},
        userSettings: isLoaded,
        setChatSetting,
        setGeneralSetting,
    } = useSettings();
    const {_t, setLocale} = useTranslation();

    const channelSortOptions = [
        {
            value: "channel_date_updated",
            label: _t("GENERAL.RECENT", "Recent activity"),
        },
        {
            value: "channel_name",
            label: _t("GENERAL.CHANNEL_NAME", "Channel name"),
        },
    ];

    const languageOptions = [
        {
            value: "en",
            label: <><Flag countryAbbr="en" className="mr-2" width="18"/>{_t("LANGUAGE.ENGLISH", "English")}</>,
        },
        {value: "nl", label: <><Flag countryAbbr="nl" className="mr-2" width="18"/>{_t("LANGUAGE.DUTCH", "Dutch")}</>},
        {
            value: "de",
            label: <><Flag countryAbbr="de" className="mr-2" width="18"/>{_t("LANGUAGE.GERMAN", "German")}</>,
        },
    ];

    const TimezoneOptions = momentTZ.tz.names().map(tz => {
        return {
            value: tz,
            label: tz,
        };
    });

    const DateFormatOptions = [
        {
            value: "DD-MM-YYYY",
            label: "DD-MM-YYYY",
        },
        {
            value: "YYYY-MM-DD",
            label: "YYYY-MM-DD",
        },
        {
            value: "MM-DD-YYYY",
            label: "MM-DD-YYYY",
        },
    ];

    const TimeFormatOptions = [
        {
            value: "hh:mm A",
            label: "AM/PM",
        },
        {
            value: "HH:mm",
            label: "24-hour format",
        },
    ];


    const handleLanguageChange = (e) => {
        setLocale(e.value);
        toaster.success(<span>You have succesfully updated Language</span>);
    };

    const handleChatSwitchToggle = useCallback((e) => {
        e.persist();
        const {name, checked} = e.target;
        setChatSetting({
            [name]: checked,
        });
        toaster.success(<span>You have succesfully updated chat sound notifications</span>);
    }, [setChatSetting]);

    const handleSortChannelChange = (e) => {
        setChatSetting({
            order_channel: {
                order_by: e.value,
                sort_by: e.value === "channel_date_updated" ? "DESC" : "ASC",
            },
        });
        toaster.success(<span>You have succesfully sort channel</span>);
    };

    const handleTimezoneChange = useCallback((e) => {
        setGeneralSetting({timezone: e.value});
        toaster.success(<span>You have succesfully updated Timezone</span>);
    }, []);

    const handleDateFormatChange = useCallback((e) => {
        setGeneralSetting({date_format: e.value});
        toaster.success(<span>You have succesfully updated Date format</span>);
    }, []);

    const handleTimeFormatChange = useCallback((e) => {
        setGeneralSetting({time_format: e.value});
        toaster.success(<span>You have succesfully updated Time format</span>);
    }, []);

    const handleSystemSettingsClick = () => {
        window.open(`https://${getDriffName()}.driff.io/admin`, "Admin");
    };

    if (!isLoaded)
        return <></>;

    return (
        <Wrapper className={`profile-settings ${className}`}>
            {
                loggedUser.role.name === "owner" &&
                <div className="card">
                    <div className="card-body">
                        <h6 className="card-title d-flex justify-content-between align-items-center mb-0">System
                            Settings <SvgIconFeather
                                className="cursor-pointer" icon="settings"
                                onClick={handleSystemSettingsClick}/></h6>
                    </div>
                </div>
            }
            <div className="card">
                <div className="card-body">
                    <h6 className="card-title d-flex justify-content-between align-items-center">Chat Settings</h6>
                    <div className="row mb-2">
                        <div className="col-12">
                            <CustomInput
                                className="cursor-pointer text-muted"
                                checked={sound_enabled}
                                type="switch"
                                id="chat_sound_enabled"
                                name="sound_enabled"
                                onChange={handleChatSwitchToggle}
                                label={<span>Play a sound when receiving a new chat message</span>}
                            />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5 text-muted">Sort channel by</div>
                        <div className="col-7">

                            <Select styles={selectTheme} value={channelSortOptions.find(o => o.value === order_channel.order_by)}
                                    onChange={handleSortChannelChange} options={channelSortOptions}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h6 className="card-title d-flex justify-content-between align-items-center">Localization</h6>

                    <div className="row mb-2">
                        <div className="col-5 text-muted">Language</div>
                        <div className="col-7">
                            <Select
                                styles={selectTheme}
                                value={languageOptions.find(o => o.value === language)}
                                onChange={handleLanguageChange}
                                options={languageOptions}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5 text-muted">Timezone</div>
                        <div className="col-7">
                            <Select
                                styles={selectTheme}
                                value={TimezoneOptions.find(o => o.value === timezone)}
                                onChange={handleTimezoneChange}
                                options={TimezoneOptions}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5 text-muted">Date and Time Format</div>
                        <div className="col-7 justify-content-center align-items-center">
                            <div className="row">
                                <Select
                                    styles={selectTheme}
                                    className="col-6"
                                    value={DateFormatOptions.find(o => o.value === date_format)}
                                    onChange={handleDateFormatChange}
                                    options={DateFormatOptions}/>
                                <Select
                                    styles={selectTheme}
                                    className="col-6"
                                    value={TimeFormatOptions.find(o => o.value === time_format)}
                                    onChange={handleTimeFormatChange}
                                    options={TimeFormatOptions}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>);
};

export default React.memo(ProfileSettings);