import React from "react";
import styled from "styled-components";
import useChannelActions from "../hooks/useChannelActions";

const Wrapper = styled.div``;

const TestChat = (props) => {
  const { className = "" } = props;

  const channelActions = useChannelActions();

  // channelActions.fetch({});
  // channelActions.fetchAll({filter: "hidden"});
  // channelActions.fetchLastVisited();
  // channelActions.fetchNoChannelUsers();
  // channelActions.fetchDrafts();
  // channelActions.fetchMembersById(706);

  /*channelActions.fetchByCode("478ec8ce3fba2", (err, res) => {
        let channel = res.data;

        //channelActions.select(channel)
        //channelActions.saveLastVisited(channel);
        //channelActions.archive(channel);
        // channelActions.unArchive(channel);
        // channelActions.update(channel ,{});
        // channelActions.pin(channel);
        // channelActions.unPin(channel);
        // channelActions.mute(channel);
        // channelActions.unMute(channel);
        // channelActions.hide(channel);
        // channelActions.unHide(channel);
        // channelActions.markAsRead(channel);
        // channelActions.markAsUnRead(channel);
        // channelActions.searchExisting("title", [4]);
        // channelActions.addMembers(channel.id, []);
        // channelActions.deleteMembers(channel.id, []);
        // channelActions.updateName(channel.id, "New name");
        //channelActions.saveHistoricalPosition();
    });*/

  return <Wrapper className={`${className}`}></Wrapper>;
};

export default React.memo(TestChat);
