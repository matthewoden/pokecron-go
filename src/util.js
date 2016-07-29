const promisify = (fn) => (...args) =>
  new Promise((res, rej) =>
    fn(...args, (err, val) => err ? rej(err) : res(val)));

module.exports = { promisify }
