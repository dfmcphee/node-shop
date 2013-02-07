var quantities = {};

$(function($) {
	// Initialize isotope for product grid
	$('#products-list').isotope({
	  // options
	  itemSelector : '.item',
	  layoutMode : 'fitRows'
	});
	
	// Setup event for expanding footer cart
	var open = false;
	$('#footerSlideButton').click(function() {
		if(open === false) {
			$('#footerSlideContent').animate({ height: ($(document).height() * 0.5) + 'px' });
			$(this).css('backgroundPosition', 'bottom left');
			open = true;
		} else {
			$('#footerSlideContent').animate({ height: '0px' });
			$(this).css('backgroundPosition', 'top left');
			open = false;
		}
	});
	
	// Setup event to add products to cart
	$('.item .add-to-cart').live('click', function(e) {
		var $product = $(this).parent();
		var productId = $product.attr('data-product-id');
		$.post('/cart_items?product_id=' + productId, function(data) {
			outputCart(data);
		});
	});
	
	// Setup event to increase product quantity
	$('.increase-quantity.btn').live('click', function(e) {
		var $product = $(this).closest('tr');
		var productId = $product.attr('data-product-id');
		$.post('/cart_items?product_id=' + productId, function(data) {
			var quantity = parseInt($product.find('.badge').html());
			$product.find('.badge').html(quantity + 1);
			
			// Add price to total
			var total = Number($('#cart-total').html());
			total += Number($product.find('.item-price').html());
			
			$('#cart-total').html(total.toFixed(2));
		});
	});
	
	// Setup event to decrease product quantity
	$('.decrease-quantity.btn').live('click', function(e) {
		var $product = $(this).closest('tr');
		var productId = $product.attr('data-product-id');
		$.post('/cart_items?product_id=' + productId + '&decrease=true', function(data) {
			var quantity = parseInt($product.find('.badge').html());
			
			// Reduce price from total
			var total = Number($('#cart-total').html());
			total -= Number($product.find('.item-price').html());
			$('#cart-total').html(total.toFixed(2));
			
			if (quantity === 1) {
				$product.remove();
			}
			else {
				$product.find('.badge').html(quantity - 1);
			}
		});
	});
	
	if (userId) {
		getCartContents();
	}
});

function getCartContents() {
	$.get('/cart_items.json', function(data) {
		outputCart(data);
	});
}

function outputCart(data) {
	if (data.cart_items) {
		$('#cart tbody').html('');
		var total = 0;
		for (var i = 0; i < data.cart_items.length; i++) {
			quantities[data.cart_items[i].productId] = data.cart_items[i].quantity;
			$.get('/products/' + data.cart_items[i].productId + '.json', function(item, quantity) {
				var cost = Number(item.product.price) * Number(quantities[item.params.id]);
				total += cost;
				var cart = '<tr data-product-id="' + item.params.id + '"><td>' + item.product.title + '</td>';
				cart += '<td>' + item.product.description + '</td>';
				cart += '<td class="item-price">' + item.product.price + '</td>';
				cart += '<td><span class="badge">' + quantities[item.params.id] + '</span>';
				cart += '<a class="decrease-quantity btn"><i class="icon icon-minus"></i></a>';
				cart += '<a class="increase-quantity btn"><i class="icon icon-plus"></i></a></td>';
				$('#cart tbody').append(cart);
				
				// If it is the last item in cart, update the total
				if (i === data.cart_items.length) {
					$('#cart-total').html(total.toFixed(2));
				}
			});
		}
	}
	// If the cart is empty, clear total
	else {
		$('#cart-total').html('0.00');
	}
}