/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const contacts = [
  { id: 1, name: 'Rugo', avatar: '/img/placeholder.jpg', lastMessage: '1Y aqui en otros datos hay que poner los mismo' },
  { id: 2, name: 'Patry', avatar: '/img/placeholder.jpg', lastMessage: 'OK' },
  { id: 3, name: 'Lil Izan', avatar: '/img/placeholder.jpg', lastMessage: 'Nos vemos' },
  { id: 4, name: 'Brother', avatar: '/img/placeholder.jpg', lastMessage: 'Comeme un pie' },
  { id: 5, name: 'Maria de la O Que desgracita', avatar: '/img/placeholder.jpg', lastMessage: '1Y aqui en otros datos hay que poner los mismo' },
  { id: 6, name: 'Carlos Sobera', avatar: '/img/placeholder.jpg', lastMessage: '1Y aqui en otros datos hay que poner los mismo' },
  { id: 7, name: 'First Dates', avatar: '/img/placeholder.jpg', lastMessage: '1Y aqui en otros datos hay que poner los mismo' },
  { id: 8, name: 'VOX Line Erny', avatar: '/img/placeholder.jpg', lastMessage: '1Y aqui en otros datos hay que poner los mismo' },
  { id: 9, name: 'El jincho', avatar: '/img/placeholder.jpg', lastMessage: '1Y aqui en otros datos hay que poner los mismo' },
  { id: 10, name: 'Contacto Ruso', avatar: '/img/placeholder.jpg', lastMessage: '1Y aqui en otros datos hay que poner los mismo' },
  { id: 11, name: 'Policia nacional', avatar: '/img/placeholder.jpg', lastMessage: '1Y aqui en otros datos hay que poner los mismo' },
  { id: 12, name: 'Restaurante El CID', avatar: '/img/placeholder.jpg', lastMessage: '1Y aqui en otros datos hay que poner los mismo' },
  { id: 13, name: 'Empresa Spam', avatar: '/img/placeholder.jpg', lastMessage: '1Y aqui en otros datos hay que poner los mismo' }
]

const messages = [
  { from: 1, to: 20, text: 'Hola Ususario que tal?', datetime: '13:30', readed: true },
  { from: 20, to: 1, text: 'Pues genial oye y tu como andas?', datetime: '13:30', readed: true },
  { from: 1, to: 20, text: 'pues aqui andamos, dandole al huerto', datetime: '13:30', readed: true },
  { from: 1, to: 20, text: 'Parece que va a llover', datetime: '13:30', readed: true },
  { from: 20, to: 1, text: 'Pues pa casa', datetime: '13:30', readed: true },
  { from: 20, to: 2, text: 'Hola PAtri, tienes algo nuevo para mi, ya sabes, algun tipo de informacion valiosa que pueda utilizar para rastrear algun tesoro???', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Te echo de menos', datetime: '13:40', readed: true },
  { from: 2, to: 20, text: 'DEjeme en paz, señor, por favor', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
  { from: 20, to: 2, text: 'Desde luego, Chao', datetime: '13:40', readed: true },
]

$(document).ready(function () {
  loadContacts()
  $('#search-contact').on('keyup', function () {
    const filterContacts = contacts.filter((contact) => contact.name.toLowerCase().includes($(this).val().toLowerCase()))
    loadContacts(filterContacts)
  })
})

function loadContacts (showContacts = contacts) {
  $('#chat-contacts__container').empty()
  for (contact of showContacts) {
    $('#chat-contacts__container').append(`
    <button type="button" id="${contact.id}" class="btn-contact list-group-item list-group-item-action py-3" aria-current="true">
      <div class="d-flex">
        <img src="${contact.avatar}" class="rounded-circle border border-2 avatar-sm" alt="" />
        <div class="ps-3 contact-info">
          <strong class="d-block text-ellipsis">${contact.name}</strong>
          <small class="d-block text-ellipsis text-small">${contact.lastMessage}</small>
        </div>
      </div>
    </button>
  `)
  }
  $('.btn-contact').on('click', function () {
    loadMessages($(this)[0].id)
  })
}

function loadMessages (contactId) {
  const showMessages = messages.filter((message) => message.from.toString() === contactId || message.to.toString() === contactId)
  const contactChat = contacts.find((contact) => contact.id.toString() === contactId)
  loadContactInfo(contactChat, showMessages.length)
  $('#chat-messages__content').empty()
  for (message of showMessages) {
    const fromMe = message.from.toString() !== contactId
    $('#chat-messages__content').append(`
    <div class="chat-messages__message d-flex mb-3 ${fromMe ? '' : 'justify-content-end ms-auto'}">
      ${fromMe ? '<img src="https://res.cloudinary.com/dlai7340l/image/upload/c_fill,g_center,h_500,w_500/rdetoalry3gr9ylxugvx?_a=BAMAGSZU0" class="rounded-circle border border-2 avatar-sm" alt="" />' : ''}
      <div class="${fromMe ? 'ps' : 'pe'}-3">
        <p class="m-0 p-2 ${fromMe ? 'bg-primary' : 'bg-success'} rounded">${message.text}</p>
        <small class="d-block text-small ${fromMe ? '' : 'text-end'}">13:30</small>
      </div>
      ${fromMe ? '' : '<img src="/img/placeholder.jpg" class="rounded-circle border border-2 avatar-sm" alt="" />'}
    </div>
  `)
  }
  $('#chat-messages').removeClass('d-none').addClass('d-flex flex-column')
  if (window.innerWidth < 992) {
    $('#chat-contacts').addClass('d-none')
  } else {
    console.log('pantalla grande')
  }
}

function loadContactInfo (contact, messagesCount) {
  $('#contact-avatar').attr('src', contact.avatar)
  $('#contact-name').text(contact.name)
  $('#contact-subtext').text(`${messagesCount} mensajes`)
  $('#send-message-input').val('')
}

function showContacts () {
  $('#chat-messages').removeClass('d-flex flex-column').addClass('d-none')
  $('#chat-contacts').removeClass('d-none')
}
