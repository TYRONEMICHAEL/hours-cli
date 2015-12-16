export default (resolve, reject, err, res, body) => {
  if(!err && res.statusCode === 200) resolve(body);
  reject(err || body);
};
