import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSchedule } from '../actions/addSchedule'
import { addTaskToSIP } from '../actions/addTaskToSIP';
import { addTaskToPostedSchedule } from '../actions/addTaskToPostedSchedule';
import { finaliseScheduleTasks } from '../actions/finaliseScheduleTasks';
import { finaliseScheduleActivities } from '../actions/finaliseScheduleActivities';
 
class CreateSchedule extends Component {

  state = {
    taskDescription: '',
    taskNotes: '',
    relaxationCategory1: '',
    relaxationCategory2: '',
    readyToPostTasks: false
  };

  componentDidMount() {
    if (this.props.relaxationCategories.length>0 && this.state.relaxationCategory1 === '' && this.state.relaxationCategory2 === '') {
      this.setState({
        relaxationCategory1: this.props.relaxationCategories[0].category_name,
        relaxationCategory2: this.props.relaxationCategories[0].category_name
      })
    }
  }

  componentDidUpdate() {
    if (this.props.postedSchedule.tasks.length === this.props.scheduleInProgress.length && this.props.scheduleInProgress.length > 0) {
      if (this.state.readyToPostTasks === true) {
        this.handleFinaliseScheduleTasks()
        this.handleFinaliseScheduleActivities()
      }
    }
  }
 
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
 
  handleSubmit = event => {
    event.preventDefault();
    let task = {
      task_description: event.target.taskDescription.value,
      task_notes: event.target.taskNotes.value,
      user_id: this.props.user.id,
    }
    this.props.addTaskToSIP(task)
    this.setState({
      taskDescription: '',
      taskNotes: ''
    })
  };

  handleCreateSchedule = () => {
    this.props.addSchedule(this.props.user.id, this.props.token)
    setTimeout(this.props.scheduleInProgress.forEach ((task) => { 
      this.props.addTaskToPostedSchedule(task)}), 2000 )
    this.setState({
      readyToPostTasks: true
    })
  }

  handleFinaliseScheduleTasks = () => {this.props.postedSchedule.tasks.forEach ((task) => { 
    this.setState({
      readyToPostTasks: false
    })
    this.props.finaliseScheduleTasks(task.id)})}

  handleFinaliseScheduleActivities = () => {
    let relaxationCategory1Id = this.props.relaxationCategories.filter(category => category.category_name === this.state.relaxationCategory1)[0].id
    let relaxationCategory2Id = this.props.relaxationCategories.filter(category => category.category_name === this.state.relaxationCategory2)[0].id
    this.props.finaliseScheduleActivities(relaxationCategory1Id)
    this.props.finaliseScheduleActivities(relaxationCategory2Id)
  }

  render() {
    return (
        <div className="form-containers">
            <h1 className="form-headers">Create Today's Schedule</h1>
            <h2 className="form-headers">Select 2 Relaxation Categories</h2>
            <select name="relaxationCategory1" onChange={this.handleChange}>{this.props.relaxationCategories.map(relaxationCategory => <option key={relaxationCategory.id}>{relaxationCategory.category_name}</option>)}</select>
            <select name="relaxationCategory2" onChange={this.handleChange}>{this.props.relaxationCategories.map(relaxationCategory => <option key={relaxationCategory.id}>{relaxationCategory.category_name}</option>)}</select><br></br>
            { this.props.scheduleInProgress.length < 10 ?
              <div>
                <h2 className="form-headers">Add Up to 10 Tasks</h2>
                <form onSubmit={this.handleSubmit}>
                    <h4 className="form-labels">Task Description</h4>
                    <input name="taskDescription" onChange={this.handleChange} value={this.state.taskDescription}/>
                    <h4 className="form-labels">Task Notes</h4>
                    <input name="taskNotes" onChange={this.handleChange} value={this.state.taskNotes}/><br></br>
                  <input  className="buttons" type="submit" value="Add Task"/>
                </form>
              </div>
            :
              null
            }
            <br></br>
            <button onClick={this.handleCreateSchedule}>Create Schedule</button>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    currentSchedule: state.currentSchedule,
    scheduleInProgress: state.scheduleInProgress,
    postedSchedule: state.postedSchedule,
    relaxationCategories: state.relaxationCategories,
    token: state.token
  }
}
 
const mapDispatchToProps = dispatch => {
  return {
    addSchedule: (schedule, token) => dispatch(addSchedule(schedule, token)),
    addTaskToSIP: (task) => dispatch(addTaskToSIP(task)),
    addTaskToPostedSchedule: (task) => dispatch(addTaskToPostedSchedule(task)),
    finaliseScheduleTasks: (taskId) => dispatch(finaliseScheduleTasks(taskId)),
    finaliseScheduleActivities: (activityId) => dispatch(finaliseScheduleActivities(activityId)),
  };
};
 
export default connect(mapStateToProps, mapDispatchToProps)(CreateSchedule);