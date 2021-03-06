(function () {
var CartItem = function () {

  this.defineProperties({
    quantity: {type: 'number'},
  });

  this.belongsTo('Product');
  this.belongsTo('User');
  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
CartItem.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
CartItem.someStaticMethod = function () {
  // Do some other stuff
};
CartItem.someStaticProperty = 'YYZ';
*/

CartItem = geddy.model.register('CartItem', CartItem);

}());

(function () {
var Passport = function () {
  this.property('authType', 'string');
  this.property('key', 'string');

  this.belongsTo('User');
};

Passport = geddy.model.register('Passport', Passport);

}());

(function () {
var Product = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    description: {type: 'string'},
    price: {type: 'string'},
    photo: {type: 'string'},
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Product.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Product.someStaticMethod = function () {
  // Do some other stuff
};
Product.someStaticProperty = 'YYZ';
*/

Product = geddy.model.register('Product', Product);

}());

(function () {
var Song = function () {

  this.defineProperties({
  	track: {type: 'int'},
  	title: {type: 'string'},
    preview: {type: 'string'},
    file: {type: 'string'},
  });
  
  this.belongsTo('Product');

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Song.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Song.someStaticMethod = function () {
  // Do some other stuff
};
Song.someStaticProperty = 'YYZ';
*/

Song = geddy.model.register('Song', Song);

}());

(function () {
var User = function () {

  this.property('username', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('familyName', 'string', {required: true});
  this.property('givenName', 'string', {required: true});
  this.property('email', 'string', {required: true});
  this.property('role', 'string', {required: false});

  this.validatesLength('username', {min: 3});
  this.validatesLength('password', {min: 8});
  this.validatesConfirmed('password', 'confirmPassword');

  this.hasMany('Passports');
  this.hasOne('Cart');
};

User = geddy.model.register('User', User);

}());