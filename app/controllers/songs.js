var Songs = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Song.all(function(err, songs) {
      self.respond({params: params, songs: songs});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , song = geddy.model.Song.create(params);

    song.save(function(err, data) {
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

    geddy.model.Song.first(params.id, function(err, song) {
      self.respond({params: params, song: song.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Song.first(params.id, function(err, song) {
      self.respond({params: params, song: song});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Song.first(params.id, function(err, song) {
      song.updateAttributes(params);

      song.save(function(err, data) {
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

    geddy.model.Song.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Songs = Songs;
