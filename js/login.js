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
                //                Cookies.set('cafeteria-user-email', data.email, {
                //                    expires: 365
                //                });
                //                Cookies.set('cafeteria-user-password', data.password, {
                //                    expires: 365
                //                });
                var d = new Date();
                var emailName = 'cafeteria-user-email';
                var passwordName = 'cafeteria-user-password';

                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = emailName + "=" + data.email + ";" + expires + ";path=/";

                document.cookie = passwordName + "=" + data.password + ";" + expires + ";path=/";

                //                localStorage.customer = JSON.stringify(data);
                window.location.replace("/home.html");
            }
        });
    });
});
//
//window.onload = function(event) {
//        event.stopPropagation(true);
//
//    if (Cookies.get('cafeteria-user-email') && Cookies.get('cafeteria-user-password')) {
//        window.location.replace("home.html");
//    }
//};
