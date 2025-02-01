const validRidRegExp = new RegExp('^#\\d+:\\d+$');

const injectRids = (query, params) => {
  try {
    Object.entries(params).forEach(([paramName, rid]) => {
      if (validRidRegExp.test(rid) === true) {
        query = query.replace(`:${paramName}`, rid);
      } else {
        throw new Error(`INVALID RID PROVIDED FOR INJECTION: ${rid}`);
      }
    });
    return query;
  } catch (err) {
    console.error('ERROR WHILE INJECTING RIDs:', params, '\nINJECT RID ERROR:', err);
  }
};

module.exports = { injectRids };
