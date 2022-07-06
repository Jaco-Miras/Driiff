import React from "react";
import { SvgIconFeather } from "../common";
import { useSelector } from "react-redux";

const useChannelUpdateMessage = ({ reply, dictionary, allUsers, user, selectedChannel }) => {
  const teams = useSelector((state) => state.users.teams);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const sharedUsers = useSelector((state) => state.users.sharedUsers);
  const userId = selectedChannel.sharedSlug && sharedWs[selectedChannel.slug] ? sharedWs[selectedChannel.slug].user_auth.id : user.id;
  const users = selectedChannel.sharedSlug && sharedUsers[selectedChannel.slug] ? sharedUsers[selectedChannel.slug].users : allUsers;
  let newBody = "";
  if (reply.body.includes("CHANNEL_UPDATE::")) {
    const data = JSON.parse(reply.body.replace("CHANNEL_UPDATE::", ""));

    let author = {
      name: dictionary.someone,
      id: null,
    };

    if (data.author && data.author.id === userId) {
      author = {
        name: <b>{dictionary.you}</b>,
        id: userId,
      };
    } else if (data.author && data.author.id !== userId) {
      let sysAuthor = Object.values(users).find((u) => data.author.id === u.id);
      if (sysAuthor) {
        author = {
          name: sysAuthor.name,
          id: sysAuthor.id,
        };
      }
    }

    if (data.accepted_members && data.author) {
      let sysAuthor = Object.values(users).find((u) => data.author === u.id);
      if (sysAuthor) {
        author = {
          name: sysAuthor.name,
          id: sysAuthor.id,
        };
      }
    }

    const titleChanged = data.title !== "";

    if (data.accepted_members) {
      const acceptedUser = Object.values(users).find((u) => data.accepted_members[0] === u.id);
      newBody = (
        <>
          <b>{author.name}</b> {dictionary.added} <b>{acceptedUser && acceptedUser.name}</b>
        </>
      );
    } else if (data.hasOwnProperty("added_teams")) {
      // for added teams - new system message
      if (titleChanged) {
        newBody = (
          <>
            <SvgIconFeather width={16} icon="edit-3" /> {author.name} {selectedChannel.type === "TOPIC" ? dictionary.renameThisWorkspace : dictionary.renameThisChat} <b>#{data.title}</b>
            <br />
          </>
        );

        //has change on members
        if (data.added_teams && data.added_teams.length) {
          let at = Object.values(teams).filter((t) => data.added_teams.includes(t.id));
          newBody = (
            <>
              {newBody} {dictionary.andAdded}{" "}
              <b>
                {at
                  .map((t) => {
                    return `${dictionary.team}${" "}${t.name}`;
                  })
                  .join(", ")}
              </b>
            </>
          );
        }
        if (data.added_members.length) {
          let am = Object.values(users).filter((u) => data.added_members.includes(u.id));
          if (selectedChannel.slug) {
            am = data.added_members;
          }
          newBody = (
            <>
              {newBody} {dictionary.andAdded}{" "}
              <b>
                {am
                  .map((m) => {
                    if (m.id === userId) {
                      return dictionary.you;
                    } else return m.name;
                  })
                  .join(", ")}
              </b>
            </>
          );
        }
        if (data.removed_teams && data.removed_teams.length) {
          let rt = Object.values(teams).filter((t) => data.removed_teams.includes(t.id));
          newBody = (
            <>
              {newBody} {dictionary.andRemoved}{" "}
              <b>
                {rt
                  .map((t) => {
                    return `${dictionary.team}${" "}${t.name}`;
                  })
                  .join(", ")}
              </b>
            </>
          );
        }
        if (data.removed_members.length) {
          let rm = Object.values(users).filter((u) => data.removed_members.includes(u.id));
          newBody = (
            <>
              {newBody} {dictionary.andRemoved}{" "}
              <b>
                {rm
                  .map((m) => {
                    if (m.id === userId) {
                      return dictionary.you;
                    } else return m.name;
                  })
                  .join(", ")}
              </b>
            </>
          );
        }
      } else {
        //title has not change
        if (data.added_members.length === 0 && data.removed_members.length === 0 && data.added_teams && data.added_teams.length === 0 && data.removed_teams && data.removed_teams.length === 0) {
          // no changes on member
          newBody = (
            <>
              {userId === data.author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>} updated <b>#{selectedChannel.title}</b>
            </>
          );
        } else if (data.added_members.length || data.removed_members.length || (data.added_teams && data.added_teams.length) || (data.removed_teams && data.removed_teams.length)) {
          //has change on members
          if (data.added_members.length === 1 && data.removed_members.length === 0 && data.added_teams.length === 0 && data.removed_teams.length === 0) {
            let joinedUser = Object.values(users).find((u) => u.id === data.added_members[0]);
            if (selectedChannel.slug) {
              joinedUser = data.added_members[0];
            }
            if (joinedUser && author.id === joinedUser.id) {
              newBody = (
                <>
                  {joinedUser && joinedUser.id === userId ? <b>{dictionary.you}</b> : joinedUser ? <b>{joinedUser.name}</b> : null} {dictionary.joined} <b>#{selectedChannel.title}</b>
                </>
              );
            } else {
              newBody = (
                <>
                  {userId === data.author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>} {dictionary.added} {joinedUser && joinedUser.id === userId ? <b>{dictionary.you}</b> : joinedUser ? <b>{joinedUser.name}</b> : null}
                </>
              );
            }
          } else if (data.removed_members.length === 1 && data.added_members.length === 0 && data.added_teams.length === 0 && data.removed_teams.length === 0) {
            const removedUser = Object.values(users).find((u) => u.id === data.removed_members[0]);
            if (removedUser && author.id === removedUser.id) {
              newBody = (
                <>
                  {removedUser && removedUser.id === userId ? <b>{dictionary.you}</b> : removedUser ? <b>{removedUser.name}</b> : null} {selectedChannel.type === "TOPIC" ? dictionary.leftTheWorkspace : dictionary.leftTheChat}
                </>
              );
            } else {
              newBody = (
                <>
                  {userId === data.author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>} {dictionary.removed} {removedUser && removedUser.id === userId ? <b>{dictionary.you}</b> : removedUser ? <b>{removedUser.name}</b> : null}
                </>
              );
            }
          } else {
            newBody = <>{userId === data.author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>}</>;
            if (data.added_teams && data.added_teams.length) {
              let at = Object.values(teams).filter((t) => data.added_teams.includes(t.id));
              newBody = (
                <>
                  {newBody} {dictionary.added}{" "}
                  <b>
                    {at
                      .map((t) => {
                        return `${dictionary.team}${" "}${t.name}`;
                      })
                      .join(", ")}
                  </b>
                </>
              );
            }
            if (data.added_members.length) {
              let am = Object.values(users).filter((u) => data.added_members.includes(u.id));
              if (selectedChannel.slug) {
                am = data.added_members;
              }
              newBody = (
                <>
                  {newBody} {data.added_teams && data.added_teams.length ? dictionary.andAdded : dictionary.added}{" "}
                  <b>
                    {am
                      .map((m) => {
                        if (m.id === userId) {
                          return dictionary.you;
                        } else return m.name;
                      })
                      .join(", ")}
                  </b>
                </>
              );
            }
            if (data.removed_teams && data.removed_teams.length) {
              let rt = Object.values(teams).filter((t) => data.removed_teams.includes(t.id));
              newBody = (
                <>
                  {newBody} {data.added_teams.length || data.added_members.length ? dictionary.andRemoved : dictionary.removed}{" "}
                  <b>
                    {rt
                      .map((t) => {
                        return `${dictionary.team}${" "}${t.name}`;
                      })
                      .join(", ")}
                  </b>
                </>
              );
            }
            if (data.removed_members.length) {
              let rm = Object.values(users).filter((u) => data.removed_members.includes(u.id));
              newBody = (
                <>
                  {newBody} {data.added_teams.length || data.added_members.length || data.removed_teams.length ? dictionary.andRemoved : dictionary.removed}{" "}
                  <b>
                    {rm
                      .map((m) => {
                        if (m.id === userId) {
                          return dictionary.you;
                        } else return m.name;
                      })
                      .join(", ")}
                  </b>
                </>
              );
            }
          }
        }
      }
    } else if (!data.hasOwnProperty("added_teams")) {
      // previous system message
      if (titleChanged) {
        newBody = (
          <>
            <SvgIconFeather width={16} icon="edit-3" /> {author.name} {selectedChannel.type === "TOPIC" ? dictionary.renameThisWorkspace : dictionary.renameThisChat} <b>#{data.title}</b>
            <br />
          </>
        );
        if (data.added_members.length || data.removed_members.length) {
          //has change on members
          if (data.added_members.length) {
            let am = Object.values(users).filter((u) => data.added_members.includes(u.id));
            if (selectedChannel.slug) {
              am = data.added_members;
            }
            newBody = (
              <>
                {newBody} {dictionary.andAdded}{" "}
                <b>
                  {am
                    .map((m) => {
                      if (m.id === userId) {
                        return dictionary.you;
                      } else return m.name;
                    })
                    .join(", ")}
                </b>
              </>
            );
          }
          if (data.removed_members.length) {
            let rm = Object.values(users).filter((u) => data.removed_members.includes(u.id));
            newBody = (
              <>
                {newBody} {dictionary.andRemoved}{" "}
                <b>
                  {rm
                    .map((m) => {
                      if (m.id === userId) {
                        return dictionary.you;
                      } else return m.name;
                    })
                    .join(", ")}
                </b>
              </>
            );
          }
        }
      } else {
        //title has not change
        if (data.added_members.length === 0 && data.removed_members.length === 0) {
          // no changes on member
          newBody = (
            <>
              {userId === data.author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>} updated <b>#{selectedChannel.title}</b>
            </>
          );
        } else if (data.added_members.length || data.removed_members.length) {
          //has change on members
          if (data.added_members.length === 1 && data.removed_members.length === 0) {
            let joinedUser = Object.values(users).find((u) => u.id === data.added_members[0]);
            if (selectedChannel.slug) {
              joinedUser = data.added_members[0];
            }
            if (joinedUser && author.id === joinedUser.id) {
              newBody = (
                <>
                  {joinedUser && joinedUser.id === userId ? <b>{dictionary.you}</b> : joinedUser ? <b>{joinedUser.name}</b> : null} {dictionary.joined} <b>#{selectedChannel.title}</b>
                </>
              );
            } else {
              newBody = (
                <>
                  {userId === data.author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>} {dictionary.added} {joinedUser && joinedUser.id === userId ? <b>{dictionary.you}</b> : joinedUser ? <b>{joinedUser.name}</b> : null}
                </>
              );
            }
          } else if (data.removed_members.length === 1 && data.added_members.length === 0) {
            const removedUser = Object.values(users).find((u) => u.id === data.removed_members[0]);
            if (removedUser && author.id === removedUser.id) {
              newBody = (
                <>
                  {removedUser && removedUser.id === userId ? <b>{dictionary.you}</b> : removedUser ? <b>{removedUser.name}</b> : null} {selectedChannel.type === "TOPIC" ? dictionary.leftTheWorkspace : dictionary.leftTheChat}
                </>
              );
            } else {
              newBody = (
                <>
                  {userId === data.author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>} {dictionary.removed} {removedUser && removedUser.id === userId ? <b>{dictionary.you}</b> : removedUser ? <b>{removedUser.name}</b> : null}
                </>
              );
            }
          } else if (data.added_members.length) {
            newBody = <>{userId === data.author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>}</>;
            let am = Object.values(users).filter((u) => data.added_members.includes(u.id));
            let removeBody = null;
            if (data.removed_members.length) {
              let rm = Object.values(users).filter((u) => data.removed_members.includes(u.id));
              removeBody = (
                <>
                  {data.added_members.length ? dictionary.andRemoved : dictionary.removed}{" "}
                  <b>
                    {rm
                      .map((m) => {
                        if (m.id === userId) {
                          return dictionary.you;
                        } else return m.name;
                      })
                      .join(", ")}
                  </b>
                </>
              );
            }
            newBody = (
              <>
                {newBody} {dictionary.added}{" "}
                <b>
                  {am
                    .map((m) => {
                      if (m.id === userId) {
                        return dictionary.you;
                      } else return m.name;
                    })
                    .join(", ")}
                </b>
                {removeBody}
              </>
            );
          } else if (data.removed_members.length) {
            let rm = Object.values(users).filter((u) => data.removed_members.includes(u.id));
            newBody = (
              <>
                {newBody} {data.added_members.length ? dictionary.andRemoved : dictionary.removed}{" "}
                <b>
                  {rm
                    .map((m) => {
                      if (m.id === userId) {
                        return dictionary.you;
                      } else return m.name;
                    })
                    .join(", ")}
                </b>
              </>
            );
          }
        }
      }
    }
  }
  return newBody;
};

export default useChannelUpdateMessage;
