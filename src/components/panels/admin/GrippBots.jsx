import React from "react";
import GrippBotCard from "./GrippBotCard";

const GrippBots = (props) => {
  const { bots } = props;
  return (
    <div className="row">
      {bots.length > 0 &&
        bots.map((bot) => {
          return <GrippBotCard key={bot.id} bot={bot} />;
        })}
    </div>
  );
};

export default GrippBots;
