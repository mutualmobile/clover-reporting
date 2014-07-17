module.exports = function(grunt) {
  'use strict';

  /* server.js */
  var express = require('express'),
      util = require('util');

  var startServer = function(config) {
    config = config || {};
    var requester = require(config.proxyProtocol);
    var server = express();
    var hourMs = config.hourMs || 0*60*60,
        vhost = config.vhost || 'localhost',
        base = config.base,
        port = config.port,
        host = config.host,
        authHost = config.authHost,
        apiPrefix = config.apiPrefix || '/api',
        authApiPrefix = config.authApiPrefix,
        basicAuth = config.basicAuth;

    function proxyRequest(request, response) {
      var postData = request.body;
      var options = {
        port: config.proxyPort,
        method: request.method,
        headers: {
          'content-type': request.headers['content-type'],
          'content-length': request.headers['content-length'] || '0'
        }
      };
      var jsonData;
      if (request.originalUrl.indexOf(authApiPrefix) > -1) {
        options.host = authHost;
        options.path = request.originalUrl.replace(new RegExp(authApiPrefix), '');
      } else if (request.originalUrl.indexOf(apiPrefix) > -1) {
        options.host = host;
        options.path = request.originalUrl.replace(new RegExp(apiPrefix), '');
      }
      options.headers.host = options.host;
      if (basicAuth) {
        options.headers.Authorization = "Basic " + new Buffer(basicAuth.username + ":" + basicAuth.password).toString("base64");
      }
      if ('POST' === request.method && typeof postData === 'object') {
        postData = JSON.stringify(postData);
      }
      console.log(options);
      var req = requester.request(options, function(res) {
        var output = '';
        console.log(options.method + ' @ ' + options.host + options.path + ' Code: '+ res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          output += chunk;
        });
        res.on('end', function() {
          response
            .status(res.statusCode);
          console.log(output);
          try {
            jsonData = JSON.parse(output);
          } catch(e) {
            jsonData = null;
          }
          if (typeof jsonData === 'object') {
            response.json(jsonData);
          } else {
            response.send(output);
          }
        });
      });

      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });

      if ('POST' === request.method) {
        req.write(postData);
      }

      req.end();
    }

    server.use(express['static'](base, {maxAge: hourMs}));
    server.use(express.directory(base, {icons: true}));
    server.use(express.bodyParser());
    server.use(express.errorHandler({dumpExceptions: true, showStack: true}));

    server.all(apiPrefix + '*', proxyRequest);
    server.all(authApiPrefix + '*', proxyRequest);

    server.get('/*', function(req, res) {
      res.redirect(util.format('/#%s#', req.originalUrl));
    });

    if (vhost) {
      server.use(express.vhost(vhost, server));
    }

    server.listen(port);
    return server;
  };


  grunt.registerMultiTask('server', 'Runs a static web and proxy server', function() {
    var options = this.options({});
    var server = startServer({
        host: options.apiBaseUrl,
        authHost: options.authApiBaseUrl,
        hourMs: 0*60*60,
        vhost: options.vhost,
        base: options.base,
        port: options.port,
        apiPrefix: options.apiPrefix,
        authApiPrefix: options.authApiPrefix,
        proxyPort: options.proxyPort || '80',
        proxyProtocol: options.proxyProtocol || 'http'
    }),
    args = this.args,
    done = args[args.length-1] === 'watch' ? function() {} : this.async();

    server.on('close', done);

    console.log('Express server running at %s:%d', options.vhost, options.port);
  });

};
