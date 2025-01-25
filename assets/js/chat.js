/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let messages = []
let contacts = []
let $form, $input, $messagesContainer

$(document).ready(function () {
  getChats()
  $('#search-contact').on('keyup', function () {
    const filterContacts = contacts.filter((contact) => contact.username.toLowerCase().includes($(this).val().toLowerCase()))
    loadContacts(filterContacts)
  })

  $form = document.getElementById('form-message')
  $input = document.getElementById('send-message-input')
  $messagesContainer = document.getElementById('chat-messages__content')

  // Enviar mensaje
  $form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = $input.value
    if (message) {
      moveContactToFirstPosition(destiny, message, userId)
      const contactChat = contacts.find((contact) => contact._id.toString() === destiny)
      contactChat.lastMessage = message
      loadMessage(true, contactChat, message)
      socket.emit('private_message', { from: userId, to: destiny, message })
      $input.value = ''
    }
  })
})

function getChats () {
  const settings = {
    url: `api/chat/${userId}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }
  $.ajax(settings)
    .done(function (response) {
      loadChats(response)
      newChat()
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus)
    })
}

function loadChats (chats) {
  if (!chats.contacts.length && !chats.messages.lenght) {
    $('#chat-container').hide()
    $('#chat-container-no-chats').show()
  } else {
    messages = chats.messages
    contacts = chats.contacts
    loadContacts()
  }
}

function newChat () {
  const params = new URLSearchParams(window.location.search)
  const newChat = params.get('new')
  if (newChat) {
    const contactExists = contacts?.find(contact => contact._id === newChat)
    if (contactExists) {
      $(`#${newChat}`).click()
    } else {
      if (!contacts.length) {
        $('#chat-container-no-chats').hide()
        $('#chat-container').show()
      }
      const settings = {
        url: `api/account/${newChat}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
      $.ajax(settings)
        .done(function (response) {
          const contact = {
            _id: newChat,
            username: response.username,
            avatar: response.avatar,
            unreadMessages: 0,
            lastMessage: ''
          }
          contacts.unshift(contact)
          loadContacts()
          $(`#${newChat}`).click()
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus)
        })
    }
  }
}

function loadContacts (showContacts = contacts) {
  showContacts = showContacts.filter(contact => contact._id !== userId)
  showContacts.sort((a, b) => a.lastMessage.datetime > b.lastMessage.datetime ? -1 : a.lastMessage.datetime < b.lastMessage.datetime ? 1 : 0)
  $('#chat-contacts__container').empty()
  for (contact of showContacts) {
    loadContact(contact)
  }
}

function loadContact (contact) {
  $('#chat-contacts__container').append(`
    <button type="button" id="${contact._id}" class="btn-contact list-group-item list-group-item-action py-3" aria-current="true" onclick="loadMessages('${contact._id}')">
      <div class="d-flex">
        <img src="${contact.avatar}" class="rounded-circle border border-2 avatar-sm" alt="" />
        <div class="ps-3 contact-info">
          <div class="d-flex gap-1 align-items-center">
            <strong class="d-block text-ellipsis">${contact.username}</strong>
            <span class="badge rounded-pill text-bg-success ${!contact.unreadMessages && 'd-none'}" style="font-size: 10px;">${contact.unreadMessages}</span>
          </div>
          <small class="d-block text-ellipsis text-small ${contact.unreadMessages && 'last-messages-unreaded'}">${contact.lastMessage.message !== undefined ? contact.lastMessage.message : ''}</small>
        </div>
      </div>
    </button>
  `)
}

function loadMessages (contactId) {
  $(`#chat-contacts__container button#${contactId} small`).removeClass('last-messages-unreaded')
  $(`#chat-contacts__container button#${contactId} .badge`).first().addClass('d-none')
  destiny = contactId
  const showMessages = messages.filter((message) =>
    (message.from.toString() === contactId && message.to.toString() === userId) ||
    (message.to.toString() === contactId && message.from.toString() === userId)
  )
  messages = messages.map(message => message.from === destiny ? { ...message, readed: true } : message)
  const existsUnreadMessages = messages.some(message => message.to === userId && message.readed === false)
  if (!existsUnreadMessages) {
    $('#unreadMessagesAvatar').addClass('d-none')
    $('#unreadMessagesNavLink').addClass('d-none')
  }
  const contactChat = contacts.find((contact) => contact._id.toString() === contactId)
  contactChat.unreadMessages = false
  loadContactInfo(contactChat)
  $('#chat-messages__content').empty()
  let timeData = { date: null, hour: null, timeLabel: null, printTimeLabel: false }
  for (item of showMessages) {
    const { from, message, datetime } = item
    const fromMe = from.toString() !== contactId
    timeData = getDateForChat(datetime, timeData)
    if (timeData.printTimeLabel) {
      $('#chat-messages__content').append(`
        <div class="mb-3 text-center">
          <span class="badge rounded-pill px-2 text-bg-light">${timeData.timeLabel}</span>
        </div>
      `)
    }
    loadMessage(fromMe, contactChat, message, timeData)
  }
  setTimeout(() => {
    markMessagesAsRead(contactChat._id, userId)
  }, 0)
  $('#chat-messages-empty').removeClass('d-lg-block')
  $('#chat-messages').removeClass('d-none').addClass('d-flex flex-column')
  if (window.innerWidth < 992) {
    $('#chat-contacts').addClass('d-none')
  }

  $messagesContainer.scrollTop = $messagesContainer.scrollHeight
  $input.focus()
}

