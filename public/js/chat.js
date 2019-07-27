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

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message: message // same as just "message"
    })
    $messages.insertAdjacentHTML('beforeend',html)

})
socket.on('locationMessage', (url)=>{
    console.log(url)
    const html = Mustache.render(locationMessageTemplate,{
        url:url
    })
    $messages.insertAdjacentHTML('beforeend',html)
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