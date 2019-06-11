var FCClient = require('@alicloud/fc2');

var PROTO_PATH = __dirname + '/../gateway.proto';

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
var echo = protoDescriptor.nemofang.gateway.v1;
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
function doPassThrough(call, callback) {
  try{
      client.invokeFunction(call.request.service_name, call.request.func_name, call.request.event).then(res=>{
          callback(null, {
              data: res.data
          }, copyMetadata(call));
      });
  }catch (e) {
      callback(e, {
      }, copyMetadata(call));
  }
}

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {!Server} The new server object
 */
function getServer() {
  var server = new grpc.Server();
  server.addService(echo.GatewayService.service, {
      passThrough: doPassThrough
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