function loadMessage (fromMe, contactChat, message, timeData = null) {
  if (!timeData) {
    timeData = { date: null, hour: null }
    const now = new Date()
    timeData.hour = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    timeData.date = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`
    const showMessages = messages.filter((message) =>
      (message.from.toString() === contactChat._id && message.to.toString() === userId) ||
      (message.to.toString() === contactChat._id && message.from.toString() === userId)
    )
    const isFirstMessage = !showMessages.length
    const lastMessageDate = !isFirstMessage ? getDate(showMessages.at(-1).datetime) : null
    if (isFirstMessage || lastMessageDate !== timeData.date) {
      const timeDateLabel = getDateLabelForChat(timeData.date)
      $('#chat-messages__content').append(`
        <div class="mb-3 text-center">
          <span class="badge rounded-pill px-2 text-bg-light">${timeDateLabel}</span>
        </div>
      `)
    }
    const datetime = getDateBBDDFormat(now)
    messages.push({
      _id: false,
      datetime,
      from: userId,
      to: contactChat._id,
      message,
      readed: false
    })
  }
  $('#chat-messages__content').append(`
    <div class="chat-messages__message d-flex mb-3 ${fromMe ? 'justify-content-end ms-auto' : ''}">
      ${fromMe ? '' : `<img src="${contactChat.avatar}" class="rounded-circle border border-2 avatar-sm" alt="" />`}
      <div class="${fromMe ? 'pe' : 'ps'}-3">
        <p class="m-0 p-2 ${fromMe ? 'bg-success' : 'bg-primary'} rounded">${message}</p>
        <small class="d-block text-small ${fromMe ? 'text-end' : ''}">${timeData.hour}</small>
      </div>
      ${fromMe ? `<img src="${userAvatar}" class="rounded-circle border border-2 avatar-sm" alt="" />` : ''}
    </div>
  `)
  $messagesContainer.scrollTop = $messagesContainer.scrollHeight
}

function getDateForChat (datetime, timeData) {
  const dateMessage = getDate(datetime)
  const hourMessage = getHour(datetime)
  const timeLabel = getDateLabelForChat(dateMessage)
  return {
    date: dateMessage,
    hour: hourMessage,
    timeLabel,
    printTimeLabel: timeData.timeLabel !== timeLabel
  }
}

function getDateLabelForChat (dateMessage) {
  const now = new Date()
  const currentDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`
  now.setDate(now.getDate() - 1)
  const yesterdayDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`
  return currentDate === dateMessage ? 'Hoy' : yesterdayDate === dateMessage ? 'Ayer' : dateMessage
}

function getDate (datetime) {
  const date = new Date(datetime)
  return `${String(date.getUTCDate()).padStart(2, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${date.getUTCFullYear()}`
}

function getHour (datetime) {
  const date = new Date(datetime)
  return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`
}

function getDateBBDDFormat (date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`
}

function loadContactInfo (contact) {
  $('#contact-avatar').attr('src', contact.avatar)
  $('#contact-name').text(contact.username)
  $('#send-message-input').val('')
}

function showContacts () {
  $('#chat-messages').removeClass('d-flex flex-column').addClass('d-none')
  $('#chat-contacts').removeClass('d-none')
}

function moveContactToFirstPosition (contactId, message, from) {
  const $contact = $(`#chat-contacts__container button#${contactId}`)
  $contact.remove()
  $('#chat-contacts__container').prepend($contact)
  $contactLastMessage = $(`#chat-contacts__container button#${contactId} small`)
  $contactLastMessage.first().text(message)
  if (contactId === from && destiny !== contactId) {
    const unreadMessages = messages.filter(message => message.to === userId && message.readed === false).length
    $unreadMessagesBadge = $(`#chat-contacts__container button#${contactId} .badge`).first()
    $unreadMessagesBadge.text(unreadMessages)
    $unreadMessagesBadge.removeClass('d-none')
    $contactLastMessage.addClass('last-messages-unreaded')
  }
}

function markMessagesAsRead (from, to) {
  const settings = {
    url: '/api/chat/markMessagesAsRead',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ from, to })
  }
  $.ajax(settings)
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus)
    })
}
