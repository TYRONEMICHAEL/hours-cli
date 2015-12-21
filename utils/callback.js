export default (resolve, reject, err, res, body) => {
  if(!err && res.statusCode === 200) return resolve(body);
  return reject(err || body);
};
