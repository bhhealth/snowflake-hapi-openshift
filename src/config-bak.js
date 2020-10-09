module.exports = {
  influxdb: {
    host: "9.46.66.162",
    port: "8086",
    username: "ecg",
    password: "ecg_passw0rd",
    database: "bh_sensor",
    retentionPolicy: "autogen"
  },
  backend: {
    host: "localhost",
    port: "3010"
  },
  mongodb: {
    username: "bhsensor",
    password: "zhu88jie",
    db : "bhsensor",
    host: '9.46.64.121',
    port: '31017'
  },
  redis: {
    host: '9.46.66.162',
    port: 6379
  },  
  crypto: {
    privateKey:
    '37LvDSasdfasfsaf3a3IEIA;3r3oi3joijpjfa3a3m4XvjYOh9Yaa.p3id#IEYDNeaken',
    tokenExpiry: 12 * 30 * 1000 * 60 //1 hour
  },
  email: {
    test: false, 
    username: "xiaoruxing@163.com",
    password: "Sun55kong3721",
    accountName: "xiaoruxing@163.com"
  },
  validation: {
    username: /^.{3,20}$/,
    password: /^.{3,20}$/
    //username: /^[a-zA-Z0-9]{6,12}$/,
    //password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/
  },
  hapi: {
    port: 8080,
    ip: '0.0.0.0'
  }
};
