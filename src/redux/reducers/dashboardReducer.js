const INITIAL_STATE = {
  timeline: {
    init: false,
    skip: 0,
    limit: 1000,
    has_more: true,
    items: {},
  },
  members: {
    init: false,
    skip: 0,
    limit: 1000,
    has_more: true,
    items: {},
  },
  recent_posts: {
    init: false,
    skip: 0,
    limit: 1000,
    has_more: true,
    items: {},
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_COMPANY_DASHBOARD_TIMELINE_SUCCESS": {
      let timeline = state.timeline;
      timeline.init = true;
      timeline.skip += timeline.limit;

      action.data.timeline.forEach((t) => {
        timeline.items[t.id] = t;
      });

      return {
        ...state,
      };
    }
    case "GET_COMPANY_DASHBOARD_RECENT_POST_SUCCESS": {
      let recent_posts = state.recent_posts;
      recent_posts.init = true;
      recent_posts.skip += recent_posts.limit;

      action.data.recent_posts.forEach((rp) => {
        recent_posts.items[rp.id] = rp;
      });

      return {
        ...state,
        recent_posts: recent_posts,
      };
    }
    case "GET_COMPANY_DASHBOARD_MEMBERS_SUCCESS": {
      let members = state.members;
      members.init = true;
      members.skip += members.limit;

      action.data.members.forEach((m) => {
        members.items[m.id] = m;
      });

      return {
        ...state,
        members: members,
      };
    }
    case "INCOMING_DELETED_POST": {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          items: Object.values(state.timeline.items)
            .filter((timeline) => !(timeline.tag === "POST" && timeline.item && timeline.item.id === action.data.post_id))
            .reduce((acc, t) => {
              acc[t.id] = t;
              return acc;
            }, {}),
        },
      };
    }
    case "INCOMING_POST": {
      if (action.data.SOCKET_TYPE === "POST_CREATE" && action.data.recipients.some((r) => r.type === "DEPARTMENT") && Object.keys(state.timeline.items).length > 0) {
        return {
          ...state,
          timeline: {
            ...state.timeline,
            items: {
              ...state.timeline.items,
              [action.data.created_at.timestamp]: {
                id: action.data.created_at.timestamp,
                tag: "POST",
                item: {
                  body: action.data.body,
                  created_at: { timestamp: action.data.created_at.timestamp },
                  id: action.data.id,
                  title: action.data.title,
                  user: action.data.author,
                },
              },
            },
          },
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};
