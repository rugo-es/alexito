/* eslint-disable no-undef */
let socket
(function () {
  if (!userId) { return }
  socket = io()
  socket.emit('register', userId)
  socket.on('private_message', (newMessage) => {
    const audio = new Audio('sound/notification.mp3')
    audio.play()
    if (document.location.pathname === '/chat') {
      manageChat(newMessage)
    } else {
      messageReceived()
    }
  })
  socket.on('unread_messages', () => {
    messageReceived()
  })
})()

function messageReceived () {
  $('#unreadMessagesAvatar').removeClass('d-none')
  $('#unreadMessagesNavLink').removeClass('d-none')
}

function manageChat (newMessage) {
  const { from, message } = newMessage
  const existsContact = contacts.find(contact => contact._id === from)

  if (!existsContact) {
    const settings = {
      url: `api/account/${from}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    $.ajax(settings)
      .done(function (response) {
        const contact = {
          ...response,
          unreadMessages: true,
          lastMessage: ''
        }
        if (!contacts.length) {
          $('#chat-container-no-chats').hide()
          $('#chat-container').show()
        }
        contacts.unshift(contact)
        loadContact(contact)
        messages.push(newMessage)
        moveContactToFirstPosition(from, message, from)
        messageReceived()
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus)
      })
  } else {
    if (from === destiny) {
      newMessage.readed = true
      markMessagesAsRead(from, userId)
      const contactChat = contacts.find((contact) => contact._id.toString() === newMessage.from)
      timeData = { date: newMessage.datetime.substr(0, 10), hour: newMessage.datetime.substr(11, 5) }
      loadMessage(false, contactChat, newMessage.message, timeData)
    } else {
      messageReceived()
    }
    messages.push(newMessage)
    moveContactToFirstPosition(from, message, from)
  }
}
