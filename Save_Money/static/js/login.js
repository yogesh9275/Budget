$(document).ready(function() {
    $('#loginForm').submit(function(event) {
        event.preventDefault(); // Prevent form submission

        var username = $('#username').val();
        var password = $('#password').val();
        var csrftoken = getCookie('csrftoken'); // Get CSRF token from cookie

        // AJAX request to login endpoint
        $.ajax({
            url: '/login/', // Update with your login URL
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            contentType: 'application/json',
            data: JSON.stringify({ username: username, password: password }),
            success: function(response) {
                console.log("Login response:", response);
                if (response.message === 'Login successful') {
                    console.log("Login Successful.");
                    // Trigger click event on the anchor tag
                    $('#login_button').click(function() {
                        window.location.href = '/Expense/';
                    });
                } else {
                    console.log("Login Failed.");
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
});

// function sendData() {
//     var username = document.getElementById('username').value;
//     var password = document.getElementById('password').value;

//         var data = {
//             'username': username,
//             'password': password
//         };

//     console.log("Data received.");
//     console.log(data.username);
//     console.log(data.password);
//     // Send data to Django view using AJAX
   
//     const csrftoken = getCookie('csrftoken');
 
//     $.ajax({
//         url: '/login/', // Update with your URL
//         type: 'POST',
//         headers: {
//             'X-CSRFToken': csrftoken
//         },
//         contentType: 'application/json',
//         data: JSON.stringify(data),
//         async: false, 
//         success: function(response) {
//             console.log("User Login data sent successfully.");
//             if (response.message === 'Login successful') {
//                 console.log("Login Successful.");
//                 // Redirect to the 'Expense' path
//                 $('#expenseLink').trigger('click');
//             } else {
//                 console.log("Login Failed.");
//             }
//         },
    
//         error: function(xhr, status, error) {
//             console.error('Error:', error);
//         }
//     });
// }

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

