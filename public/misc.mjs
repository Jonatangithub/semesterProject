function handleCreateUser() {
    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
    fetch('/user/register', {
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
function handleEditUser() {
    const user = {
        id: sessionStorage.getItem('userId'),
        name: document.getElementById("editName").value,
        email: document.getElementById("editEmail").value,
        password: document.getElementById("editPassword").value
    };
    const userId = sessionStorage.getItem('userId');

    fetch(`/user/edit/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("User information updated successfully.");
            closeModal('editUserModal');
        } else {
            alert("Failed to update user information.");
        }
    })
    .catch(error => console.error('Error:', error));
}
function deleteAccount() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert('User not logged in or user ID not found.');
        return;
    }
    const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) {
        return;
    }
    fetch(`/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete account');
        }
        return response.json();
    })
    .then(data => {
        alert("Account deleted successfully.");
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete account, guess youre stuck here.');
    });
}

//MIDDLEWARE?
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
    }
}
