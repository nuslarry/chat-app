const users=[]
// addUser, removeUSer, getUser, getUsersInRoom

const addUser = ({ id, username, room})=>{
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if (!username || !room){
        console.log("@@")
         return{
             error : 'Username and room are required!'
         }
    }
    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room ===room && user.username===username
    })

    
    //validating user
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user= {id, username, room}
    users.push(user)
    return {user}
}
const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    console.log(index)
    if (index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{
    return users.find((user)=>user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user)=>user.room===room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// addUser({
//     id: 22,
//     username: 'Tina',
//     room: 'UCI'
// })
// addUser({
//     id: 24,
//     username: 'Larry',
//     room: 'UCI'
// })
// addUser({
//     id: 25,
//     username: 'XXX',
//     room: 'USC'
// })
//removeUser(25)
// console.log(users)
// const userList=getUsersInRoom('ucig')
// console.log(userList)

