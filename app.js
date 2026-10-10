
const experience = [
  {id:"antidote",title:"Medical Informatics Engineer",org:"Antidote Health",start:"202608",end:"present",location:"Ramat Gan, Israel",
   bullets:["Supporting clinical and operational systems as Medical Informatics Engineer at a virtual-first health plan.","Applying healthcare data standards, integration patterns, and engineering practices across product and clinical workflows."],
   tags:["Informatics","Interop","Health Tech"]},
  {id:"aesto",title:"Data Migration Engineer",org:"Aesto Health",start:"202301",end:"202608",location:"Rehovot, Israel (Remote)",
   bullets:["Explored and queried many different EMR vendors' databases to extract, transform, and load clinical data into internal products.","Developed, tested, and distributed Python scripts and tools — CLIs and Textual GUIs — to assist with project work and organization.","Contributed to the improvement of UI/UX design of client-facing and internal products via development processes."],
   tags:["ETL","Python","EMR","UI/UX"]},
  {id:"emerge",title:"Data Migration Engineer",org:"Emerge Medical Data Intelligence",start:"202106",end:"202212",location:"Tel Aviv, Israel",
   bullets:["Explored and queried many different EMR vendors' databases to extract, transform, and load clinical data to internal products.","Developed and tested Python modules and scripts for processing discrete clinical data, non-discrete documents, and images.","Educated teammates about Python and encouraged programming best practices in meetings and company articles."],
   tags:["ETL","Python","Clinical Data","Mentoring"]},
  {id:"hyro",title:"Electronic Data Integration Consultant",org:"Hyro Conversational AI",start:"202010",end:"202105",location:"Tel Aviv, Israel",
   bullets:["Assisted project managers and developers through Epic's process to be approved for Epic's App Market (previously App Orchard).","Reviewed and planned use of APIs for Provider-Availability and Patient-Appointment-Scheduling."],
   tags:["Epic","APIs","App Market"]},
  {id:"epic",title:"Electronic Data Integration Engineer",org:"Epic",start:"201310",end:"201705",location:"Verona, Wisconsin, USA",
   bullets:["Directed and developed integrations to bridge Epic and Clinical Research Management Systems.","Developed integrations with national databases in Australia and Finland to enhance patient care, including birth- and death-reporting.","Implemented Access-, Ambulatory-, Research-, Revenue-, and Pharmacy-related integrations for The MD Anderson Cancer Center."],
   tags:["HL7","EDI","Research","National Systems"]}
];

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
function setTheme(t) {
  root.setAttribute("data-theme", t);
  themeToggle.textContent = t === "dark" ? "\u263E" : "\u2600";
  localStorage.setItem("theme", t);
}
const saved = localStorage.getItem("theme");
if (saved) setTheme(saved);
else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
else setTheme("light");
themeToggle.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

const navBtns = document.querySelectorAll(".nav-btn");
navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    navBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const el = document.getElementById("section-" + btn.dataset.section);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-toggle]").forEach(h => {
  h.addEventListener("click", () => h.closest(".exp-card").classList.toggle("open"));
});
document.querySelectorAll(".edu-card").forEach(card => {
  card.addEventListener("click", () => card.classList.toggle("open"));
});

const humanView = document.getElementById("humanView");
document.querySelectorAll("[data-view]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    humanView.className = (btn.dataset.view === "timeline" ? "view-timeline" : "view-cards") + " human-only";
  });
});

const lensButtons = document.querySelectorAll("#lensButtons .ctrl-btn");
const cards = document.querySelectorAll(".exp-card");
const skillChips = document.querySelectorAll(".skill-chip");

function applyLens(lens) {
  lensButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.lens === lens));
  skillChips.forEach(c => c.classList.remove("active"));
  if (lens === "all") {
    cards.forEach(card => {
      card.classList.remove("dimmed", "highlighted");
      card.querySelectorAll("li").forEach(li => li.classList.remove("relevant", "irrelevant"));
    });
    skillChips.forEach(c => c.classList.remove("highlight"));
    return;
  }
  cards.forEach(card => {
    const matches = (card.dataset.lenses || "").split(/\s+/).includes(lens);
    card.classList.toggle("dimmed", !matches);
    card.classList.toggle("highlighted", matches);
    card.classList.toggle("open", matches);
    card.querySelectorAll("li").forEach(li => {
      const relevant = (li.dataset.tags || "").split(/\s+/).includes(lens);
      li.classList.toggle("relevant", relevant && matches);
      li.classList.toggle("irrelevant", !relevant || !matches);
    });
  });
  skillChips.forEach(chip => {
    chip.classList.toggle("highlight", chip.dataset.lens === lens);
  });
}
lensButtons.forEach(btn => btn.addEventListener("click", () => applyLens(btn.dataset.lens)));

