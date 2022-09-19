const axios = require("axios");

const riotKey = "api_key=RGAPI-80234bef-b728-42cb-9349-26da1eb4b531";

async function fetchBySummonerName(name) {
  const space = "%20";
  while (name.includes(" ")) {
    let spaceSpot = name.indexOf(" ");
    name = name.substring(0, spaceSpot) + space + name.substring(spaceSpot + 1);
  }

  const link = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?${riotKey}`;
  const { data } = await axios.get(link);
  // console.log("data", data);
  return data;
}

async function fetchAllMatchHistory(puuid) {
  const link = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&${riotKey}`;
  const { data } = await axios.get(link);
  // console.log("data", data);
  return data;
}

async function fetchMatchHistoryPage(name) {
  const summonerData = await fetchBySummonerName(name);
  const matchHistory = await fetchAllMatchHistory(summonerData.puuid);
  // console.log("summonerData", summonerData);
  // console.log("matchHistory", matchHistory);
  return matchHistory;
}

async function fetchTopChamps(name) {
  const summonerData = await fetchBySummonerName(name);
  const champInfo = await fetchChampionInfo(summonerData.id);
  const { data } = await axios.get(
    "http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json"
  );
  let championData = data.data;
  let topThree = champInfo.slice(0, 3);
  // for (let i = 0; i < topThree.length; i++) {
  //   for (const property in championData) {
  //     if (championData[property].key === topThree[i].championId) {
  //       // console.log("championData[property].key", championData[property].key);
  //       // console.log("topThree[i].championId", topThree[i].championId);
  //       topThree[i].championName = championData[property].id;
  //       // console.log("topThree[i].championName", topThree[i].championName);
  //     }
  //   }
  // }

  for (const property in championData) {
    for (let i = 0; i < topThree.length; i++) {
      if (topThree[i].championId.toString() === championData[property].key) {
        topThree[i].championName = championData[property].id;
        topThree[i].championPicture = championData[property].image.full;
        topThree[i].championBlurb = championData[property].blurb;
      }
    }
  }
  return topThree;
}

async function fetchSingleMatch(matchId) {
  const link = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?${riotKey}`;
  const { data } = await axios.get(link);
  // console.log(data);
  return data;
}

async function fetchChampionInfo(summonerId) {
  const link = `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}?${riotKey}`;
  const { data: championInfo } = await axios.get(link);
  return championInfo;
}

module.exports = {
  fetchBySummonerName,
  fetchAllMatchHistory,
  fetchMatchHistoryPage,
  fetchTopChamps,
  fetchSingleMatch,
  fetchChampionInfo,
};

// fetchBySummonerName("vaniallla");
// fetchAllMatchHistory(
//   "6_TIsXShg9kHjVDaaY3I3_HBZ-M4pSWCkMx-1sCgyIypi3dJVCxRCui2ut8Vec6mJSY_pIvf7skbqA"
// );
// fetchChampionInfo("H00xW5p4MSEiAe4uipaXQkExMRlqaSOMbDnRPJV6JgXSzmU");
// fetchSingleMatch("NA1_4439212408");
// fetchMatchHistoryPage("vaniallla");
fetchTopChamps("vaniallla");
