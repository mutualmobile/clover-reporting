var https = require('https');

function custom(req, res) {
  var options = {
    hostname: 'api.clover.com',
    port: 443,
    path: '/v2/merchant/RZC2F4FMKFJ12/orders',
    method: 'GET'
  };
  res.send({params: req.params});
  // console.log(req.params[0]);
  // https.request(options, function(data) {
  //   res.send([{name:'wine1'}, {name:'wine2'}]);
  // });
}

exports.init = function(server) {
  server.get('/custom/*', custom);
};