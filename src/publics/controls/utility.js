const utility = {
    fetchData: async (URL, method) => {
    const response = await fetch(URL, {method: method});
    const data = await response.json()
    return data;
    },

    dayofweek: {
      0: 'Mon',
      1: 'Tue',
      2: 'Wed',
      3: 'Thu',
      4: 'Fri',
      5: 'Sat',
      6: 'Sun'
  },

}
export { utility };