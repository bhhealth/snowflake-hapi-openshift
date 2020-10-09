/**
 * # This is our one restricted endpoint (beside logout)
 * 
 */
'use strict';

const Joi = require('joi');
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
    path: '/metrics/{measurement}',
    handler: MetricHandlers.queryMetric,
    config: {
      tags: ['api'],
      description: 'Get sensor metrics',
      notes: 'Metrics queried with devicename and measurementname',
      auth: 'token',
      validate: {
        payload: {
          deviceId: Joi.string().required(),
          condition: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/ppg/metrics',
    handler: MetricHandlers.savePPGMetric,
    config: {
      tags: ['api'],
      description: 'Save sensor metrics',
      notes: 'Metrics with timestamp, multiple datapoints supported',
      auth: 'token',
      validate: {
        payload: {
          deviceId: Joi.string().required(),
          time: Joi.number().integer().required(),
          freq: Joi.number().integer().required(),
          raws: Joi.array().required()
        }
      }
    }
  }
];

module.exports = internals;
