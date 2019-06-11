/**
 * @fileoverview gRPC-Web generated client stub for nemofang.gateway.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.nemofang = {};
proto.nemofang.gateway = {};
proto.nemofang.gateway.v1 = require('./gateway_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.nemofang.gateway.v1.GatewayServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.nemofang.gateway.v1.GatewayServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.nemofang.gateway.v1.PassThroughRequest,
 *   !proto.nemofang.gateway.v1.PassThroughResponse>}
 */
const methodInfo_GatewayService_PassThrough = new grpc.web.AbstractClientBase.MethodInfo(
  proto.nemofang.gateway.v1.PassThroughResponse,
  /** @param {!proto.nemofang.gateway.v1.PassThroughRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.nemofang.gateway.v1.PassThroughResponse.deserializeBinary
);


/**
 * @param {!proto.nemofang.gateway.v1.PassThroughRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.nemofang.gateway.v1.PassThroughResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.nemofang.gateway.v1.PassThroughResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.nemofang.gateway.v1.GatewayServiceClient.prototype.passThrough =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/nemofang.gateway.v1.GatewayService/PassThrough',
      request,
      metadata || {},
      methodInfo_GatewayService_PassThrough,
      callback);
};


/**
 * @param {!proto.nemofang.gateway.v1.PassThroughRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.nemofang.gateway.v1.PassThroughResponse>}
 *     A native promise that resolves to the response
 */
proto.nemofang.gateway.v1.GatewayServicePromiseClient.prototype.passThrough =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/nemofang.gateway.v1.GatewayService/PassThrough',
      request,
      metadata || {},
      methodInfo_GatewayService_PassThrough);
};


module.exports = proto.nemofang.gateway.v1;

