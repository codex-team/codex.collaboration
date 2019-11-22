function greeter(person: string) {
    alert('QQQHello, ' + person);
}

let user = 'Jane User';
const btn = document.getElementById('test');

btn.onclick = (e) => greeter(user);