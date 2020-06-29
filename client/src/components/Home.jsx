import React, { Component } from "react";
import axios from "axios";
import User from "./User";

class Home extends Component {
  constructor(props) {
    super();
    this.state = {
      users: [],
    };
  }

  async componentDidMount() {
    try {
      const users = await axios.get("/api/users");
      const result = users.data;
      let usersToDisplay = result;
      const loggedInUser = this.props.loggedIn;

      if (loggedInUser.user) {
        usersToDisplay = result.filter((r) => r._id !== loggedInUser.user._id);
      }
      this.setState({ users: usersToDisplay });
    } catch (err) {
      this.setState({ error: "Unable to fetch users Currently!!" });
    }
  }

  render() {
    //console.log(this.state.users);
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
