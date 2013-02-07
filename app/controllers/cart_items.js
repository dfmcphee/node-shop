var passport = require('../helpers/passport')
  , cryptPass = passport.cryptPass
  , requireAuth = passport.requireAuth;

var CartItems = function () {
  this.before(requireAuth);
  
  this.respondsWith = ['json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;
  	var user = this.session.get('userId');
  	
  	geddy.model.CartItem.all({userId: user}, {sort: {createdAt: 'desc'}}, function(err, cart_items) {
      self.respond({params: params, cart_items: cart_items});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    // Save the resource, then display index page
    params.id = params.id || geddy.string.uuid(10);
    var user = this.session.get('userId');
    
    var self = this;

    console.log(params);
    
    if (params.product_id) {
    	geddy.model.CartItem.first({productId: params.product_id, userId: user}, function(err, cart_item) {
	    	if (cart_item) {
	    		if (params.decrease === 'true') {
	    			if (cart_item.quantity != 1) {
		    			cart_item.quantity -= 1;
		    		}
		    		else {
			    		geddy.model.CartItem.remove(cart_item.id, function (err, data) {
						  self.redirect({controller: self.name});
						});
		    		}
	    		}
	    		else {
		    		cart_item.quantity += 1;
		    	}
					
				cart_item.save(function(err, data) {
				  if (err) {
				    params.errors = err;
				    self.transfer('add');
				  } else {
				    self.redirect({controller: self.name});
				  }
				});
		    }
		    else {
		    	cart_item = geddy.model.CartItem.create(params);
			    cart_item.userId = user;
				cart_item.productId = params.product_id;
				cart_item.quantity = 1;
					
				cart_item.save(function(err, data) {
				  if (err) {
				    params.errors = err;
				    self.transfer('add');
				  } else {
				    self.redirect({controller: self.name});
				  }
				});
		    }
    	});
    }
    else {
	    self.redirect({controller: self.name});
    }
  };

  this.show = function (req, resp, params) {
    this.respond({params: params});
  };

  this.edit = function (req, resp, params) {
    this.respond({params: params});
  };

  this.update = function (req, resp, params) {
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
  };

  this.destroy = function (req, resp, params) {
    this.respond({params: params});
  };
};

exports.CartItems = CartItems;

