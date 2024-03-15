function handleCreateUser() {
    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
    fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
        .then(response => {
            closeModal('registerModal');
            console.log('Response:', response);
            return response.json();
        })
}
function handleLoginUser() {
    const user = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };

    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    alert("Email or password is incorrect. Please try again.");
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.token) {
                sessionStorage.setItem('userToken', data.token);
                sessionStorage.setItem('userId', data.userId);
                alert("Login successful!");
                
                document.getElementById('dashboard').style.display = 'block';
                closeModal('loginModal');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
    }
}
