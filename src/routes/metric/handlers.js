/**
 * # metric/handlers.js
 *  database bh_sensor
 *  measurement: 
 *    ppg_row, ecg_row, ppg, ecg, temperature
 *    ppg_row -  photoplethysmogram used to detect blood volume, 3 lines data, line=l1, l2, l3
 *    ecg_row - An electrocardiogram (ECG or EKG) is a test that checks how your heart is functioning
 *    ppg - computation result of ppg_row
 *    ecg - computation result of ecg_row
 *  tags - deviceId, patientId, line
 *  fileds: 
 *    ppg_row, ecg_row, temperature - value
 *    ppg - P, T, D,t1, t2, rAI, DDI, H, SI
 *    ecg - PR duration, P width, QRS duration,PP duration, RR duration,Atrial rate,Ventricular rate
 */
'use strict';

var Boom = require('boom'),
  request = require('request'),
  // our configuration
  CONFIG = require('../../config');

var baseUrl = `http://${CONFIG.backend.host}:${CONFIG.backend.port}`

var internals = {};
/**
 '''
       { 
        "measurement":"",
        "tags":{"deviceId":"","patientId":""},
        "time":{"start":1231234, "end": 12312323},
        "freq": 50,
        "raws":[[]]
       }
    '''
 */
internals.savePPGMetric = function (req, reply) {
  console.log("username", req.auth.credentials.username);
  let headers = {};
  headers['Content-Type'] = 'application/json';
  let url = `${baseUrl}/ppg/metrics`;
  let payload = {
    "measurement": "ppg_raw",
    "tags": {
      "deviceId": req.payload.deviceId,
      "patientId": req.auth.credentials.username
    },
    "time": {
      "start": req.payload.time,
    },
    "freq": req.payload.freq,
    "raws": req.payload.raws
  }
  request.post(url, {
    headers: headers,
    body: JSON.stringify(payload)
  },
    function (err, resp, body) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }
      if (resp.statusCode != 200) {
        return reply(Boom.badData(resp.body));
      }
      reply(JSON.parse(body))
    });
};

/**
 * ## queryMetric - you can only reach here if you've passed
{
         "fields":"",
         "condition":""
       }
 */
internals.queryMetric = function (req, reply) {
  console.log("username", req.auth.credentials.username);
  let headers = {};
  headers['Content-Type'] = 'application/json';
  let url = `${baseUrl}/metrics/${req.params.measurement}`

  let payload = {
    fields: "value"
  };
  //deviceId='device2' and patientId='p2'
  payload.condition = req.payload.condition +
    ` and deviceId='${req.payload.deviceId}' and patientId='${req.auth.credentials.username}'`
  console.log("url", url)
  console.log("payload", payload)
  request.post(url, {
    headers: headers,
    body: JSON.stringify(payload)
  },
    function (err, resp, body) {
      console.log('get response')
      if (err) {
        return reply(Boom.badImplementation(err));
      }
      if (resp.statusCode != 200) {
        return reply(Boom.badData(resp.body));
      }
      reply(JSON.parse(body))
    });
};

module.exports = internals;
