import React from 'react';
import { connect } from 'react-redux';
import { fetchSchedule } from '../actions/fetchSchedule'
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom'
import AlertModal from "./AlertModal";

class Schedule extends React.Component {

    state = {
        hour: new Date().getHours(),
        minutes: new Date().getMinutes(),
        seconds: new Date().getSeconds()
    };

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
        return this.props.currentSchedule.id !== "" ? this.props.fetchSchedule(this.props.currentSchedule.id) : null
    }

    componentDidUpdate() {
        return this.props.currentSchedule.id !== "" && this.props.currentSchedule.activities.length === 0 ? this.props.fetchSchedule(this.props.currentSchedule.id) : null
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    tick() {
      this.setState({
        hour: new Date().getHours(),
        minutes: new Date().getMinutes(),
        seconds: new Date().getSeconds()
      });
    }

    weekDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    newDate = new Date()
    day = this.weekDayNames[this.newDate.getDay()]
    date = this.newDate.getDate()
    month = this.monthNames[this.newDate.getMonth()]
    year = this.newDate.getFullYear()

    convertToHoursAndMinutes = (totalMinutes) => {
        let hours = Math.floor(totalMinutes/60)
        let minutes = totalMinutes%60
        return `${hours < 10 ? 0 : ""}${hours}:${minutes < 10 ? 0 : ""}${minutes}`
    }

    getTasks = () => {
        if (this.props.currentSchedule.activities.length > 0) {
            let startTime = (parseInt(this.props.user.start_work_time.slice(11, 13)) * 60) + parseInt(this.props.user.start_work_time.slice(14, 16))
            let tasks = this.props.currentSchedule.tasks
            let activities = this.props.currentSchedule.activities
            let schedule = []
            let timePeriod = ""
            for (let i = 0; i < tasks.length; i++) {
                let scheduleSlot = []
                scheduleSlot.push({task: startTime}, tasks[i])
                if (i % 2 === 0) {
                    startTime += 55
                } else {
                    startTime += 45
                }
                if (startTime >= 700 &&  startTime < 760) {
                    scheduleSlot.push({break: startTime}, {activity_description: "Enjoy a healthy, nutritious lunch"})
                    startTime += 45
                } else if (i === tasks.length - 1) {
                    if (startTime >= 720 && startTime < 1020) {
                        timePeriod = "afternoon"
                    } else if (startTime >= 1020) {
                        timePeriod = "evening"
                    }
                    else {
                        timePeriod = "morning"
                    }
                    scheduleSlot.push({break: startTime}, {activity_description: `Time to wind down and enjoy the rest of your ${timePeriod}`})
                } else if (i % 2 === 0) {
                    // Create array of short break instructions? e.g. get a coffee, etc.
                    scheduleSlot.push({break: startTime}, {activity_description: "Take a short break"})
                    startTime += 5
                } else {
                    scheduleSlot.push({break: startTime}, activities[0])
                    startTime += 15
                }
                schedule.push(scheduleSlot)
            }
            // update state with break times
            let completeSchedule = []
            return completeSchedule = schedule.map ((scheduleSlot) => {
                
                return (
                    <div>
                        <p key={uuidv4()} > {this.convertToHoursAndMinutes(scheduleSlot[0].task)}: {scheduleSlot[1].task_description}: {scheduleSlot[1].task_notes} </p>
                        <p key={uuidv4()} > {this.convertToHoursAndMinutes(scheduleSlot[2].break)}: {scheduleSlot[3].activity_description} </p>
                    </div>
                )
            })
        } else {
            return this.props.fetchSchedule(this.props.currentSchedule.id)
        }
    }
    
    render() {
        return (
            <div>
                <div className="schedule">
                    {
                        this.props.currentSchedule.id !== ""
                        ?
                            <div>
                                <h2 className="form-headers">Schedule for {this.day}, {this.month} {this.date}, {this.year}</h2>
                                {this.getTasks()}
                            </div>
                        :
                            <div>
                                <h2> You haven't created a schedule yet </h2>
                                <Link to='/createschedule' >
                                    <button>Create a Schedule</button>
                                </Link>
                            </div>
                    }
                </div>
                <div>
                    {/* {
                        this.state.minutes === 57
                        ? */}
                            {/* <AlertModal /> */}
                        {/* :
                        null
                    } */}
                </div>
            </div>
        );
    }
}
  
const mapStateToProps = state => {
    return {
        user: state.user,
        schedules: state.userSchedules,
        currentSchedule: state.currentSchedule,
    }
}

const mapDispatchToProps = dispatch => {
    return {
      fetchSchedule: (scheduleId) => dispatch(fetchSchedule(scheduleId))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);