var passport = require('../helpers/passport')
  , cryptPass = passport.cryptPass
  , requireAuth = passport.requireAuth;

var Products = function () {
  this.before(requireAuth, {
    except: ['index', 'show']
  });
  
  function getUserRole(user, session) {
	if (user.role) {
		return user.role;
	}
	else {
		return false;
	}
  }
  
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;
    var userId = this.session.get('userId');
    
    if (userId) {
	  geddy.model.User.first(function (err, user) {
		if (!err && user) {
	    	role = getUserRole(user, this.session);
	    }
	    
	    geddy.model.Product.all(function(err, products) {
	      self.respond({params: params, products: products, role:role });
	    });
	  });
    }
    else {
	    geddy.model.Product.all(function(err, products) {
	      self.respond({params: params, products: products});
	    });
    }
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , product = geddy.model.Product.create(params);

    product.save(function(err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;
    var userId = this.session.get('userId');
    
    geddy.model.Product.first(params.id, function(err, product) {
    	if (product){
			geddy.model.Song.all({productId: params.id}, {sort: {track: 'asc'}}, function(err, songs) {
			    if (userId) {
					geddy.model.User.first(function (err, user) {
						if (!err && user) {
				    		role = getUserRole(user, this.session);
				    	}
				    	
				    	self.respond({params: params, product: product.toObj(), role: role, songs: songs});
				    });
			    }
			    else {
			      	self.respond({params: params, product: product.toObj(), songs: songs});
			    }
			 });
		}
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Product.first(params.id, function(err, product) {
      function htmlEntities(str) {
	    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	  }
	
      product.title = htmlEntities(product.title);
      product.description = htmlEntities(product.description);
      self.respond({params: params, product: product});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Product.first(params.id, function(err, product) {
      product.updateAttributes(params);

      product.save(function(err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        } else {
          self.redirect({controller: self.name});
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Product.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Products = Products;
