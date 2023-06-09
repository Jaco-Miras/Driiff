import { convertArrayToObject } from "../../helpers/arrayHelper";
const INITIAL_STATE = {
  user: {},
  WIPs: {},
  subjects: [],
  activeSubject: null,
  WIPComments: {},
  fileComments: {},
  annotation: {},
  uploadNewVersion: false,
  replaceCurrentImage: false,
  editFileComment: null,
  editWIPComment: null,
  commentQuotes: {},
  parentId: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_USER_TO_REDUCERS": {
      return {
        ...state,
        user: action.data,
      };
    }
    case "INCOMING_WIP": {
      return {
        ...state,
        WIPs: {
          ...state.WIPs,
          [action.data.subject.topic_id]: {
            ...(state.WIPs[action.data.subject.topic_id] && {
              ...state.WIPs[action.data.subject.topic_id],
              items: {
                ...state.WIPs[action.data.subject.topic_id].wips,
                [action.data.id]: {
                  ...action.data,
                },
              },
            }),
            ...(!state.WIPs[action.data.subject.topic_id] && {
              items: {
                [action.data.id]: {
                  ...action.data,
                },
              },
            }),
          },
        },
      };
    }
    case "INCOMING_WIP_SUBJECT":
    case "CREATE_WIP_SUCCESS": {
      return {
        ...state,
        subjects: [...state.subjects, action.data],
      };
    }
    case "GET_WIP_SUBJECTS_SUCCESS": {
      return {
        ...state,
        subjects: [...state.subjects, ...action.data],
      };
    }
    case "ADD_WIPS": {
      return {
        ...state,
        WIPs: {
          ...state.WIPs,
          [action.data.topic_id]: {
            ...(state.WIPs[action.data.topic_id] && {
              ...state.WIPs[action.data.topic_id],
              items: {
                ...state.WIPs[action.data.topic_id].wips,
                ...convertArrayToObject(action.data.proposals, "id"),
              },
            }),
            ...(!state.WIPs[action.data.topic_id] && {
              items: convertArrayToObject(action.data.proposals, "id"),
            }),
          },
        },
      };
    }
    case "GET_WIP_DETAIL_SUCCESS": {
      return {
        ...state,
        WIPs: {
          ...state.WIPs,
          [action.data.topic_id]: {
            ...(state.WIPs[action.data.topic_id] && {
              ...state.WIPs[action.data.topic_id],
              items: {
                ...state.WIPs[action.data.topic_id].items,
                ...(!state.WIPs[action.data.topic_id].items[action.data.id] && {
                  [action.data.id]: {
                    ...action.data,
                    clap_user_ids: [],
                  },
                }),
              },
            }),
            ...(!state.WIPs[action.data.topic_id] && {
              items: {
                [action.data.id]: {
                  ...action.data,
                  clap_user_ids: [],
                },
              },
            }),
          },
        },
      };
    }
    case "ADD_WIP_COMMENT": {
      return {
        ...state,
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          if (parseInt(wid) === action.data.topic_id) {
            acc[wid] = {
              ...state.WIPs[wid],
              items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
                if (parseInt(pid) === action.data.proposal_id) {
                  icc[pid] = { ...state.WIPs[wid].items[pid], reply_count: state.WIPs[wid].items[pid].reply_count + 1 };
                } else {
                  icc[pid] = state.WIPs[wid].items[pid];
                }
                return icc;
              }, {}),
            };
          } else acc[wid] = state.WIPs[wid];

          return acc;
        }, {}),
        WIPComments: {
          ...state.WIPComments,
          ...(state.WIPComments[action.data.proposal_id] && {
            [action.data.proposal_id]: {
              ...state.WIPComments[action.data.proposal_id],
              comments: {
                ...state.WIPComments[action.data.proposal_id].comments,
                ...(action.data.parent_id === null && {
                  [action.data.id]: action.data,
                }),
                ...(action.data.parent_id !== null && {
                  [action.data.parent_id]: {
                    ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id],
                    replies: {
                      ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies,
                      [action.data.id]: action.data,
                    },
                  },
                }),
              },
            },
          }),
          ...(!state.WIPComments[action.data.proposal_id] &&
            action.data.parent_id === null && {
              [action.data.proposal_id]: {
                skip: 0,
                limit: 20,
                hasMore: true,
                comments: {
                  [action.data.id]: action.data,
                },
              },
            }),
        },
      };
    }
    case "INCOMING_WIP_COMMENT": {
      return {
        ...state,
        WIPComments: {
          ...state.WIPComments,
          ...(state.WIPComments[action.data.proposal_id] && {
            [action.data.proposal_id]: {
              ...state.WIPComments[action.data.proposal_id],
              comments: {
                ...Object.keys(state.WIPComments[action.data.proposal_id].comments).reduce((res, key) => {
                  if (action.data.parent_id) {
                    res[key] = {
                      ...state.WIPComments[action.data.proposal_id].comments[key],
                      replies: {
                        ...Object.keys(state.WIPComments[action.data.proposal_id].comments[key].replies).reduce((rep, k) => {
                          if (action.data.reference_id && k === action.data.reference_id) {
                            rep[action.data.id] = {
                              ...action.data,
                              clap_user_ids: [],
                              // clap_user_ids: state.WIPComments[action.data.proposal_id].comments[key].replies[action.data.reference_id].clap_user_ids,
                            };
                          } else {
                            if (parseInt(k) === action.data.id) {
                              rep[k] = { ...state.WIPComments[action.data.proposal_id].comments[key].replies[k], body: action.data.body, updated_at: action.data.updated_at, quote: action.data.quote };
                            } else {
                              rep[k] = state.WIPComments[action.data.proposal_id].comments[key].replies[k];
                            }
                          }
                          return rep;
                        }, {}),
                      },
                    };
                  } else {
                    if (action.data.reference_id && key === action.data.reference_id) {
                      res[action.data.id] = { ...action.data, clap_user_ids: [] };
                    } else {
                      if (parseInt(key) === action.data.id) {
                        res[key] = { ...state.WIPComments[action.data.proposal_id].comments[key], body: action.data.body, updated_at: action.data.updated_at, quote: action.data.quote };
                      } else {
                        res[key] = state.WIPComments[action.data.proposal_id].comments[key];
                      }
                    }
                  }
                  return res;
                }, {}),
                ...(state.user.id !== action.data.author.id && {
                  ...(action.data.parent_id &&
                    state.WIPComments[action.data.proposal_id].comments[action.data.parent_id] && {
                      [action.data.parent_id]: {
                        ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id],
                        replies: {
                          ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies,
                          [action.data.id]: action.data,
                        },
                      },
                    }),
                  ...(!action.data.parent_id && {
                    [action.data.id]: action.data,
                  }),
                }),
                ...(!action.data.hasOwnProperty("reference_id") && {
                  ...(action.data.parent_id &&
                    state.WIPComments[action.data.proposal_id].comments[action.data.parent_id] && {
                      [action.data.parent_id]: {
                        ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id],
                        replies: {
                          ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies,
                          [action.data.id]: action.data,
                        },
                      },
                    }),
                  ...(!action.data.parent_id && {
                    [action.data.id]: action.data,
                  }),
                }),
              },
            },
          }),
          ...(!state.WIPComments[action.data.proposal_id] && {
            skip: 0,
            limit: 20,
            hasMore: true,
            comments: {
              [action.data.id]: action.data,
            },
          }),
        },
      };
    }
    case "INCOMING_UPDATED_WIP_COMMENT": {
      return {
        ...state,
        WIPComments: {
          ...state.WIPComments,
          ...(state.WIPComments[action.data.proposal_id] && {
            [action.data.proposal_id]: {
              ...state.WIPComments[action.data.proposal_id],
              comments: {
                ...Object.keys(state.WIPComments[action.data.proposal_id].comments).reduce((res, key) => {
                  if (action.data.parent_id) {
                    res[key] = {
                      ...state.WIPComments[action.data.proposal_id].comments[key],
                      replies: {
                        ...Object.keys(state.WIPComments[action.data.proposal_id].comments[key].replies).reduce((rep, k) => {
                          if (parseInt(k) === action.data.id) {
                            rep[k] = { ...state.WIPComments[action.data.proposal_id].comments[key].replies[k], body: action.data.body, updated_at: action.data.updated_at, quote: action.data.quote };
                          } else {
                            rep[k] = state.WIPComments[action.data.proposal_id].comments[key].replies[k];
                          }
                          return rep;
                        }, {}),
                      },
                    };
                  } else {
                    if (parseInt(key) === action.data.id) {
                      res[key] = { ...state.WIPComments[action.data.proposal_id].comments[key], body: action.data.body, updated_at: action.data.updated_at, quote: action.data.quote };
                    } else {
                      res[key] = state.WIPComments[action.data.proposal_id].comments[key];
                    }
                  }
                  return res;
                }, {}),
              },
            },
          }),
        },
      };
    }
    case "SET_WIP_COMMENT_QUOTE": {
      let updatedQuotes = { ...state.commentQuotes };
      if (Object.keys(state.commentQuotes).length > 0 && state.commentQuotes.hasOwnProperty(action.data.id)) {
        updatedQuotes = { ...state.commentQuotes };
        delete updatedQuotes[action.data.id];
        updatedQuotes = {
          ...updatedQuotes,
          [action.data.id]: action.data,
        };
      } else {
        updatedQuotes = {
          ...state.commentQuotes,
          [action.data.id]: action.data,
        };
      }
      return {
        ...state,
        commentQuotes: updatedQuotes,
      };
    }
    case "CLEAR_WIP_COMMENT_QUOTE": {
      let updatedQuotes = { ...state.commentQuotes };
      delete updatedQuotes[action.data];

      return {
        ...state,
        commentQuotes: updatedQuotes,
      };
    }
    case "GET_WIP_COMMENTS_SUCCESS": {
      return {
        ...state,
        WIPComments: {
          ...state.WIPComments,
          ...(!state.WIPComments[action.data.proposal_id] && {
            [action.data.proposal_id]: {
              skip: 0,
              limit: 10,
              hasMore: true,
              comments: convertArrayToObject(
                action.data.messages.map((d) => {
                  return {
                    ...d,
                    clap_user_ids: [],
                    replies: convertArrayToObject(
                      d.replies.map((sc) => {
                        return { ...sc, clap_user_ids: [] };
                      }),
                      "id"
                    ),
                  };
                }),
                "id"
              ),
            },
          }),
        },
      };
    }
    case "ADD_FILE_COMMENT": {
      return {
        ...state,
        fileComments: {
          ...state.fileComments,
          ...(!state.fileComments[action.data.file_version_id] &&
            action.data.parent_id === null && {
              [action.data.file_version_id]: {
                skip: 0,
                limit: 20,
                hasMore: true,
                comments: {
                  [action.data.reference_id]: action.data,
                },
              },
            }),
          ...(state.fileComments[action.data.file_version_id] && {
            [action.data.file_version_id]: {
              ...state.fileComments[action.data.file_version_id],
              comments: {
                ...state.fileComments[action.data.file_version_id].comments,
                [action.data.reference_id]: action.data,
              },
            },
          }),
        },
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          if (parseInt(wid) === action.data.workspace_id) {
            acc[wid] = {
              ...state.WIPs[wid],
              items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
                if (parseInt(pid) === action.data.proposal_id) {
                  icc[pid] = {
                    ...state.WIPs[wid].items[pid],
                    files: state.WIPs[wid].items[pid].files.map((f) => {
                      if (action.data.file_id === f.id) {
                        return {
                          ...f,
                          file_versions: f.file_versions.map((fv) => {
                            if (fv.id === action.data.file_version_id) {
                              return { ...fv, annotations: action.data.annotation ? [...fv.annotations, { comment_id: action.data.id, annotation: action.data.annotation }] : fv.annotations };
                            } else {
                              return fv;
                            }
                          }),
                        };
                      } else {
                        return f;
                      }
                    }),
                  };
                } else {
                  icc[pid] = state.WIPs[wid].items[pid];
                }
                return icc;
              }, {}),
            };
          } else acc[wid] = state.WIPs[wid];

          return acc;
        }, {}),
      };
    }
    case "GET_FILE_COMMENTS_SUCCESS": {
      return {
        ...state,
        fileComments: {
          ...state.fileComments,
          ...(!state.fileComments[action.data.file_version_id] && {
            [action.data.file_version_id]: {
              skip: action.data.next_skip,
              limit: 20,
              hasMore: action.data.file_version_messages.length === 20,
              comments: convertArrayToObject(
                action.data.file_version_messages.map((d) => {
                  return {
                    ...d,
                    clap_user_ids: [],
                    replies: convertArrayToObject(
                      d.replies.map((sc) => {
                        return { ...sc, clap_user_ids: [] };
                      }),
                      "id"
                    ),
                  };
                }),
                "id"
              ),
            },
          }),
        },
      };
    }
    case "INCOMING_WIP_FILE_COMMENT": {
      return {
        ...state,
        fileComments: {
          ...state.fileComments,
          ...(state.fileComments[action.data.file_version_id] && {
            [action.data.file_version_id]: {
              ...state.fileComments[action.data.file_version_id],
              comments: {
                ...Object.keys(state.fileComments[action.data.file_version_id].comments).reduce((res, key) => {
                  if (action.data.reference_id && key === action.data.reference_id) {
                    res[action.data.id] = { ...action.data, clap_user_ids: [] };
                  } else {
                    if (parseInt(key) === action.data.id) {
                      res[key] = { ...state.fileComments[action.data.file_version_id].comments[key], body: action.data.body, updated_at: action.data.updated_at, quote: action.data.quote };
                    } else {
                      res[key] = state.fileComments[action.data.file_version_id].comments[key];
                    }
                  }
                  // if (action.data.parent_id) {
                  //   res[key] = {
                  //     ...state.fileComments[action.data.file_version_id].comments[key],
                  //     replies: {
                  //       ...Object.keys(state.fileComments[action.data.file_version_id].comments[key].replies).reduce((rep, k) => {
                  //         if (action.data.reference_id && k === action.data.reference_id) {
                  //           rep[action.data.id] = {
                  //             ...action.data,
                  //             clap_user_ids: [],
                  //           };
                  //         } else {
                  //           if (parseInt(k) === action.data.id) {
                  //             rep[k] = { ...state.fileComments[action.data.file_version_id].comments[key].replies[k], body: action.data.body, updated_at: action.data.updated_at, quote: action.data.quote };
                  //           } else {
                  //             rep[k] = state.fileComments[action.data.file_version_id].comments[key].replies[k];
                  //           }
                  //         }
                  //         return rep;
                  //       }, {}),
                  //     },
                  //   };
                  // } else {
                  //   if (action.data.reference_id && key === action.data.reference_id) {
                  //     res[action.data.id] = { ...action.data, clap_user_ids: [] };
                  //   } else {
                  //     if (parseInt(key) === action.data.id) {
                  //       res[key] = { ...state.fileComments[action.data.file_version_id].comments[key], body: action.data.body, updated_at: action.data.updated_at, quote: action.data.quote };
                  //     } else {
                  //       res[key] = state.fileComments[action.data.file_version_id].comments[key];
                  //     }
                  //   }
                  // }
                  return res;
                }, {}),
                ...(state.user.id !== action.data.author.id && {
                  [action.data.id]: action.data,
                  // ...(action.data.parent_id &&
                  //   state.fileComments[action.data.file_version_id].comments[action.data.parent_id] && {
                  //     [action.data.parent_id]: {
                  //       ...state.fileComments[action.data.file_version_id].comments[action.data.parent_id],
                  //       replies: {
                  //         ...state.fileComments[action.data.file_version_id].comments[action.data.parent_id].replies,
                  //         [action.data.id]: action.data,
                  //       },
                  //     },
                  //   }),
                  // ...(!action.data.parent_id && {
                  //   [action.data.id]: action.data,
                  // }),
                }),
                ...(!action.data.hasOwnProperty("reference_id") && {
                  [action.data.id]: action.data,
                  // ...(action.data.parent_id &&
                  //   state.fileComments[action.data.file_version_id].comments[action.data.parent_id] && {
                  //     [action.data.parent_id]: {
                  //       ...state.fileComments[action.data.file_version_id].comments[action.data.parent_id],
                  //       replies: {
                  //         ...state.fileComments[action.data.file_version_id].comments[action.data.parent_id].replies,
                  //         [action.data.id]: action.data,
                  //       },
                  //     },
                  //   }),
                  // ...(!action.data.parent_id && {
                  //   [action.data.id]: action.data,
                  // }),
                }),
              },
            },
          }),
          ...(!state.fileComments[action.data.file_version_id] && {
            skip: 0,
            limit: 20,
            hasMore: true,
            comments: {
              [action.data.id]: action.data,
            },
          }),
        },
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          if (parseInt(wid) === action.data.topic_id) {
            acc[wid] = {
              ...state.WIPs[wid],
              items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
                if (parseInt(pid) === action.data.proposal_id) {
                  icc[pid] = {
                    ...state.WIPs[wid].items[pid],
                    files: state.WIPs[wid].items[pid].files.map((f) => {
                      if (action.data.media_id === f.id) {
                        return {
                          ...f,
                          file_versions: f.file_versions.map((fv) => {
                            if (fv.file_version_id === action.data.file_version_id) {
                              return {
                                ...fv,
                                annotations:
                                  action.data.annotation && fv.annotations.some((an) => an.comment_id === action.data.reference_id || an.comment_id === action.data.id)
                                    ? fv.annotations.map((an) => {
                                        if (an.comment_id === action.data.reference_id || an.comment_id === action.data.id) {
                                          return { ...an, comment_id: action.data.id };
                                        } else return an;
                                      })
                                    : action.data.annotation && !fv.annotations.some((an) => an.comment_id === action.data.reference_id)
                                    ? [...fv.annotations, { comment_id: action.data.id, annotation: action.data.annotation }]
                                    : fv.annotations,
                              };
                            } else {
                              return fv;
                            }
                          }),
                        };
                      } else {
                        return f;
                      }
                    }),
                  };
                } else {
                  icc[pid] = state.WIPs[wid].items[pid];
                }
                return icc;
              }, {}),
            };
          } else acc[wid] = state.WIPs[wid];

          return acc;
        }, {}),
      };
    }
    case "SAVE_ANNOTATION": {
      return {
        ...state,
        annotation: action.data,
      };
    }
    case "OPEN_FILE_DIALOG": {
      return {
        ...state,
        uploadNewVersion: action.data.open,
      };
    }
    case "INCOMING_REPLACED_WIP_FILE": {
      return {
        ...state,
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          acc[wid] = {
            ...state.WIPs[wid],
            items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
              icc[pid] = {
                ...state.WIPs[wid].items[pid],
                files: state.WIPs[wid].items[pid].files.map((f) => {
                  if (action.data.media_id === f.id) {
                    return {
                      ...f,
                      file_versions: f.file_versions.map((fv) => {
                        if (fv.id === action.data.file_version_id) {
                          return action.data;
                        } else {
                          return fv;
                        }
                      }),
                    };
                  } else {
                    return f;
                  }
                }),
              };
              return icc;
            }, {}),
          };
          return acc;
        }, {}),
      };
    }
    case "INCOMING_NEW_WIP_FILE_VERSION": {
      return {
        ...state,
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          acc[wid] = {
            ...state.WIPs[wid],
            items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
              icc[pid] = {
                ...state.WIPs[wid].items[pid],
                files: state.WIPs[wid].items[pid].files.map((f) => {
                  if (action.data.media_id === f.id) {
                    return {
                      ...f,
                      file_versions: [...f.file_versions, action.data],
                    };
                  } else {
                    return f;
                  }
                }),
              };
              return icc;
            }, {}),
          };
          return acc;
        }, {}),
      };
    }
    case "SET_EDIT_FILE_COMMENT": {
      return {
        ...state,
        editFileComment: action.data,
      };
    }
    case "INCOMING_UPDATED_WIP_FILE_COMMENT": {
      return {
        ...state,
        fileComments: {
          ...state.fileComments,
          ...(state.fileComments[action.data.file_version_id] && {
            [action.data.file_version_id]: {
              ...state.fileComments[action.data.file_version_id],
              comments: {
                ...Object.keys(state.fileComments[action.data.file_version_id].comments).reduce((res, key) => {
                  if (parseInt(key) === action.data.id) {
                    res[key] = { ...state.fileComments[action.data.file_version_id].comments[key], body: action.data.body, updated_at: action.data.updated_at, quote: action.data.quote };
                  } else {
                    res[key] = state.fileComments[action.data.file_version_id].comments[key];
                  }
                  return res;
                }, {}),
              },
            },
          }),
        },
      };
    }
    case "INCOMING_CLOSED_FILE_COMMENTS": {
      return {
        ...state,
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          acc[wid] = {
            ...state.WIPs[wid],
            items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
              if (parseInt(pid) === action.data.proposal_id) {
                icc[pid] = {
                  ...state.WIPs[wid].items[pid],
                  files: state.WIPs[wid].items[pid].files.map((f) => {
                    if (action.data.media_id === f.id) {
                      return {
                        ...f,
                        file_versions: f.file_versions.map((fv) => {
                          if (fv.file_version_id === action.data.file_version_id) {
                            return {
                              ...fv,
                              is_close: action.data.is_close,
                            };
                          } else {
                            return fv;
                          }
                        }),
                      };
                    } else {
                      return f;
                    }
                  }),
                };
              } else {
                icc[pid] = state.WIPs[wid].items[pid];
              }
              return icc;
            }, {}),
          };

          return acc;
        }, {}),
      };
    }
    case "INCOMING_APPROVED_FILE_VERSION": {
      return {
        ...state,
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          acc[wid] = {
            ...state.WIPs[wid],
            items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
              if (parseInt(pid) === action.data.proposal_id) {
                icc[pid] = {
                  ...state.WIPs[wid].items[pid],
                  files: state.WIPs[wid].items[pid].files.map((f) => {
                    if (action.data.media_id === f.id) {
                      return {
                        ...f,
                        file_versions: f.file_versions.map((fv) => {
                          if (fv.file_version_id === action.data.file_version_id) {
                            return {
                              ...fv,
                              ...action.data,
                            };
                          } else {
                            return fv;
                          }
                        }),
                      };
                    } else {
                      return f;
                    }
                  }),
                };
              } else {
                icc[pid] = state.WIPs[wid].items[pid];
              }
              return icc;
            }, {}),
          };

          return acc;
        }, {}),
      };
    }
    case "SET_EDIT_WIP_COMMENT": {
      let updatedQuotes = { ...state.commentQuotes };
      if (Object.keys(state.commentQuotes).length > 0 && state.editWIPComment && action.data === null) {
        updatedQuotes = { ...state.commentQuotes };
        delete updatedQuotes[state.editWIPComment.id];
      }
      return {
        ...state,
        editWIPComment: action.data,
        commentQuotes: updatedQuotes,
      };
    }
    case "SET_PARENT_ID_FOR_UPLOAD": {
      return {
        ...state,
        parentId: action.data,
      };
    }
    case "ADD_WIP_COMMENT_REACT": {
      return {
        ...state,
        WIPComments: {
          ...state.WIPComments,
          [action.data.proposal_id]: {
            ...state.WIPComments[action.data.proposal_id],
            ...(action.data.parent_id
              ? {
                  comments: {
                    ...state.WIPComments[action.data.proposal_id].comments,
                    [action.data.parent_id]: {
                      ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id],
                      replies: {
                        ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies,
                        [action.data.id]: {
                          ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies[action.data.id],
                          clap_user_ids: [...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies[action.data.id].clap_user_ids, state.user.id],
                          clap_count: state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies[action.data.id].clap_count + 1,
                          user_clap_count: 1,
                        },
                      },
                    },
                  },
                }
              : {
                  ...(state.WIPComments[action.data.proposal_id] && {
                    comments: {
                      ...state.WIPComments[action.data.proposal_id].comments,
                      [action.data.id]: {
                        ...state.WIPComments[action.data.proposal_id].comments[action.data.id],
                        clap_user_ids: [...state.WIPComments[action.data.proposal_id].comments[action.data.id].clap_user_ids, state.user.id],
                        clap_count: state.WIPComments[action.data.proposal_id].comments[action.data.id].clap_count + 1,
                        user_clap_count: 1,
                      },
                    },
                  }),
                }),
          },
        },
      };
    }
    case "REMOVE_WIP_COMMENT_REACT": {
      return {
        ...state,
        WIPComments: {
          ...state.WIPComments,
          [action.data.proposal_id]: {
            ...state.WIPComments[action.data.proposal_id],
            ...(action.data.parent_id && state.WIPComments[action.data.proposal_id]
              ? {
                  comments: {
                    ...state.WIPComments[action.data.proposal_id].comments,
                    [action.data.parent_id]: {
                      ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id],
                      replies: {
                        ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies,
                        [action.data.id]: {
                          ...state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies[action.data.id],
                          clap_user_ids: state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies[action.data.id].clap_user_ids.filter((id) => id !== state.user.id),
                          clap_count: state.WIPComments[action.data.proposal_id].comments[action.data.parent_id].replies[action.data.id].clap_count - 1,
                          user_clap_count: 0,
                        },
                      },
                    },
                  },
                }
              : {
                  ...(state.WIPComments[action.data.proposal_id] && {
                    comments: {
                      ...state.WIPComments[action.data.proposal_id].comments,
                      [action.data.id]: {
                        ...state.WIPComments[action.data.proposal_id].comments[action.data.id],
                        clap_user_ids: state.WIPComments[action.data.proposal_id].comments[action.data.id].clap_user_ids.filter((id) => id !== state.user.id),
                        clap_count: state.WIPComments[action.data.proposal_id].comments[action.data.id].clap_count - 1,
                        user_clap_count: 0,
                      },
                    },
                  }),
                }),
          },
        },
      };
    }
    case "ADD_WIP_REACT": {
      return {
        ...state,
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          acc[wid] = {
            ...state.WIPs[wid],
            items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
              if (parseInt(pid) === action.data.proposal_id) {
                icc[pid] = {
                  ...state.WIPs[wid].items[pid],
                  clap_user_ids: [...state.WIPs[wid].items[pid].clap_user_ids, state.user.id],
                  clap_count: state.WIPs[wid].items[pid].clap_count + 1,
                  user_clap_count: 1,
                };
              } else {
                icc[pid] = state.WIPs[wid].items[pid];
              }
              return icc;
            }, {}),
          };

          return acc;
        }, {}),
      };
    }
    case "REMOVE_WIP_REACT": {
      return {
        ...state,
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          acc[wid] = {
            ...state.WIPs[wid],
            items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
              if (parseInt(pid) === action.data.proposal_id) {
                icc[pid] = {
                  ...state.WIPs[wid].items[pid],
                  clap_user_ids: state.WIPs[wid].items[pid].clap_user_ids.filter((id) => id !== state.user.id),
                  clap_count: state.WIPs[wid].items[pid].clap_count - 1,
                  user_clap_count: 0,
                };
              } else {
                icc[pid] = state.WIPs[wid].items[pid];
              }
              return icc;
            }, {}),
          };

          return acc;
        }, {}),
      };
    }
    case "INCOMING_PROPOSAL_CLAP": {
      return {
        ...state,
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          acc[wid] = {
            ...state.WIPs[wid],
            items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
              if (parseInt(pid) === action.data.proposal_id) {
                icc[pid] = {
                  ...state.WIPs[wid].items[pid],
                  ...(action.data.clap_count === 1
                    ? {
                        clap_count: action.data.author.id === state.user.id ? state.WIPs[wid].items[pid].clap_count : state.WIPs[wid].items[pid].clap_count + 1,
                        clap_user_ids: [...state.WIPs[wid].items[pid].clap_user_ids.filter((id) => id !== action.data.author.id), action.data.author.id],
                        user_clap_count: action.data.author.id === state.user.id ? 1 : state.WIPs[wid].items[pid].user_clap_count,
                      }
                    : {
                        clap_count: action.data.author.id === state.user.id ? state.WIPs[wid].items[pid].clap_count : state.WIPs[wid].items[pid].clap_count - 1,
                        clap_user_ids: state.WIPs[wid].items[pid].clap_user_ids.filter((id) => id !== action.data.author.id),
                        user_clap_count: action.data.author.id === state.user.id ? 0 : state.WIPs[wid].items[pid].user_clap_count,
                      }),
                };
              } else {
                icc[pid] = state.WIPs[wid].items[pid];
              }
              return icc;
            }, {}),
          };

          return acc;
        }, {}),
      };
    }
    case "FAVORITE_WIP": {
      return {
        ...state,
        WIPs: Object.keys(state.WIPs).reduce((acc, wid) => {
          acc[wid] = {
            ...state.WIPs[wid],
            items: Object.keys(state.WIPs[wid].items).reduce((icc, pid) => {
              if (parseInt(pid) === action.data.proposal_id) {
                icc[pid] = {
                  ...state.WIPs[wid].items[pid],
                  is_pinned: !state.WIPs[wid].items[pid].is_pinned,
                };
              } else {
                icc[pid] = state.WIPs[wid].items[pid];
              }
              return icc;
            }, {}),
          };

          return acc;
        }, {}),
      };
    }
    default:
      return state;
  }
};
