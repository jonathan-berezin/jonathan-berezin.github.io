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

const skills = {
  core: ["Python","SQL","ETL","Data Analysis"],
  standards: ["HL7 V2","HL7 V3","HL7 FHIR","EDI","IHE QRPC"],
  tools: ["Claude Code","Cursor","VS Code","PyCharm","AQT","SSMS","AWS S3 / EC2 / SQS / SNS","GitHub"]
};

const education = [
  {school:"The Hebrew University of Jerusalem", period:"Oct 2018 – May 2020", location:"Jerusalem, Israel",
   detail:"Computational Neuroscience and Information Processing, Masters/Ph.D. Student. Courses in Machine Learning, Calculus, Dynamics, Statistics, Cognition, and Neurophysiology."},
  {school:"The University of Texas at Austin", period:"Aug 2008 – May 2013", location:"Austin, Texas, USA",
   detail:"B.S. in Computational Biomedical Engineering · High Honors · GPA 3.92/4.0 · Engineering Scholar. Team project: software for an Automated Biotransistor Analyzer for microRNA Quantification and Cancer Prognosis."}
];

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
function setTheme(t) {
  root.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
}
const saved = localStorage.getItem("theme");
if (saved) setTheme(saved);
else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
else setTheme("light");
themeToggle.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

