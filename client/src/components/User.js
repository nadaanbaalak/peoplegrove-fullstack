import React from "react";
import "./styles/User.css";

const User = (props) => {
  const { name, timezone, username } = props.data;
  return (
    <div className="user">
      <p>{name}</p>
      <p>
        {`Timezone: `}
        {<small>{timezone}</small>}
      </p>
      <button
        onClick={() => {
          props.history.push(`/users/${username}`);
        }}
        className="btn btn-primary"
      >
        Make a Reservation
      </button>
    </div>
  );
};

export default User;
