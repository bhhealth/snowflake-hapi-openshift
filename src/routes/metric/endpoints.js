/**
 * # This is our one restricted endpoint (beside logout)
 * 
 */
'use strict';

/**
* ## Imports
*
*/
var MetricHandlers = require('./handlers');

var internals = {};
/**
* ## endpoints
*
* note the config which means authentication is required to access
* this end point
*
*/
internals.endpoints = [
  {
    method: 'POST',
    path: '/metrics/query',
    handler: MetricHandlers.queryMetric,
    config: {
      tags: ['api'],
      description: 'Get sensor metrics',
      notes: 'Metrics queried with devicename and measurementname',
      auth: 'token'
    }
  },
  {
    method: 'POST',
    path: '/metrics/add',
    handler: MetricHandlers.saveMetric,
    config: {
      tags: ['api'],
      description: 'Save sensor metrics',
      notes: 'Metrics with timestamp, multiple datapoints supported',
      auth: 'token'
    }
  }
];

module.exports = internals;
