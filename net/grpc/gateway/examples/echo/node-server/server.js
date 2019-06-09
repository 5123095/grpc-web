var FCClient = require('@alicloud/fc2');

var PROTO_PATH = __dirname + '/../echo.proto';

var async = require('async');
var _ = require('lodash');
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var echo = protoDescriptor.grpc.gateway.testing;
const client = new FCClient('1273211582724531', {
    accessKeyID: 'LTAIphGdjfU9di6m',
    accessKeySecret: '7CzQ5SR01RS0wUzCF4Mvc2RsGSfMMm',
    region: 'cn-hangzhou',
});

/**
 * @param {!Object} call
 * @return {!Object} metadata
 */
function copyMetadata(call) {
  var metadata = call.metadata.getMap();
  var response_metadata = new grpc.Metadata();
  for (var key in metadata) {
    response_metadata.set(key, metadata[key]);
  }
  return response_metadata;
}

/**
 * @param {!Object} call
 * @param {function():?} callback
 */
function doEcho(call, callback) {
  client.invokeFunction("image", call.request.message, null).then(res=>{
      callback(null, {
          message: res.data
      }, copyMetadata(call));
  });
}

/**
 * @param {!Object} call
 * @param {function():?} callback
 */
function doEchoAbort(call, callback) {
  callback({
    code: grpc.status.ABORTED,
    message: 'Aborted from server side.'
  });
}

/**
 * @param {!Object} call
 */
function doServerStreamingEcho(call) {
  var senders = [];
  function sender(message, interval) {
    return (callback) => {
      call.write({
        message: message
      });
      _.delay(callback, interval);
    };
  }
  for (var i = 0; i < call.request.message_count; i++) {
    senders[i] = sender(call.request.message, call.request.message_interval);
  }
  async.series(senders, () => {
    call.end(copyMetadata(call));
  });
}

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {!Server} The new server object
 */
function getServer() {
  var server = new grpc.Server();
  server.addService(echo.EchoService.service, {
    echo: doEcho,
    echoAbort: doEchoAbort,
    serverStreamingEcho: doServerStreamingEcho,
  });
  return server;
}

if (require.main === module) {
  // If this is run as a script, start a server on an unused port
  var echoServer = getServer();
  echoServer.bind('0.0.0.0:9090', grpc.ServerCredentials.createInsecure());
  echoServer.start();
}

exports.getServer = getServer;
