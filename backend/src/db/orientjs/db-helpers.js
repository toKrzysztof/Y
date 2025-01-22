const serializeRid = (rid) => {
  const stringifiedRid = JSON.stringify(rid);
  return stringifiedRid.slice(1, stringifiedRid.length - 1);
};

const serializeRids = (ridArray) => ridArray.map((rid) => serializeRid(rid));

module.exports = { serializeRid, serializeRids };
