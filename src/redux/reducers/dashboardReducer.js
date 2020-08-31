const INITIAL_STATE = {
  timeline: {
    init: false,
    skip: 0,
    limit: 100,
    has_more: true,
    items: {}
  },
  members: {
    init: false,
    skip: 0,
    limit: 100,
    has_more: true,
    items: {}
  },
  recent_posts: {
    init: false,
    skip: 0,
    limit: 100,
    has_more: true,
    items: {}
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_COMPANY_DASHBOARD_TIMELINE_SUCCESS": {
      let timeline = state.timeline;
      timeline.init = true;
      timeline.skip += timeline.limit;

      action.data.timeline.forEach(t => {
        timeline.items[t.id] = t;
      })

      return {
        ...state
      }
    }
    case "GET_COMPANY_DASHBOARD_RECENT_POST_SUCCESS": {
      let recent_posts = state.recent_posts;
      recent_posts.init = true;
      recent_posts.skip += recent_posts.limit;

      action.data.recent_posts.forEach(rp => {
        recent_posts.items[rp.id] = rp;
      })

      return {
        ...state,
        recent_posts: recent_posts
      }
    }
    case "GET_COMPANY_DASHBOARD_MEMBERS_SUCCESS": {
      let members = state.members;
      members.init = true;
      members.skip += members.limit;

      action.data.members.forEach(m => {
        members.items[m.id] = m;
      })

      return {
        ...state,
        members: members,
      }
    }
    default:
      return state;
  }
};
