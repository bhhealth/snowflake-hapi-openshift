const MONGO_HOST = process.env.MONGO_HOST||'183.129.176.218';
const MONGO_PORT = process.env.MONGO_PORT||'27017';
const REDIS_HOST = process.env.REDIS_HOST||'183.129.176.218';
const REDIS_PORT = process.env.REDIS_PORT||'6379';
const BACKEND_HOST = process.env.REDIS_HOST||'localhost';
const BACKEND_PORT = process.env.BACKEND_PORT||'3010';

module.exports = {
  backend: {
    host: BACKEND_HOST.trim(),
    port: BACKEND_PORT.trim()
  },
  mongodb: {
    username: "bhsensor",
    password: "zhu88jie",
    db : "bhsensor",
    host: MONGO_HOST.trim(),
    port: MONGO_PORT.trim()
  },
  redis: {
    host: REDIS_HOST.trim(),
    port: REDIS_PORT.trim()
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
