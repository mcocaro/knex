var equal      = require('assert').equal;
var path       = require('path');
var rimraf     = require('rimraf');

module.exports = function(knex) {

  var migrationConfig = {
    directory: path.join(__dirname, './migration/')
  };

  require('rimraf').sync(path.join(__dirname, './migration'));

  describe('knex.migrate', function () {

    it('should create a new migration file with the create method', function() {
      return knex.migrate.generate('test', migrationConfig).then(function(name) {
        expect(name.split('_')[0]).to.have.length(14);
      });
    });

    it('should list all available migrations with the listAll method', function() {
      return knex.migrate.listAll(migrationConfig).then(function(versions) {
        equal(versions.length, 1);
      });
    });

    it('should list the current migration state with the currentVersion method', function() {
      return knex.migrate.currentVersion(migrationConfig).then(function(version) {
        equal(version, 'none');
      });
    });

    it('should migrate up to the latest migration with knex.migrate.latest()', function() {
      return knex.migrate.latest({directory: __dirname + '/test'}).then(function() {
        return knex('knex_migrations').select('*').then(function(data) {
          expect(data.length).to.equal(2);
        });
      });
    });

    // it('should create a new migration', function() {
    //   return knex.migrate.generate('test', {directory: __dirname + '/test'}).then(function() {

    //   });
    // });

    // it('should migrate up to the latest migration with knex.migrate.latest()', function() {
    //   return knex.migrate.latest({directory: __dirname + '/test'}).then(function() {
    //     return knex('knex_migrations').select('*').then(function() {
    //       console.log(arguments);
    //     });
    //   });
    // });

    it('should migrate down from the latest migration group with knex.migrate.down()', function() {
      return knex.migrate.down({directory: __dirname + '/test'}).then(function() {
        return knex('knex_migrations').select('*').then(function(data) {
          expect(data.length).to.equal(0);
        });
      });
    });

    after(function() {
      rimraf.sync(path.join(__dirname, './migration'));
    });

  });

};