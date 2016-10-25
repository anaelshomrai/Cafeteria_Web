$(document).ready(function () {
    $("#backToCategories").click(function () {
        window.location.replace("/index.html");
    });

    $("categoryDetailsForm").submit(function () {
        alert($('[name="duallistbox_demo1[]"]').val());
        return false;
    });

    //later add more items
    //$("#demo1-add-clear").click(function() {
    //    var itemsOptions = $('select[name="duallistbox_demo1[]"]').bootstrapDualListbox();
    //    itemsOptions.append('<option value=otot>otot</option>');
    //    itemsOptions.bootstrapDualListbox('refresh', true);
    //    //to add to the selected: append with: <option value="oranges" selected>Oranges</option>'
    //});
    $("#addItemBtn").click(function () {
        BootstrapDialog.show({
            title: 'Add Item',
            message: function (dialog) {
                var $message = $('<div></div>');
                var pageToLoad = dialog.getData('pageToLoad');
                $message.load(pageToLoad);

                return $message;
            },
            data: {
                'pageToLoad': 'addItemForm.html'
            },
            buttons: [{
                label: 'Save',
                cssClass: 'btn-primary',
                action: function (dialog) {
                    var title = dialog.getModalBody().find('#title').val();
                    var price = dialog.getModalBody().find('#price').val();
                    if (title === "" || price === "") {
                        alert('You Must fill all fields!');
                    } else {
                        addItem(title, price);
                        dialog.close();
                    }
                }
            }, {
                label: 'Add Another',
                cssClass: 'btn-info',
                action: function (dialog) {
                    var title = dialog.getModalBody().find('#title').val();
                    var price = dialog.getModalBody().find('#price').val();
                    if (title === "" || price === "") {
                        alert('You Must fill all fields!');
                    } else {
                        //                        var $button = this;
                        //                        $button.disable();
                        //                        $button.spin();
                        addItem(title, price);
                        dialog.getModalBody().find('#title').val("");
                        dialog.getModalBody().find('#price').val("");
                    }
                }
            }, {
                label: 'Cancel',
                cssClass: 'btn-danger',
                action: function (dialog) {
                    dialog.close();
                }
            }]
        });
    });

});

function initIcons() {
    var itemsOptions = $('select[name="duallistbox_demo1[]"]').bootstrapDualListbox();
    itemsOptions.append('<option value=icon class="glyphicon glyphicon-remove"></option>');
    itemsOptions.append('<option value=icon class="glyphicon glyphicon-edit"></option>');
    itemsOptions.append('<option value=icon class="glyphicon glyphicon-remove"></option>');
    itemsOptions.append('<option value=icon class="glyphicon glyphicon-remove"></option>');

    itemsOptions.bootstrapDualListbox('refresh', true);
}

function addItem(title, price) {
    //     var itemsOptions = $('select[name="duallistbox_demo1[]"]').bootstrapDualListbox();
    //    itemsOptions.append('<option value=' + price + '>' + title + '</option>');
    ////    items.push({
    ////        "id": item.id,
    ////        "title": item.title,
    ////        "price": item.price
    ////
    ////    })
    //    itemsOptions.bootstrapDualListbox('refresh', true);

    $('#itemsTable').append($('<tr><td>' + title + '</td>' +
        '<td>' + price + '</td>' +
        '<td> <button type="button" class="btn btn-primary" (click)="onEdit(category)">Edit <span' +
        ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" ' +
        '(click)="onDelete(category)">Delete    <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));

}

function addMeal(title) {
    $('#MealsTable').append($('<tr><td>' + title + '</td>' +
        '<td> <button type="button" class="btn btn-primary" (click)="onEdit(category)">Edit <span' +
        ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" ' +
        '(click)="onDelete(category)">Delete    <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));

}
