var quantities = {}
, open = false;
	
$(function($) {
	// Initialize isotope for product grid
	$('#products-list').isotope({
	  // options
	  itemSelector : '.item',
	  layoutMode : 'fitRows'
	});
	
    // Setup the player to autoplay the next track
    var a = audiojs.createAll({
      trackEnded: function() {
        var next = $('ol li.playing').next();
        if (!next.length) return true;
        next.addClass('playing').siblings().removeClass('playing');
        audio.load($('a', next).attr('data-src'));
        audio.play();
      }
    });
    
    // Load in the first track
    var audio = a[0];
    if (audio) {
        first = $('ol a').attr('data-src');
	    $('ol li').first().addClass('playing');
	    audio.load(first);
    }

    // Load in a track on click
    $('ol li').click(function(e) {
      e.preventDefault();
      $(this).addClass('playing').siblings().removeClass('playing');
      audio.load($('a', this).attr('data-src'));
      audio.play();
    });
    
    // Keyboard shortcuts
    $(document).keydown(function(e) {
      var unicode = e.charCode ? e.charCode : e.keyCode;
         // right arrow
      if (unicode == 39) {
        var next = $('li.playing').next();
        if (!next.length) next = $('ol li').first();
        next.click();
        // back arrow
      } else if (unicode == 37) {
        var prev = $('li.playing').prev();
        if (!prev.length) prev = $('ol li').last();
        prev.click();
        // spacebar
      } else if (unicode == 32) {
        audio.playPause();
      }
    });
	
	// Setup event for expanding footer cart
	$('#footerSlideButton').click(function() {
		if(open === false) {
			if( /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ) {
				$('#footerSlideContent').animate({ height: ($(window).height() * 0.8) + 'px' });
			}
			else {
				$('#footerSlideContent').animate({ height: ($(window).height() * 0.5) + 'px' });
			}
			$(this).css('backgroundPosition', 'bottom left');
			open = true;
		} else {
			$('#footerSlideContent').animate({ height: '0px' });
			$(this).css('backgroundPosition', 'top left');
			open = false;
		}
	});
	
	// Setup event to add products to cart
	$('.btn.add-to-cart').live('click', function(e) {
		if (typeof userId !== 'undefined') {
			var $product = $(this).closest('.product');
			var productId = $product.attr('data-product-id');
			$.post('/cart_items?product_id=' + productId, function(data) {
				outputCart(data);
			});
		}
		else {
			$('#footerSlideButton').click();
		}
	});
	
	// Setup event to increase product quantity
	$('.increase-quantity.btn').live('click', function(e) {
		// Get product row
		var $product = $(this).closest('tr');
		// Get id of product
		var productId = $product.attr('data-product-id');
		
		// Post increase for cart item
		$.post('/cart_items?product_id=' + productId, function(data) {
			// Increment badge
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
		// Get product row
		var $product = $(this).closest('tr');
		// Get id of product
		var productId = $product.attr('data-product-id');
		// Post decrease for cart item
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
	
	if (typeof userId !== 'undefined') {
		getCartContents();
	}
});

// Get the products in user's cart
function getCartContents() {
	$.get('/cart_items.json', function(data) {
		outputCart(data);
	});
}


// Outputs the logged in user's cart
function outputCart(data) {
	if (data.cart_items) {
		$('#cart tbody').html('');
		var total = 0;
		for (var i = 0; i < data.cart_items.length; i++) {
			quantities[data.cart_items[i].productId] = data.cart_items[i].quantity;
			$.get('/products/' + data.cart_items[i].productId + '.json', function(item, quantity) {
				// Calculate total
				var cost = Number(item.product.price) * Number(quantities[item.params.id]);
				total += cost;
				
				// Output product row in cart
				var cart = '<tr data-product-id="' + item.params.id + '"><td><a href="/products/' + 
				item.params.id + '" class="item-link">' + item.product.title + '</a></td>';
				cart += '<td>' + item.product.description + '</td>';
				cart += '<td class="item-price">' + item.product.price + '</td>';
				cart += '<td class="item-quantity"><span class="badge">' + quantities[item.params.id] + '</span>';
				cart += '<a class="decrease-quantity btn quantity-btn"><i class="icon icon-minus"></i></a>';
				cart += '<a class="increase-quantity btn quantity-btn"><i class="icon icon-plus"></i></a></td>';
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