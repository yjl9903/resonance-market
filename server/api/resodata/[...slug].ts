export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const req = toWebRequest(event);
  const pathname = url.pathname.slice('/api/resodata'.length);
  return fetch(`https://reso-data.kmou424.moe${pathname}${url.search}`, req);
});
