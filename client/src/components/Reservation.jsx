import React, { Component } from "react";
import _ from "lodash";
import axios from "axios";
import "./styles/Reservation.css";

class Reservation extends Component {
  constructor() {
    super();
    this.state = {
      appointment: {
        name: "Anonymous",
        email: "",
        appointment_date: "",
        appointment_time: "",
      },
      errors: {},
    };
  }
  componentDidMount() {
    console.log(this.props.match.params.username);
  }
  validate = () => {
    const errors = {};

    const { appointment } = this.state;
    if (appointment.name.trim() === "") errors.name = "Name is required";
    if (appointment.email.trim() === "") errors.email = "Email is required";
    if (appointment.appointment_date === "")
      errors.appointment_date = "Date is required";
    if (appointment.appointment_time === "")
      errors.appointment_time = "Please select a Time slot";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const { appointment } = this.state;

    const post_body = {
      email: appointment.email,
      name: appointment.name,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
    };

    try {
      const response = await axios.post(
        `/api/appointments/${this.props.match.params.username}`,
        post_body
      );
      console.log(response);
      //localStorage.setItem("auth_token", response.headers["x-auth-token"]);
      this.props.history.push("/");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = err.response.data;
        this.setState({ errors });
      }
      console.log(err);
    }
    //console.log("submitted");
  };

  handleChange = (e) => {
    const { appointment } = this.state;
    appointment[e.target.name] = e.target.value;
    this.setState({ appointment });
  };

  render() {
    const {
      email,
      name,
      appointment_date,
      appointment_time,
    } = this.state.appointment;
    const { errors } = this.state;

    return (
      <div>
        <h1>{`Reservation @${this.props.match.params.username}`}</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              autoFocus
              value={name}
              onChange={this.handleChange}
              name="name"
              id="name"
              type="text"
              className="form-control"
            />
            {errors.name && (
              <div className="alert alert-danger">{errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              autoFocus
              value={email}
              onChange={this.handleChange}
              name="email"
              id="email"
              type="email"
              className="form-control"
            />
            {errors.email && (
              <div className="alert alert-danger">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="appointment_date">appointment_date</label>
            <input
              value={appointment_date}
              onChange={this.handleChange}
              name="appointment_date"
              id="appointment_date"
              type="date"
              className="form-control"
              min={new Date()}
            />
            {errors.appointment_date && (
              <div className="alert alert-danger">
                {errors.appointment_date}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="appointment_time">Time Slot</label>
            <div className="timeslots">
              {_.range(0, 24).map((ele) => {
                return (
                  <label className="timeslot">
                    <input
                      type="radio"
                      name="options"
                      id={ele}
                      autocomplete="off"
                      value={}
                      className="slot-radiobutton"
                    />
                    {` ${ele}:00 hrs `}
                  </label>
                );
              })}
            </div>

            <div className="form-group">
              {errors.appointment_time && (
                <div className="alert alert-danger">
                  {errors.appointment_time}
                </div>
              )}
            </div>
          </div>

          <button disabled={this.validate()} className="btn btn-primary">
            Confirm
          </button>
        </form>
      </div>
    );
  }
}

export default Reservation;
