$(document).ready(() => {
    $('.add-to-cart').on('click', addToCart);
});
function addToCart() {
    var id = $(this).data("id");
    var quantity = $('#sst') ? $('#sst').val() : 1;
    $.ajax({
        type: "post",
        url: "/cart",
        data: { id, quantity },
        success: function (result) {
            $('#cart-badge').html(result.totalQuantity);
        }
    });
}
function updateCart(id, quantity) {
    if (quantity == 0) {
        removeCartItem(id);
    } else {
        updateCartItem(id, quantity);
    }
}

function removeCartItem(id) {
    $.ajax({
        type: "delete",
        url: "/cart",
        data: { id },
        success: function (result) {
            $('#cart-badge').html(result.totalQuantity);
            $('#total-price').html('$' + result.totalPrice);
            if (result.totalQuantity > 0) {
                $(`#item${id}`).remove();
            } else {
                $('#cart-body').html('<div class="alert alert-info text-center">Your car is empty!</div>');
            }
        }
    });
}

function updateCartItem(id, quantity) {
    $.ajax({
        type: "put",
        url: "/cart",
        data: { id, quantity },
        success: function (result) {
            $('#cart-badge').html(result.totalQuantity);
            $('#total-price').html('$' + result.totalPrice);
            $(`#price${id}`).html('$' + result.item.price);
        }
    });
}

function clearCart() {
    if (confirm('Do you really want to delete all items?')) {
        $.ajax({
            type: "delete",
            url: "/cart/all",
            success: function () {
                $('#cart-badge').html('0');
                $('#cart-body').html('<div class="alert alert-info text-center">Your car is empty!</div>');
            }
        });
    }
}
