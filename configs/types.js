module.exports = {
  screeningTypes: () => {
    const allTypes = ["comment", "like", "subscriber", "view"];
    const types = new Map();
    for (const v of allTypes) {
      types.set(v, true);
    }
    return types;
  },
};
