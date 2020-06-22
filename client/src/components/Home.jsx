import React, { Component } from "react";
import axios from "axios";
import User from "./User";

class Home extends Component {
  state = {
    users: [],
  };

  async componentDidMount() {
    try {
      const users = await axios.get("/api/users");
      this.setState({ users: users.data });
    } catch (err) {
      this.setState({ error: "Unable to fetch users Currently!!" });
    }
  }

  render() {
    console.log(this.state.users);
    return (
      <div>
        {this.state.users.length !== 0 &&
          this.state.users.map((user) => (
            <User key={user._id} data={user} {...this.props} />
          ))}
      </div>
    );
  }
}

export default Home;
/*

{}
*/
