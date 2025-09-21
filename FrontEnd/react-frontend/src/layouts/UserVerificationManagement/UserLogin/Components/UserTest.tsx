import React from 'react'

const UserTest = () => {
   

    // Get username from session storage
    const username = sessionStorage.getItem('username')
    // Id from session storage
    const id = sessionStorage.getItem('id')
     
    const user = sessionStorage.getItem('user')

    return (
        // Print username
        <div>
            <h1>Here log username: {username}</h1>
            <h3>Print user {user}</h3>
            <h3>Print user id {id}</h3>
            </div>
        
    )
}

export default UserTest