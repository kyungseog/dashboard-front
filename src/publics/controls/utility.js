const utility = {
  host: "http://localhost:3000",

  fetchData: async (URL, method) => {
    const response = await fetch(URL, { method: method });
    const data = await response.json();
    return data;
  },

  dayofweek: {
    0: "Mon",
    1: "Tue",
    2: "Wed",
    3: "Thu",
    4: "Fri",
    5: "Sat",
    6: "Sun",
  },

  md: {
    consignment_1: { id: "consignment_1", email: "namjjok", name: "남쪽빛" },
    consignment_2: { id: "consignment_2", email: "sh.jin", name: "진수현" },
    consignment_3: { id: "consignment_3", email: "sunyoungkim", name: "김선영" },
    consignment_4: { id: "consignment_4", email: "mjhong", name: "홍민지" },
    consignment_5: { id: "consignment_5", email: "jy.lee", name: "이지연" },
    buying_1: { id: "buying_1", email: "yj.lee", name: "이예지" },
    buying_2: { id: "buying_2", email: "jy.yang", name: "양주연" },
    strategic_1: { id: "strategic_1", email: "ek.hwang", name: "황은경" },
    strategic_2: { id: "strategic_2", email: "sh.lim", name: "임수현" },
    strategic_3: { id: "strategic_3", email: "eskim", name: "김은선" },
    essential_1: { id: "essential_1", email: "km.kim", name: "김경민" },
  },

  chunwon: (num) => {
    return Math.round(num / 1000).toLocaleString("ko-KR");
  },

  bmwon: (num) => {
    return Math.round(num / 1000000).toLocaleString("ko-KR");
  },
};
export default utility;
