const utility = {
  host: "http://localhost:3000",

  fetchData: (URL, method) => fetch(URL, { method: method }).then((r) => r.json()),
  chunwon: (num) => Math.round(num / 1000).toLocaleString("ko-KR"),
  bmwon: (num) => Math.round(num / 1000000).toLocaleString("ko-KR"),

  dayofweek: {
    0: "Mon",
    1: "Tue",
    2: "Wed",
    3: "Thu",
    4: "Fri",
    5: "Sat",
    6: "Sun",
  },

  volumeBrands: [
    "B0000CZU",
    "B0000DCM",
    "B0000DFV",
    "B0000DGS",
    "B0000DGT",
    "B0000DHQ",
    "B0000DIU",
    "B0000DIX",
    "B0000DPV",
    "B0000DWV",
  ], //삠뽀요, 쁘띠뮤, 베베쥬, 월튼키즈, 마리앤모리, 밀크마일, 몰리멜리, 젤리스푼, 헤이미니, 앤디애플

  fashionMds: ["mjhong", "namjjok", "jw.kim", "djjung"],
};
export default utility;
