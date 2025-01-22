const validRidRegExp = new RegExp('^#\\d+:\\d+$');

const injectRid = (query, paramName, rid) => {
  try {
    if (validRidRegExp.test(rid) === true) {
      return query.replace(`:${paramName}`, rid);
    } else {
      throw new Error('INVALID RID PROVIDED FOR INJECTION:', rid);
    }
  } catch (err) {
    console.error('INJECT RID ERROR:', err);
  }
};

module.exports = { injectRid };
