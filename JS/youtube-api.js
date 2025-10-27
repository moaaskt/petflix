/* JS/youtube-api.js */
function getYoutubeKey(){
  return (window.__PETFLIX_KEYS && window.__PETFLIX_KEYS.youtube && window.__PETFLIX_KEYS.youtube.apiKey) || "";
}
async function searchVideos({ q, maxResults=12, pageToken="" }){
  const KEY = getYoutubeKey();
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part","snippet");
  url.searchParams.set("type","video");
  url.searchParams.set("safeSearch","strict");
  url.searchParams.set("videoEmbeddable","true");
  url.searchParams.set("q", q || "cachorros");
  url.searchParams.set("maxResults", maxResults);
  if(pageToken) url.searchParams.set("pageToken", pageToken);
  url.searchParams.set("key", KEY);
  const r = await fetch(url.toString());
  if(!r.ok){ const t=await r.text(); throw new Error(`YouTube ${r.status}: ${t}`); }
  const j = await r.json();
  const items = (j.items||[]).map(it=>({
    id: it.id && it.id.videoId,
    title: it.snippet && it.snippet.title,
    channelTitle: it.snippet && it.snippet.channelTitle,
    thumb: it.snippet && (it.snippet.thumbnails && (it.snippet.thumbnails.high||it.snippet.thumbnails.medium||it.snippet.thumbnails.default))
  })).filter(x=>x.id);
  return { items, nextPageToken: j.nextPageToken||"", prevPageToken: j.prevPageToken||"" };
}