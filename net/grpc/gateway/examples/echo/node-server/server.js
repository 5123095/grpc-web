var FCClient = require('@alicloud/fc2');

var PROTO_PATH = __dirname + '/../gateway.proto';

var async = require('async');
var _ = require('lodash');
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var {TextEncoder} = require('./TextEncoder');
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
async function doStream(call, callback) {
  try{
      let max = 6000000;
      let offset = 0;
      let eventSize = call.request.event.length;
      const encoder = new TextEncoder("utf-8");
      let requestId =  encoder.encode((""+(Math.random()*1000000000<<0)).padEnd(9, "0"));
      let res;
      while(offset < eventSize){
          let offsetString = encoder.encode((""+offset).padStart(9, "0"));
          let curSize = Math.min(eventSize, max);
          let buffer = new Uint8Array(requestId.length + offsetString.length + curSize);
          buffer.set(requestId, 0);
          buffer.set(offsetString, requestId.length);
          buffer.set(call.request.event.slice(offset, offset+curSize), requestId.length + offsetString.length);
          offset += curSize;
          res = await client.invokeFunction(call.request.service_name, call.request.func_name, Buffer.from(buffer));
      }
      callback(null, {
          data: res.data
      }, copyMetadata(call));
  }catch (e) {
      console.log(e);
      callback(e, {
      }, copyMetadata(call));
  }
}

/**
 * @param {!Object} call
 * @param {function():?} callback
 */
async function doRequest(call, callback) {
    try{
        let res = await client.invokeFunction(call.request.service_name, call.request.func_name, call.request.event);
        callback(null, {
            data: res.data
        }, copyMetadata(call));
    }catch (e) {
        console.log(e);
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
  var server = new grpc.Server({"grpc.max_send_message_length": 1024*1024*1024, "grpc.max_receive_message_length":1024*1024*1024});
  server.addService(echo.GatewayService.service, {
      stream: doStream,
      request: doRequest
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
