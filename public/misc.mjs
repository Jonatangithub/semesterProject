

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
            console.log('Response:', response);
            console.log("hwere")
            return response.json(); // assuming the response is JSON
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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.token) {
                // Store user information in session or local storage
                sessionStorage.setItem('userToken', data.token);
                // Optionally, you can store other user details like name, email, etc.

                // Call the function to update User Info Modal
                getUserInfoModal();

                // Show the dashboard section
                document.getElementById('dashboard').style.display = 'block';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function getUserInfoModal() {
    const userToken = sessionStorage.getItem('token');
    if (!userToken) {
        // User not logged in
        return;
    }

    fetch('/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${userToken}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(userData => {
            // Update User Info Modal content with userData
            const userInfoModalContent = document.getElementById('userInfoModal').getElementsByClassName('modal-content')[0];
            userInfoModalContent.innerHTML = `<p>User Name: ${userData.name}</p><p>Email: ${userData.email}</p>`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}