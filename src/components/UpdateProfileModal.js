import React from "react";
import { connect } from 'react-redux';
import { updateUser } from '../actions/updateUser'

class UpdateProfileModal extends React.Component {

    state = {
        username: this.props.user.username,
        startWorkTime: this.props.user.start_work_time,
        minNumHours: this.props.user.min_num_hours,
        maxNumHours: this.props.user.max_num_hours
    }

    handleChange = (event) => {
        let {name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.props.updateUser(event, this.props.user)
        this.props.handleUpdateSubmit()
    }

    render() {
        return (
            <div className="modal">
                <button className="buttons" id="back-button" name="showUpdateProfile" onClick={this.props.handleClick}>Go Back</button>
                <div>
                    <h2 className="form-headers">Update Your Profile</h2>
                    <form onSubmit={(event) => this.handleSubmit(event)}>
                        <h4 className="form-labels">User Name</h4>
                        <input type="text" name="username" value={this.state.username} className="input-fields" onChange={this.handleChange}/>
                        <br/>
                        <h4 className="form-labels">At what time do you like to begin work? </h4>
                        <input type="time" name="startWorkTime" value={this.state.startWorkTime} className="input-fields" onChange={this.handleChange}/>
                        <br/>
                        <h4 className="form-labels">What is the minimum number of hours you need to work per day? </h4>
                        <input type="number" name="minNumHours" value={this.state.minNumHours} className="input-fields" onChange={this.handleChange}/>
                        <br/>
                        <h4 className="form-labels">And what's the maximum number of hours you like to work? </h4>
                        <input type="number" name="maxNumHours" value={this.state.maxNumHours} className="input-fields" onChange={this.handleChange}/>
                        <br/>
                        <input className="buttons" type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
      user: state.user,
      userTasks: state.userTasks
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
        updateUser: (event, user) => dispatch(updateUser(event, user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileModal);