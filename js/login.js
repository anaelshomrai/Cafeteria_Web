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
            //            alert("Data: " + data + "\nStatus: " + status);
            if (data === null) {
                alert("Wrong details!");
            } else {

                var d = new Date();
                var emailName = 'cafeteria-user-email';
                var passwordName = 'cafeteria-user-password';

                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = emailName + "=" + data.email + ";" + expires + ";path=/";

                document.cookie = passwordName + "=" + data.password + ";" + expires + ";path=/";

                window.location = "home.html";
            }
        });
    });

    $('#forgotPasswordBtn').click(function () {
        var email = $('#forgot-email').val();
        var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/getUserPassword";

        $.post(urlAddress, {
            email: email
        }, function (data, status) {
            //alert("Data: " + data + "\nStatus: " + status);
            if (data === null) {
                alert("Wrong email!");
            } else {
                alert("Your password is: " + data.password);
                $('form').animate({
                    height: "toggle",
                    opacity: "toggle"
                }, "slow");
            }
        });
    });
});
