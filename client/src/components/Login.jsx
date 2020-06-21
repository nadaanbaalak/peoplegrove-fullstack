import React, { Component } from "react";
import axios from "axios";

class LoginForm extends Component {
  state = {
    account: {
      userEmail: "",
      password: "",
    },
    errors: {},
  };

  validate = () => {
    const errors = {};

    const { account } = this.state;
    if (account.userEmail.trim() === "") errors.userEmail = "Email is required";
    if (account.password.trim() === "")
      errors.password = "Password is required";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const { account } = this.state;

    const post_body = {
      email: account.userEmail,
      password: account.password,
    };

    try {
      const { data } = await axios.post("/api/auth", post_body);
      localStorage.setItem("auth_token", data);
      window.location = "/";
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.message = err.response.data;
        this.setState({ errors });
      }
    }
  };

  handleChange = (e) => {
    const { account } = this.state;
    account[e.target.name] = e.target.value;
    this.setState({ account });
  };

  render() {
    const { userEmail, password } = this.state.account;
    const { errors } = this.state;
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              autoFocus
              value={userEmail}
              onChange={this.handleChange}
              name="userEmail"
              id="email"
              type="text"
              className="form-control"
            />
            {errors.userEmail && (
              <div className="alert alert-danger">{errors.userEmail}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={this.handleChange}
              name="password"
              id="password"
              type="password"
              className="form-control"
            />
            {errors.password && (
              <div className="alert alert-danger">{errors.password}</div>
            )}
          </div>
          {errors.message && (
            <div className="alert alert-danger">{errors.message}</div>
          )}
          <button disabled={this.validate()} className="btn btn-primary">
            Log In
          </button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
