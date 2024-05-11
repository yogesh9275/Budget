$(document).ready(function() {
    $('#RegisterForm').submit(function(event) {
        event.preventDefault(); // Prevent form submission  // Collect input values
        var username = $('#username').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm_password').val();
        var email = $('#email').val();

        // Construct JSON object
        var data = {
            'username': username,
            'password': password,
            'confirm_password': confirmPassword,
            'email': email
        };
        var userdata = {
            user: data,
        }
        console.log("Data received.");
        console.log(userdata);
        // Send data to Django view using AJAX
        const csrftoken = getCookie('csrftoken');
    
        $.ajax({
            url: '/register/', // Update with your URL
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            contentType: 'application/json',
            data: JSON.stringify(userdata),
            success: function(response) {
                console.log("User data sent successfully.");
                if (response.message === 'User registered successfully') {
                        console.log("User registered successfully");
                        // Trigger click event on the anchor tag
                        $('#Register_button').click(function() {
                            window.location.href = '/login/';
                        });
                    }
                else {
                    console.log("User Data not saved in Databse Successfully.");
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
