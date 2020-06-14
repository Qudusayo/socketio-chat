$(function () {
    const chat = io.connect(window.location.href);
    $('form').submit(function () {
        if (!($('#m').val() === "")) {
            chat.emit('chat message', sessionStorage.getItem('sockety-username'), $('#m').val());
            $('#m').val('');
            
        }
        return false;
    });
    chat.on('chat message', function (user, msg) {
        // $('#messages').append($('<li>').text(msg));
        
        if (user == sessionStorage.getItem('sockety-username')) {
            document.querySelector('#messages').innerHTML += `<li class="mine"><small>Me</small><pre>${msg}</pre><small class="time">${Date().split(" ")[4].split(":").slice(0,2).join(':')}</small></li>`;
        } else {
            document.querySelector('#messages').innerHTML += `<li><small>${user}</small><pre>${msg}</pre><small class="time">${Date().split(" ")[4].split(":").slice(0,2).join(':')}</small</li>`;
        }
        window.scrollTo(0, document.body.scrollHeight);
    });
    chat.on('joined', function (data) {
        if (data == sessionStorage.getItem('sockety-username')) {
            $('#messages').append($('<small class="mine">').text('Welcome ' + data));
        } else {
            $('#messages').append($('<small class="mine">').text(data + ' Joined'));
        }
        window.scrollTo(0, document.body.scrollHeight);
    });
    chat.emit('join', `${sessionStorage.getItem('sockety-username')}`);
    chat.on('users', function (data) {
        if (data === 1) {
            $('#users').html(`${data} user left`);
        } else {
            $('#users').html(`${data} users left`);
        }
    });
    chat.on('left', function (data) {
        $('#messages').append($('<small class="mine">').text(data));
        window.scrollTo(0, document.body.scrollHeight);
    });
});

document.querySelector('.label').addEventListener('click', () => {
    if (document.querySelector('input').checked) {
        document.body.className = ''
    } else {
        document.body.className = 'dark'
    }
});