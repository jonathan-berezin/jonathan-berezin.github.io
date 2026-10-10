const experience = [
  {id:"aesto",title:"Data Migration Engineer",org:"Aesto Health",start:"202301",end:"present",location:"Rehovot, Israel (Remote)",
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
const themeIcon = document.getElementById("themeIcon");
function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "light" ? "\u263E" : "\u2600";
  localStorage.setItem("theme", theme);
}
const savedTheme = localStorage.getItem("theme");
if (savedTheme) setTheme(savedTheme);
else if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light");
else setTheme("dark");
themeToggle.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light"));

document.querySelectorAll("[data-toggle]").forEach(h => h.addEventListener("click", () => h.closest(".exp-card").classList.toggle("open")));

const humanView = document.getElementById("humanView");
document.querySelectorAll("#viewButtons .ctrl-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#viewButtons .ctrl-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    humanView.className = btn.dataset.view === "timeline" ? "view-timeline" : "view-cards";
  });
});

const lensButtons = document.querySelectorAll("#lensButtons .ctrl-btn");
const cards = document.querySelectorAll(".exp-card");
const badge = document.getElementById("activeLensBadge");
const badgeText = document.getElementById("activeLensText");
const skillChips = document.querySelectorAll(".skill-chip");

function applyLens(lens) {
  lensButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.lens === lens));
  if (lens === "all") {
    badge.classList.remove("visible");
    cards.forEach(card => {
      card.classList.remove("dimmed", "highlighted");
      card.querySelectorAll("li").forEach(li => li.classList.remove("relevant", "irrelevant"));
    });
    skillChips.forEach(c => c.classList.remove("highlight"));
    return;
  }
  badgeText.textContent = "Focus: " + document.querySelector('#lensButtons [data-lens="'+lens+'"]').textContent;
  badge.classList.add("visible");
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
  const skillMap = {migration:["python","sql","etl","analysis"],edi:["hl7","fhir","edi","ihe"],python:["python"],integration:["hl7","fhir","edi"],design:[],mentoring:["python"]};
  skillChips.forEach(chip => chip.classList.toggle("highlight", (skillMap[lens]||[]).includes(chip.dataset.skill||"")));
}
lensButtons.forEach(btn => btn.addEventListener("click", () => applyLens(btn.dataset.lens)));
document.getElementById("clearLens").addEventListener("click", () => applyLens("all"));

const formatButtons = document.querySelectorAll("#formatButtons .ctrl-btn");
const panels = {hl7: document.getElementById("panel-hl7"), ccda: document.getElementById("panel-ccda"), json: document.getElementById("panel-json")};

function buildHL7() {
  const ts = new Date().toISOString().replace(/[-:]/g,"").slice(0,14);
  const L = [];
  L.push("; Jonathan Berezin -- Career as HL7 v2.x ADT-style message");
  L.push("MSH|^~\\&|CV_SITE|JONATHAN_BEREZIN|VIEWER|WEB|"+ts+"||ADT^A08|MSG00001|P|2.5");
  L.push("EVN|A08|"+ts);
  L.push("PID|1||JB-001^^^GITHUB||BEREZIN^JONATHAN||19850101|M|||REHOVOT^ISRAEL|||^WPN^PH^^^j.a.berezin@gmail.com");
  L.push("PV1|1|O|DATA_MIGRATION^ENGINEER||||AESTO_HEALTH|||||||||||||||||||||||||||||||||||20230101");
  experience.forEach((job,i) => {
    const n = i+1;
    L.push("OBX|"+n+"|TX|ROLE^Job Role||"+job.title+" at "+job.org+"||||||F");
    L.push("OBX|"+n+".1|TX|PERIOD^Period||"+job.start+"-"+job.end+"||||||F");
    L.push("OBX|"+n+".2|TX|LOC^Location||"+job.location+"||||||F");
    job.bullets.forEach((b,j) => L.push("OBX|"+n+"."+(j+3)+"|TX|NOTE^Achievement||"+b+"||||||F"));
  });
  L.push("NTE|1||Built bridges between clinical systems in digital healthcare.");
  return L.join("\n");
}

function buildCCDA() {
  const d = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const L = [];
  L.push("<!-- Jonathan Berezin -- Career as simplified C-CDA ClinicalDocument -->");
  L.push("<ClinicalDocument xmlns=\"urn:hl7-org:v3\">");
  L.push("  <typeId root=\"2.16.840.1.113883.1.3\" extension=\"POCD_HD000040\"/>");
  L.push("  <id root=\"2.16.840.1.113883.19.5\" extension=\"JB-CV-001\"/>");
  L.push("  <code code=\"34133-9\" codeSystem=\"2.16.840.1.113883.6.1\" displayName=\"Summarization of Episode Note\"/>");
  L.push("  <title>Jonathan Berezin -- Professional Summary</title>");
  L.push("  <effectiveTime value=\""+d+"\"/>");
  L.push("  <recordTarget><patientRole>");
  L.push("    <id extension=\"JB-001\" root=\"2.16.840.1.113883.19.5\"/>");
  L.push("    <patient><name><given>Jonathan</given><family>Berezin</family></name></patient>");
  L.push("  </patientRole></recordTarget>");
  L.push("  <component><structuredBody><component><section>");
  L.push("    <code code=\"29762-2\" displayName=\"Social History\"/>");
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
    address: [{city:"Rehovot", country:"IL"}],
    extension: [{url:"https://jonathan-berezin.github.io/fhir/StructureDefinition/professional-summary",
      valueString:"Problem Solver, Data Migration/Integration Engineer, Python Developer in digital healthcare"}],
    experience: experience.map(j => ({title:j.title, organization:j.org, period:{start:j.start,end:j.end}, location:j.location, highlights:j.bullets, tags:j.tags})),
    skills: {core:["Python","SQL","ETL","Data Analysis"], standards:["HL7 V2","HL7 V3","HL7 FHIR","EDI","IHE QRPC"], tools:["Cursor","VS Code","PyCharm","AQT","SSMS","AWS S3/EC2/SQS/SNS","GitHub"]}
  };
  return JSON.stringify(obj, null, 2);
}

panels.hl7.textContent = buildHL7();
panels.ccda.textContent = buildCCDA();
panels.json.textContent = buildJSON();

function applyFormat(fmt) {
  formatButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.format === fmt));
  Object.keys(panels).forEach(k => panels[k].classList.toggle("visible", k === fmt));
  document.body.classList.toggle("format-active", fmt !== "human");
}
formatButtons.forEach(btn => btn.addEventListener("click", () => applyFormat(btn.dataset.format)));

applyLens("all");
applyFormat("human");
