export const loginUser = (user) => {
    return (dispatch) => {
    dispatch({ type: 'LOADING_USER'})
    fetch('http://localhost:3000/login',{
    method:"POST",
    headers:{
       'Content-Type':'application/json'
    },
    body:JSON.stringify(user)
    })
    .then(response => response.json())
    .then(responseJSON => {
        if(!responseJSON.error){
            dispatch({ type: 'ADD_USER', user: responseJSON })
            // this.props.history.push('/')
            debugger
        } else {
            alert(responseJSON.error)
        }
    })
    .catch(err => console.log('App.js Login Error:', err))
    }
}