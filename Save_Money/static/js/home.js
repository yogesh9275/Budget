document.addEventListener("DOMContentLoaded", function() {
    // Get the login button element
    var loginButton = document.getElementById("loginButton");
    
    // Add click event listener to the login button
    loginButton.addEventListener("click", function() {
        // Redirect to the /login/ URL
        window.location.href = "/login/";
    });
});


document.addEventListener("DOMContentLoaded", function() {
    // Get the login button element
    var loginButton = document.getElementById("RegisterButton");
    
    // Add click event listener to the login button
    loginButton.addEventListener("click", function() {
        // Redirect to the /login/ URL
        window.location.href = "/register/";
    });
});
