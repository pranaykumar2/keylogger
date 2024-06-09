document.addEventListener('DOMContentLoaded', function () {
    const keysPressed = [];

    document.addEventListener('keydown', (event) => {
        const keyName = event.key;
        const keyCode = event.keyCode;
        keysPressed.push({ keyName, keyCode, timestamp: new Date().toISOString() });
        console.log(`Key pressed: ${keyName} (code: ${keyCode})`);
    });

    document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', (e) => {
        e.target.nextElementSibling.classList.add('active');
    });
    input.addEventListener('blur', (e) => {
        if (e.target.value === '') {
            e.target.nextElementSibling.classList.remove('active');
        }
    });
    });
    

    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault(); 

        console.log('Form submitted');
        console.log('Keys pressed:', keysPressed);

        const formData = new FormData(event.target);
        formData.append('keysPressed', JSON.stringify(keysPressed));

        fetch('/login', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login successful');
            } else {
                alert('Login failed');
            }
        })
        .catch(error => console.error('Error:', error));
    });

});