const navBtns = document.querySelectorAll(".nav-btn");
const panes = document.querySelectorAll(".pane");
function showPane(name) {
  panes.forEach(p => p.classList.toggle("active", p.dataset.pane === name));
  navBtns.forEach(b => b.classList.toggle("active", b.dataset.section === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
navBtns.forEach(btn => btn.addEventListener("click", () => showPane(btn.dataset.section)));
function goHome() { showPane("chart"); }
document.getElementById("homeBtn").addEventListener("click", goHome);
document.getElementById("brandHome").addEventListener("click", goHome);

document.querySelectorAll("[data-toggle]").forEach(h => {
  h.addEventListener("click", () => h.closest(".exp-card").classList.toggle("open"));
});
document.querySelectorAll(".edu-card").forEach(card => {
  card.addEventListener("click", () => card.classList.toggle("open"));
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
    showPane("experience");
  });
});

function buildExpHL7() {
  const ts = new Date().toISOString().replace(/[-:]/g,"").slice(0,14);
  const L = [];
  L.push("; Experience as HL7 v2.x");
  L.push("MSH|^~\\&|JB_CHART|JONATHAN_BEREZIN|VIEWER|WEB|"+ts+"||ADT^A08|MSG00001|P|2.5");
  L.push("PID|1||JB-001^^^GITHUB||BEREZIN^JONATHAN");
  experience.forEach((job,i) => {
    const n = i+1;
    L.push("OBX|"+n+"|TX|ROLE^Job Role||"+job.title+" at "+job.org+"||||||F");
    L.push("OBX|"+n+".1|TX|PERIOD^Period||"+job.start+"-"+job.end+"||||||F");
    L.push("OBX|"+n+".2|TX|LOC^Location||"+job.location+"||||||F");
    job.bullets.forEach((b,j) => L.push("OBX|"+n+"."+(j+3)+"|TX|NOTE^Achievement||"+b+"||||||F"));
  });
  return L.join("\n");
}
function buildExpCCDA() {
  const L = [];
  L.push("<!-- Experience · C-CDA section -->");
  L.push("<section><title>Professional Experience</title><text>");
  experience.forEach(job => {
    L.push("  <paragraph><content styleCode=\"Bold\">"+job.title+" — "+job.org+"</content>");
    L.push("  <br/>"+job.start+" to "+job.end+" · "+job.location);
    job.bullets.forEach(b => L.push("  <br/>• "+b));
    L.push("  </paragraph>");
  });
  L.push("</text></section>");
  return L.join("\n");
}
function buildExpFHIR() {
  return JSON.stringify({
    resourceType: "Bundle", type: "collection",
    entry: experience.map(j => ({
      resource: {
        resourceType: "PractitionerRole",
        code: [{text: j.title}],
        organization: {display: j.org},
        period: {start: j.start, end: j.end === "present" ? undefined : j.end},
        location: [{display: j.location}],
        extension: j.bullets.map(b => ({url: "https://jonathan-berezin.github.io/fhir/highlight", valueString: b}))
      }
    }))
  }, null, 2);
}

function buildSkillsHL7() {
  const L = ["; Skills as HL7 v2.x OBX segments"];
  let n = 1;
  Object.entries(skills).forEach(([group, items]) => {
    items.forEach(s => {
      L.push("OBX|"+(n++)+"|ST|SKILL^"+group.toUpperCase()+"||"+s+"||||||F");
    });
  });
  return L.join("\n");
}
function buildSkillsCCDA() {
  const L = ["<!-- Skills · C-CDA -->", "<section><title>Skills</title><text>"];
  Object.entries(skills).forEach(([group, items]) => {
    L.push("  <paragraph><content styleCode=\"Bold\">"+group+"</content><br/>"+items.join(", ")+"</paragraph>");
  });
  L.push("</text></section>");
  return L.join("\n");
}
function buildSkillsFHIR() {
  return JSON.stringify({
    resourceType: "Practitioner",
    qualification: Object.entries(skills).flatMap(([group, items]) =>
      items.map(s => ({code: {text: s}, extension: [{url: "category", valueString: group}]}))
    )
  }, null, 2);
}

function buildEduHL7() {
  const L = ["; Education as HL7 v2.x"];
  education.forEach((e,i) => {
    const n = i+1;
    L.push("OBX|"+n+"|TX|EDU^School||"+e.school+"||||||F");
    L.push("OBX|"+n+".1|TX|PERIOD^Period||"+e.period+"||||||F");
    L.push("OBX|"+n+".2|TX|LOC^Location||"+e.location+"||||||F");
    L.push("OBX|"+n+".3|TX|NOTE^Detail||"+e.detail+"||||||F");
  });
  return L.join("\n");
}
function buildEduCCDA() {
  const L = ["<!-- Education · C-CDA -->", "<section><title>Education</title><text>"];
  education.forEach(e => {
    L.push("  <paragraph><content styleCode=\"Bold\">"+e.school+"</content>");
    L.push("  <br/>"+e.period+" · "+e.location);
    L.push("  <br/>"+e.detail+"</paragraph>");
  });
  L.push("</text></section>");
  return L.join("\n");
}
function buildEduFHIR() {
  return JSON.stringify({
    resourceType: "Bundle", type: "collection",
    entry: education.map(e => ({
      resource: {
        resourceType: "EducationalOccupationalCredential",
        name: e.school,
        description: e.detail,
        date: e.period,
        recognizedBy: {display: e.location}
      }
    }))
  }, null, 2);
}

const formatSelect = document.getElementById("formatSelect");
const panels = {
  "exp-hl7": document.getElementById("panel-exp-hl7"),
  "exp-ccda": document.getElementById("panel-exp-ccda"),
  "exp-fhir": document.getElementById("panel-exp-fhir"),
  "skills-hl7": document.getElementById("panel-skills-hl7"),
  "skills-ccda": document.getElementById("panel-skills-ccda"),
  "skills-fhir": document.getElementById("panel-skills-fhir"),
  "edu-hl7": document.getElementById("panel-edu-hl7"),
  "edu-ccda": document.getElementById("panel-edu-ccda"),
  "edu-fhir": document.getElementById("panel-edu-fhir")
};

panels["exp-hl7"].textContent = buildExpHL7();
panels["exp-ccda"].textContent = buildExpCCDA();
panels["exp-fhir"].textContent = buildExpFHIR();
panels["skills-hl7"].textContent = buildSkillsHL7();
panels["skills-ccda"].textContent = buildSkillsCCDA();
panels["skills-fhir"].textContent = buildSkillsFHIR();
panels["edu-hl7"].textContent = buildEduHL7();
panels["edu-ccda"].textContent = buildEduCCDA();
panels["edu-fhir"].textContent = buildEduFHIR();

function applyFormat(fmt) {
  Object.keys(panels).forEach(k => {
    const kind = k.split("-")[1];
    panels[k].classList.toggle("visible", kind === fmt);
  });
  document.body.classList.toggle("format-active", fmt !== "human");
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
    searchMeta.textContent = shown + " / " + total;
    document.querySelectorAll(".exp-card:not(.search-hide)").forEach(c => c.classList.add("open"));
    showPane("experience");
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
showPane("chart");
