$(document).ready(function () {
    $('.message a').click(function () {
        $('form').animate({
            height: "toggle",
            opacity: "toggle"
        }, "slow");
    });

    $('#loginBtn').click(function () {
        var email = $('#email').val();
        var password = $('#password').val();
        var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/validateUser";

        $.post(urlAddress, {
            email: email,
            password: password
        }, function (data, status) {
            alert("Data: " + data + "\nStatus: " + status);
            if (data === null) {
                alert("null");
            } else {
                localStorage.customer = JSON.stringify(data);
                window.location.replace("/home.html");
            }
        });
    });
});

