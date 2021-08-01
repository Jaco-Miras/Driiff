import { useSelector } from "react-redux";
import useChannelActions from "./useChannelActions";

/**
 * @returns {{channels, selectedChannel, lastVisitedChannel, actions: {fetchMembersById: (...args: any[]) => any, saveHistoricalPosition: (...args: any[]) => any, unArchive, fetchNoChannelUsers: (...args: any[]) => any, createByUserChannel: (...args: any[]) => any, select, update, unMute, markAsRead, searchExisting, pin, fetchLastVisited: (...args: any[]) => any, fetchByCode: (...args: any[]) => any, unPin, fetchAll: (...args: any[]) => any, saveLastVisited: (...args: any[]) => any, archive, mute, unHide, updateName, hide, addMembers, deleteMembers, fetch: (...args: any[]) => any, fetchDrafts: (...args: any[]) => any, markAsUnRead}, channelsLoaded}}
 */
const useChannels = () => {
  const channels = useSelector((state) => state.chat.channels);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const channelsLoaded = useSelector((state) => state.chat.channelsLoaded);
  const lastVisitedChannel = useSelector((state) => state.chat.lastVisitedChannel);
  const chatSidebarSearch = useSelector((state) => state.chat.chatSidebarSearch);
  const actions = useChannelActions();

  return {
    actions,
    channels,
    selectedChannel,
    lastVisitedChannel,
    channelsLoaded,
    chatSidebarSearch,
  };
};

export default useChannels;
