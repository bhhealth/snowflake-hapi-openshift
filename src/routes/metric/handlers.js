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
  // our configuration
  CONFIG = require('../../config'),
  InfluxdbClient = require('@influxdata/influxdb-client');

const bucket = `${CONFIG.influxdb.database}/${CONFIG.influxdb.retentionPolicy}`
const clientOptions = {
  url: `http://${CONFIG.influxdb.host}:${CONFIG.influxdb.port}`,
  token: `${CONFIG.influxdb.username}:${CONFIG.influxdb.password}`
}
const influxDB = new InfluxdbClient.InfluxDB(clientOptions);

var internals = {};
/**
 * ## saveMetric
 * {
 *   ppg_raw:{
 *      deviceId:'', //uuid of device
 *      patientId:'', //userid if not exist
 *      startTime:'', //milissencod since 1970
 *      endTime:'', //milissencod since 1970
 *      freq:'',
 *      raws:[[]] //multiple lines, one line in an element
 *   }
 * }
 * authentication
 */
internals.saveMetric = function (req, reply) {
  const writeAPI = influxDB.getWriteApi('', bucket, 'ms');
  let content = req.payload;
  if (content['ppg_raw']) {
    let ppg = content['ppg_raw'];
    let startTime = ppg['startTime'];
    let endTime = ppg['endTime'];
    let freq = ppg['freq']
    let raws = ppg['raws']
    let scale = 1000 / freq;
    let points = []
    //raws data to points
    for (const ri in raws) {
      let oneLine = raws[ri]
      for (const di in oneLine) {
        let nt = startTime + di * scale;
        let np = new InfluxdbClient.Point('ppg_row').tag('line', ri)
          .tag('deviceId', ppg['deviceId'])
          .tag('patientId', ppg['patientId'])
          .floatField('value', oneLine[di])
          .timestamp(new Date(nt))
        points.push(np)
      }
    }
    //write points to db
    writeAPI.writePoints(points);
    writeAPI
      .close()
      .then(() => reply({ status: "ok" }))
      .catch(err => {
        console.error(err)
        return reply(Boom.badImplementation(err));
      })
  } else {
    reply({ status: "no_data" })
  }
};

/**
 * ## queryMetric - you can only reach here if you've passed
 * {
 *   measurement: "ppg_raw",
 *   tags: {deviceId: "", patientId: "", line: ""}
 *   duration: {
 *     start: "",
 *     stop: ""
 *   }
 *   "field ": "value"
 * }
 */
internals.queryMetric = function (req, reply) {
  const queryAPI = influxDB.getQueryApi('')
  let content = req.payload;
  let measurement = content['measurement'];
  let rangestr = `range(start: -1m)`
  if (content['duration']) {
    let duration = content['duration']
    rangestr = `range(start: ${duration["start"]}, stop: ${duration["stop"]})`
  }
  let tagstr = ""
  if (content['tags']) {
    let tags = content['tags'];
    for (var tag in tags) {
      tagstr = `${tagstr} and r.${tag} == "${tags[tag]}"`
    }
  }
  var filedstr = ""
  if (content['field']) {
    filedstr = `r._field == "${content['field']}"`
  }
  const query = `from(bucket:"${bucket}")
  |> ${rangestr}
  |> filter(fn: (r) =>
    r._measurement == "${measurement}" ${tagstr}
  )
  |> filter(fn: (r) =>
    ${filedstr}
  )
  `
  console.log("query ", query)
  queryAPI.collectRows(query).then((result) => {
    let rs = result.map( (item) => {
      return {time: item._time , value : item._value} 
    })
    reply(rs)
  }).catch((err) => {
    console.error(err)
    return reply(Boom.badImplementation(err));
  })
};

module.exports = internals;
