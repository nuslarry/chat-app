socket=io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate  = document.querySelector('#sidebar-template').innerHTML
//Options
const { username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true}) //location.search is a global variable


const autoscroll = () => {
    //new message element
    const $newMessage=$messages.lastElementChild
    //height of the new message 
    const  newMessageStyles = getComputedStyle($newMessage) 
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of message container
    const containerHeight = $messages.scrollHeight
    // how far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight
    if(containerHeight-newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}


socket.on('message',(message)=>{
    console.log(message) 
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text, // same as just "message"
        createdAt: moment(message.createdAt).format('h:mm a') //moment library
    })
    $messages.insertAdjacentHTML('beforeend',html)  
    autoscroll()

})
socket.on('locationMessage', (message)=>{
    const html = Mustache.render(locationMessageTemplate,{
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll( )
})

socket.on('roomData',({ room, users})=>{
    const html= Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit',(e)=>{ //select by id,  e event(submit)
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    //disable
    //const message=document.querySelector('input').value //select by tag name
    const message= e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error)
        {
            return console.log('profanity is not allowed')
        }
        console.log('message delivered ')
        
    })
})
$sendLocationButton.addEventListener('click',()=>{ //select by id,  e event(submit)

    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        socket.emit('sendLocation', { 
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('location shared')
        })
    })
    
})

socket.emit('join',{username, room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})