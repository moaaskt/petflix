/* JS/youtube-render.js */
function renderPlayer(el, videoId){
  if(!el) return;
  el.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}
function renderGrid(el, items, onClick){
  if(!el) return;
  el.innerHTML = items.map(x=>`
    <div class="yt-card" data-id="${x.id}">
      <img src="${(x.thumb&&x.thumb.url)||""}" alt="">
      <div class="meta"><div class="title">${x.title||""}</div><div class="channel">${x.channelTitle||""}</div></div>
    </div>`).join("");
  el.querySelectorAll(".yt-card").forEach(c=>{
    c.onclick=()=>onClick && onClick(c.getAttribute("data-id"));
  });
}
function renderPagination(el, { onPrev, onNext, hasPrev, hasNext }){
  if(!el) return; el.innerHTML = `
    <button id="yt-prev" ${hasPrev?"":"disabled"}>Anterior</button>
    <button id="yt-next" ${hasNext?"":"disabled"}>Próximo</button>`;
  const p=el.querySelector("#yt-prev"), n=el.querySelector("#yt-next");
  if(p&&hasPrev) p.onclick=onPrev;
  if(n&&hasNext) n.onclick=onNext;
}