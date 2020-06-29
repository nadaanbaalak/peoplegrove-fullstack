import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      appointments: [],
    };
  }
  async componentDidMount() {
    //console.log(this.props.user.user);
    const resp = await axios.get(
      `/api/appointments/${this.props.user.user.username}`
    );
    this.setState({ appointments: resp.data });
    //console.log("this.state.appointments ", this.state.appointments);
  }
  render() {
    return (
      <div>
        {this.state.appointments.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              <h3> My Reservations</h3>
            </div>
            <table class="table">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Date</th>
                  <th scope="col">With</th>
                </tr>
              </thead>
              <tbody>
                {this.state.appointments.map((appointment) => (
                  <tr>
                    <td>{`${appointment.appointment_time}:00 hrs`}</td>
                    <td>
                      {moment(appointment.appointment_date).format(
                        "DD-MM-YYYY"
                      )}
                    </td>
                    <td>{appointment.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }
}

export default Profile;
