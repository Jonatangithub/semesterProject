export async function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Form validation
    if (!name || !email || !password) {
        console.error('Please fill in all fields');
        return; // Prevent further execution if fields are missing
    }

    const user = {
        name: name,
        email: email,
        password: password
    };
    const apiURL ='https://main-4iku.onrender.com'
    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            console.log('User registered successfully');
            // Optionally, redirect to another page or show a success message
        } else {
            console.error('Failed to register user');
            // Optionally, display an error message to the user
        }
    } catch (error) {
        console.error('Error:', error);
        // Optionally, display an error message to the user
    }
}