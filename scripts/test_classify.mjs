import fs from 'fs';

async function testClassify() {
  const url = "https://questions.examside.com/past-years/jee/mht-cet/physics/current-electricity";
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();
  
  const rowRegex = /<a class="preview-row" href="([^"]+)">[\s\S]*?<div class="preview-body"><!-- HTML_TAG_START -->([\s\S]*?)<!-- HTML_TAG_END -->[\s\S]*?<span class="badge badge-neutral">([^<]+)<\/span>/g;
  let m;
  const questions = [];
  while ((m = rowRegex.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const badge = m[3].trim();
    const yMatch = badge.match(/202[2-6]/);
    if (yMatch) {
      questions.push({ link: m[1], text, badge, year: yMatch[0] });
    }
  }
  
  const topics = [
    { name: "Meter Bridge & Wheatstone Bridge", patterns: [/meter bridge/i, /wheatstone/i, /balancing length/i, /null point/i, /bridge wire/i] },
    { name: "Potentiometer & Comparison of EMF", patterns: [/potentiometer/i, /potential gradient/i, /balancing point/i, /internal resistance of.*cell/i, /compare.*emf/i] },
    { name: "Kirchhoff's Laws & Circuit Analysis", patterns: [/kirchhoff/i, /junction rule/i, /loop rule/i, /circuit/i, /mesh/i, /current drawn/i, /branch/i] },
    { name: "Galvanometer to Ammeter & Voltmeter", patterns: [/galvanometer/i, /ammeter/i, /voltmeter/i, /shunt/i, /full scale deflection/i] },
    { name: "Resistance, Resistivity & Temperature Coefficient", patterns: [/resistivity/i, /temperature coefficient/i, /resistance/i, /resistor/i, /ohm/i, /specific resistance/i] },
    { name: "Drift Velocity & Current Density", patterns: [/drift/i, /mobility/i, /relaxation time/i, /current density/i] },
    { name: "Electric Power, Energy & Cells in Combination", patterns: [/power/i, /joule/i, /heating/i, /cells in series/i, /cells in parallel/i, /terminal potential/i] }
  ];
  
  const classified = {};
  for (const q of questions) {
    let matchedTopic = "General / Miscellaneous";
    for (const t of topics) {
      if (t.patterns.some(p => p.test(q.text))) {
        matchedTopic = t.name;
        break;
      }
    }
    if (!classified[matchedTopic]) classified[matchedTopic] = { total: 0, byYear: {} };
    classified[matchedTopic].total++;
    classified[matchedTopic].byYear[q.year] = (classified[matchedTopic].byYear[q.year] || 0) + 1;
  }
  
  console.log("Classified " + questions.length + " questions in Current Electricity:");
  for (const [top, stats] of Object.entries(classified)) {
    console.log(`- ${top}: Total ${stats.total}, ByYear:`, stats.byYear);
  }
}

testClassify();