skillChips.forEach(chip => {
  chip.addEventListener("click", () => {
    const was = chip.classList.contains("active");
    skillChips.forEach(c => c.classList.remove("active"));
    if (was) { applyLens("all"); return; }
    chip.classList.add("active");
    applyLens(chip.dataset.lens || "all");
    document.getElementById("section-experience").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const formatSelect = document.getElementById("formatSelect");
const panels = {
  hl7: document.getElementById("panel-hl7"),
  ccda: document.getElementById("panel-ccda"),
  json: document.getElementById("panel-json")
};

function buildHL7() {
  const ts = new Date().toISOString().replace(/[-:]/g,"").slice(0,14);
  const L = [];
  L.push("; Jonathan Berezin -- Career as HL7 v2.x ADT-style message");
  L.push("MSH|^~\\&|JB_CHART|JONATHAN_BEREZIN|VIEWER|WEB|"+ts+"||ADT^A08|MSG00001|P|2.5");
  L.push("EVN|A08|"+ts);
  L.push("PID|1||JB-001^^^GITHUB||BEREZIN^JONATHAN||19850101|M|||RAMAT_GAN^ISRAEL|||^WPN^PH^^^j.a.berezin@gmail.com");
  L.push("PV1|1|O|MEDICAL_INFORMATICS^ENGINEER||||ANTIDOTE_HEALTH|||||||||||||||||||||||||||||||||||20260801");
  experience.forEach((job,i) => {
    const n = i+1;
    L.push("OBX|"+n+"|TX|ROLE^Job Role||"+job.title+" at "+job.org+"||||||F");
    L.push("OBX|"+n+".1|TX|PERIOD^Period||"+job.start+"-"+job.end+"||||||F");
    L.push("OBX|"+n+".2|TX|LOC^Location||"+job.location+"||||||F");
    job.bullets.forEach((b,j) => L.push("OBX|"+n+"."+(j+3)+"|TX|NOTE^Achievement||"+b+"||||||F"));
  });
  L.push("NTE|1||Medical Informatics · Clinical data bridges · Digital healthcare.");
  return L.join("\n");
}
function buildCCDA() {
  const d = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const L = [];
  L.push("<!-- Jonathan Berezin -- simplified C-CDA ClinicalDocument -->");
  L.push("<ClinicalDocument xmlns=\"urn:hl7-org:v3\">");
  L.push("  <typeId root=\"2.16.840.1.113883.1.3\" extension=\"POCD_HD000040\"/>");
  L.push("  <id root=\"2.16.840.1.113883.19.5\" extension=\"JB-CV-001\"/>");
  L.push("  <title>Jonathan Berezin -- Professional Summary</title>");
  L.push("  <effectiveTime value=\""+d+"\"/>");
  L.push("  <recordTarget><patientRole>");
  L.push("    <id extension=\"JB-001\" root=\"2.16.840.1.113883.19.5\"/>");
  L.push("    <patient><name><given>Jonathan</given><family>Berezin</family></name></patient>");
  L.push("  </patientRole></recordTarget>");
  L.push("  <component><structuredBody><component><section>");
  L.push("    <title>Professional Experience</title><text>");
  experience.forEach(job => {
    L.push("      <paragraph>");
    L.push("        <content styleCode=\"Bold\">"+job.title+" -- "+job.org+"</content>");
    L.push("        <br/>"+job.start+" to "+job.end+" · "+job.location);
    job.bullets.forEach(b => L.push("        <br/>• "+b));
    L.push("      </paragraph>");
  });
  L.push("    </text></section></component></structuredBody></component>");
  L.push("</ClinicalDocument>");
  return L.join("\n");
}
function buildJSON() {
  const obj = {
    resourceType: "Person", id: "jonathan-berezin",
    name: [{use:"official", family:"Berezin", given:["Jonathan"]}],
    telecom: [
      {system:"email", value:"j.a.berezin@gmail.com"},
      {system:"url", value:"https://www.linkedin.com/in/jonathan-berezin"},
      {system:"url", value:"https://github.com/jonathan-berezin"}
    ],
    address: [{city:"Ramat Gan", country:"IL"}],
    extension: [{url:"https://jonathan-berezin.github.io/fhir/StructureDefinition/professional-summary",
      valueString:"Medical Informatics Engineer · Data Migration & Integration · Python"}],
    experience: experience.map(j => ({title:j.title, organization:j.org, period:{start:j.start,end:j.end}, location:j.location, highlights:j.bullets, tags:j.tags})),
    skills: {core:["Python","SQL","ETL","Data Analysis"], standards:["HL7 V2","HL7 V3","HL7 FHIR","EDI","IHE QRPC"], tools:["Cursor","VS Code","PyCharm","AQT","SSMS","AWS","GitHub"]}
  };
  return JSON.stringify(obj, null, 2);
}
panels.hl7.textContent = buildHL7();
panels.ccda.textContent = buildCCDA();
panels.json.textContent = buildJSON();

function applyFormat(fmt) {
  Object.keys(panels).forEach(k => panels[k].classList.toggle("visible", k === fmt));
  document.body.classList.toggle("format-active", fmt !== "human");
  if (fmt !== "human") {
    document.getElementById("section-experience").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
formatSelect.addEventListener("change", () => applyFormat(formatSelect.value));

const searchInput = document.getElementById("globalSearch");
const searchMeta = document.getElementById("searchMeta");
function runSearch(q) {
  q = (q || "").trim().toLowerCase();
  let shown = 0, total = 0;
  document.querySelectorAll(".exp-card, .edu-card").forEach(el => {
    total++;
    const hay = ((el.dataset.search || "") + " " + el.textContent).toLowerCase();
    const match = !q || hay.includes(q);
    el.classList.toggle("search-hide", !match);
    if (match) shown++;
  });
  if (q) {
    searchMeta.textContent = shown + " of " + total + " matches";
    document.querySelectorAll(".exp-card:not(.search-hide)").forEach(c => c.classList.add("open"));
  } else {
    searchMeta.textContent = "";
  }
}
searchInput.addEventListener("input", () => runSearch(searchInput.value));
searchInput.addEventListener("keydown", e => {
  if (e.key === "Escape") { searchInput.value = ""; runSearch(""); searchInput.blur(); }
});

applyLens("all");
applyFormat("human");
