import fs from 'fs';

async function getAllChapters() {
  const url = "https://questions.examside.com/past-years/jee/mht-cet";
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();
  const re = /href="(\/past-years\/jee\/mht-cet\/(physics|chemistry|mathematics)\/[^"]+)"/g;
  let m;
  const list = [];
  while ((m = re.exec(html)) !== null) {
    if (!list.some(c => c.path === m[1])) {
      list.push({ path: m[1], subject: m[2], slug: m[1].split("/").pop() });
    }
  }
  console.log("Total chapters:", list.length);
  fs.writeFileSync('./scripts/chapters.json', JSON.stringify(list, null, 2));
}

getAllChapters();
