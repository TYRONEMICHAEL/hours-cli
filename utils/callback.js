export default (resolve, reject, err, res, body) => {
  if(!err && (res.statusCode === 200 || res.statusCode === 201))
    return resolve(body);
  return reject(err || body);
};
