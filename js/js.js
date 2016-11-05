$(document).ready(function () {



    $("#navbar").load("navbar.html");

});

function areYouSure(callback) {
    var res;
    BootstrapDialog.confirm({
        title: 'Pay Attention!',
        message: 'Are you sure you want to delete this item ?',
        type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        closable: true, // <-- Default value is false
        draggable: true, // <-- Default value is false
        btnCancelLabel: 'No', // <-- Default value is 'Cancel',
        btnOKLabel: 'Yes', // <-- Default value is 'OK',
        btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
        callback: function (result) {
            // result will be true if button was click, while it will be false if users close the dialog directly.
            if (result) {
                res = true;
            } else {
                res = false;
            }
        }
    });
    if (res === true) {
        callback(true);
    } else {
        callback(false);
    }
}

function logout(){
        //        localStorage.removeItem('customer');
        var emailCookieName = 'cafeteria-user-email';
        var passwordCookieName = 'cafeteria-user-password';
        document.cookie = emailCookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        document.cookie = passwordCookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';


        window.location.replace("/index.html");
}
