// Changes created_at field to YYYY-MM-DD format

exports.remapDate = arr => {
  return arr.map(obj => {
    const { created_at } = obj;
    const d = new Date(created_at);
    const newTime = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    return { ...obj, created_at: newTime };
  });
};
