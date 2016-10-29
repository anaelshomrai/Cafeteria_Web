$(document).ready(function () {

    $('#signOut').click(function () {
        localStorage.removeItem('customer');
        window.location.replace("/index.html");
    });

    $("#navbar").load("navbar.html");

});
