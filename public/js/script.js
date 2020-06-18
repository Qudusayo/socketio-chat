function getDate() {
    var date = new Date();
    var hour = date.getHours()
    var min = date.getMinutes()
    min.toString().length === 1 ? min = `0${min}` : min = min
    return hour > 12 ? `${hour - 12}:${min} PM` : `${hour}:${min} AM`;
}

const el = (val) => document.querySelector(val)
const usrName = sessionStorage.getItem('sockety-username')
let img;

function verify() {
    if (!usrName) {
        window.location = window.location.origin
    }
}

verify()

$(function () {
    $('textarea').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:scroll;');
    }).on('input', function () {
        this.style.height = '35px';
        this.style.height = (this.scrollHeight) + 'px';
    });

    const chat = io.connect(window.location.href);
    $('form').submit(function (e) {
        verify()
        e.preventDefault()
        if (img) {
            if (!($('#m').val() === "")) {
                console.log('true')
                chat.emit('great message', usrName, img, $('#m').val());
                document.querySelector('.fa-check').className = 'fa fa-image';
                img = '';
                $('#m').val('');
                $('#imagefile').val('');
            } else {
                chat.emit('user image', usrName, img);
                document.querySelector('.fa-check').className = 'fa fa-image';
                img = '';
                $('#m').val('');
                $('#imagefile').val('');
            }
        } else if (!($('#m').val() === "")) {
            chat.emit('chat message', usrName, $('#m').val());
            $('#m').val('');
        }
        el('textarea').style.height = '35px';
        return false;
    });

    chat.on('chat message', function (user, msg) {
        if (user == usrName) {
            $('#messages').append($('<li class="mine">').append($('<small>').text('Me')).append($('<pre>').text(msg)).append($('<small class="time">').text(getDate())))
        } else {
            $('#messages').append($('<li>').append($('<small>').text(user)).append($('<pre>').text(msg)).append($('<small class="time">').text(getDate())))
        }
        window.scrollTo(0, document.body.scrollHeight);
    });

    chat.on('great message', function (user, pic, msg) {
        if (user == usrName) {
            $('#messages').append($('<li class="mine">').append($('<small>').text('Me')).append($(`<p><img src="${pic}"/></p>`)).append($('<pre>').text(msg)).append($('<small class="time">').text(getDate())))
        } else {
            $('#messages').append($('<li>').append($('<small>').text(user)).append($(`<p><img src="${pic}"/></p>`)).append($('<pre>').text(msg)).append($('<small class="time">').text(getDate())))
        }
        window.scrollTo(0, document.body.scrollHeight);
    });

    chat.on('joined', function (data) {
        if (data == usrName) {
            $('#messages').append($('<small class="mine">').text('Welcome ' + data));
        } else {
            $('#messages').append($('<small class="mine">').text(data + ' Joined'));
        }
        window.scrollTo(0, document.body.scrollHeight);
    });

    chat.emit('join', `${usrName}`);
    chat.on('users', function (data) {
        if (data === 1) {
            $('#users').html(`${data} user online`);
        } else {
            $('#users').html(`${data} users online`);
        }
    });

    chat.on('left', function (data) {
        $('#messages').append($('<small class="mine">').text(data));
        window.scrollTo(0, document.body.scrollHeight);
    });

    chat.on('user image', function image(user, base64Image) {
        if (user == usrName) {
            el('#messages').innerHTML += `<li class="mine"><small>Me</small><p><img src="${base64Image}"/></p><small class="time">${getDate()}</small></li>`;
        } else {
            el('#messages').innerHTML += `<li><small>${user}</small><p><img src="${base64Image}"/></p><small class="time">${getDate()}</small</li>`;
        }
        window.scrollTo(0, document.body.scrollHeight);
    });

    $('#imagefile').bind('change', function (e) {
        verify()
        var data = e.originalEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            // chat.emit('user image', usrName, evt.target.result);
            img = evt.target.result;
            document.querySelector('.fa-image').className = 'fa fa-check';
        };
        reader.readAsDataURL(data);
    });
});

el('.label').addEventListener('click', () => {
    if (el('input').checked) {
        el('body').className = ''
    } else {
        el('body').className = 'dark'
    }
});