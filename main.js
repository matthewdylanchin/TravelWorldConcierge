/* ════════════════════════════════════════════════════════════════
   TRAVEL WORLD CONCIERGE — main.js
   Globe ↔ Map transform with D3 + TopoJSON
   ════════════════════════════════════════════════════════════════ */

"use strict";

/* ══════════════════════ DESTINATION DATA ══════════════════════ */
const DESTINATIONS = {
  Japan: {
    code: "JP",
    region: "AS",
    flag: "🇯🇵",
    specialist: "Patricia Kho · Asia Pacific Lead",
    desc: "Cherry blossoms, ancient temples, Michelin cuisine, and the serene beauty of Kyoto await.",
  },
  France: {
    code: "FR",
    region: "EU",
    flag: "🇫🇷",
    specialist: "Patricia Kho · Europe Lead",
    desc: "Parisian elegance, Loire Valley châteaux, and sun-drenched Provençal terraces.",
  },
  Italy: {
    code: "IT",
    region: "EU",
    flag: "🇮🇹",
    specialist: "Patricia Kho · Mediterranean Lead",
    desc: "Amalfi coast villas, Tuscan wine estates, and private Vatican access beyond the ordinary.",
  },
  Greece: {
    code: "GR",
    region: "EU",
    flag: "🇬🇷",
    specialist: "Patricia Kho · Mediterranean Lead",
    desc: "Santorini sunsets from your private terrace, exclusive island-hopping, and ancient wonders.",
  },
  UAE: {
    code: "AE",
    region: "ME",
    flag: "🇦🇪",
    specialist: "Patricia Kho · Middle East Lead",
    desc: "Dubai's ultra-luxury towers, desert glamping under stars, and Abu Dhabi's cultural gems.",
  },
  Maldives: {
    code: "MV",
    region: "AS",
    flag: "🇲🇻",
    specialist: "Patricia Kho · Indian Ocean Lead",
    desc: "Overwater bungalows, bioluminescent lagoons, and resorts known only to the privileged few.",
  },
  Thailand: {
    code: "TH",
    region: "AS",
    flag: "🇹🇭",
    specialist: "Patricia Kho · Asia Pacific Lead",
    desc: "Private Phang Nga Bay cruises, golden temples, floating markets, and Chiang Mai retreats.",
  },
  "South Africa": {
    code: "ZA",
    region: "AF",
    flag: "🇿🇦",
    specialist: "Patricia Kho · Africa Lead",
    desc: "Private game reserves, vineyard estates, and the raw spectacular beauty of the Cape.",
  },
  Australia: {
    code: "AU",
    region: "OC",
    flag: "🇦🇺",
    specialist: "Patricia Kho · Pacific Lead",
    desc: "Uluru at sunrise, Great Barrier Reef private charters, and South Australian wine estates.",
  },
  "United States": {
    code: "US",
    region: "AM",
    flag: "🇺🇸",
    specialist: "Patricia Kho · Americas Lead",
    desc: "New York's finest penthouses, Hawaii's secluded shores, and national parks in luxury style.",
  },
  Switzerland: {
    code: "CH",
    region: "EU",
    flag: "🇨🇭",
    specialist: "Patricia Kho · Europe Lead",
    desc: "Alpine chalets, private ski slopes, world-class spas, and watches of extraordinary craft.",
  },
  Morocco: {
    code: "MA",
    region: "AF",
    flag: "🇲🇦",
    specialist: "Patricia Kho · Africa Lead",
    desc: "Riad palaces in Marrakech, private Sahara camps, and the blue streets of Chefchaouen.",
  },
  Maldives: {
    code: "MV",
    region: "AS",
    flag: "🇲🇻",
    specialist: "Patricia Kho · Indian Ocean Lead",
    desc: "Overwater bungalows, bioluminescent lagoons, and resorts known only to the privileged few.",
  },
  Bali: {
    code: "ID",
    region: "AS",
    flag: "🇮🇩",
    specialist: "Patricia Kho · Asia Pacific Lead",
    desc: "Clifftop villas above turquoise waters, temple ceremonies, and Ubud's spiritual retreats.",
  },
  "New Zealand": {
    code: "NZ",
    region: "OC",
    flag: "🇳🇿",
    specialist: "Patricia Kho · Pacific Lead",
    desc: "Fiordland's dramatic landscapes, private lodges, and adventure done in absolute comfort.",
  },
};

/* Numeric ISO codes for TopoJSON lookup */
const ISO_NUMERIC = {
  JP: "392",
  FR: "250",
  IT: "380",
  GR: "300",
  AE: "784",
  MV: "462",
  TH: "764",
  ZA: "710",
  AU: "036",
  US: "840",
  CH: "756",
  MA: "504",
  ID: "360",
  NZ: "554",
};

/* Reverse map: numericId → destination name */
const NUMERIC_TO_NAME = {};
Object.entries(DESTINATIONS).forEach(([name, d]) => {
  // Normalize numeric codes so they match TopoJSON ids (no leading zeros).
  const num = ISO_NUMERIC[d.code] && String(parseInt(ISO_NUMERIC[d.code], 10));
  if (num) NUMERIC_TO_NAME[num] = name;
});

/* Compact numeric ISO → common country name for the generic tooltip.
      Only a representative subset is needed — uncurated countries show a
      friendly generic card inviting the visitor to enquire. */
const NUMERIC_TO_COUNTRY_NAME = {
  "004": "Afghanistan",
  "008": "Albania",
  "012": "Algeria",
  "024": "Angola",
  "032": "Argentina",
  "036": "Australia",
  "040": "Austria",
  "050": "Bangladesh",
  "056": "Belgium",
  "064": "Bhutan",
  "068": "Bolivia",
  "076": "Brazil",
  100: "Bulgaria",
  104: "Myanmar",
  116: "Cambodia",
  120: "Cameroon",
  124: "Canada",
  144: "Sri Lanka",
  152: "Chile",
  156: "China",
  170: "Colombia",
  188: "Costa Rica",
  191: "Croatia",
  192: "Cuba",
  203: "Czech Republic",
  208: "Denmark",
  218: "Ecuador",
  818: "Egypt",
  222: "El Salvador",
  231: "Ethiopia",
  246: "Finland",
  250: "France",
  276: "Germany",
  288: "Ghana",
  300: "Greece",
  320: "Guatemala",
  332: "Haiti",
  340: "Honduras",
  348: "Hungary",
  356: "India",
  360: "Indonesia",
  364: "Iran",
  368: "Iraq",
  372: "Ireland",
  376: "Israel",
  380: "Italy",
  388: "Jamaica",
  392: "Japan",
  400: "Jordan",
  398: "Kazakhstan",
  404: "Kenya",
  408: "North Korea",
  410: "South Korea",
  414: "Kuwait",
  418: "Laos",
  422: "Lebanon",
  434: "Libya",
  458: "Malaysia",
  484: "Mexico",
  504: "Morocco",
  508: "Mozambique",
  524: "Nepal",
  528: "Netherlands",
  554: "New Zealand",
  566: "Nigeria",
  578: "Norway",
  586: "Pakistan",
  591: "Panama",
  604: "Peru",
  608: "Philippines",
  616: "Poland",
  620: "Portugal",
  630: "Puerto Rico",
  634: "Qatar",
  642: "Romania",
  643: "Russia",
  682: "Saudi Arabia",
  686: "Senegal",
  694: "Sierra Leone",
  703: "Slovakia",
  706: "Somalia",
  710: "South Africa",
  724: "Spain",
  729: "Sudan",
  752: "Sweden",
  756: "Switzerland",
  760: "Syria",
  158: "Taiwan",
  762: "Tajikistan",
  764: "Thailand",
  788: "Tunisia",
  792: "Turkey",
  800: "Uganda",
  804: "Ukraine",
  784: "UAE",
  826: "United Kingdom",
  840: "United States",
  858: "Uruguay",
  860: "Uzbekistan",
  862: "Venezuela",
  704: "Vietnam",
  887: "Yemen",
  894: "Zambia",
  716: "Zimbabwe",
};

/* ══════════════════════ DOM REFS ══════════════════════ */
const globeContainer = document.getElementById("globe-container");
const tooltip = document.getElementById("map-tooltip");
const tooltipClose = document.getElementById("tooltip-close");
const tooltipCTA = document.getElementById("tooltip-cta");
const tooltipCountry = document.getElementById("tooltip-country");
const tooltipSpecialist = document.getElementById("tooltip-specialist");
const tooltipDesc = document.getElementById("tooltip-desc");
const tooltipFlag = document.getElementById("tooltip-flag");
const searchInput = document.getElementById("dest-search");
const acDrop = document.getElementById("ac-drop");
const btnGlobe = document.getElementById("btn-globe");
const btnMap = document.getElementById("btn-map");
const destPills = document.querySelectorAll(".dest-pill");

/* ══════════════════════ STATE ══════════════════════ */
let currentView = "globe"; // 'globe' | 'map'
let isTransitioning = false;
let activeRegion = "all";
let rotationTimer = null;
let currentHighlight = null;

/* D3 / projection refs */
let svg, g, pathGen;
let projGlobe, projMap;
let worldData;
let globeRotation = [0, -20, 0];
let allCountryNames = [];

/* ══════════════════════ HERO CANVAS GLOBE ══════════════════════ */
(function initHeroGlobe() {
  const canvas = document.getElementById("hero-globe-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, raf;
  let angle = 0;

  function resize() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    angle += 0.003;
    const cx = w / 2,
      cy = h / 2;
    const r = Math.min(w, h) * 0.43;

    /* Outer glow */
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.2);
    grd.addColorStop(0, "rgba(201,149,106,0.18)");
    grd.addColorStop(0.6, "rgba(201,149,106,0.06)");
    grd.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    /* Sphere outline */
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(201,149,106,0.18)";
    ctx.lineWidth = 0.6;
    ctx.stroke();

    /* Latitude lines */
    for (let lat = -75; lat <= 75; lat += 15) {
      const yr = cy + r * Math.sin((lat * Math.PI) / 180);
      const xr = r * Math.cos((lat * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(cx, yr, xr, xr * 0.18, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(201,149,106,0.09)";
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }

    /* Longitude lines (rotating) */
    for (let i = 0; i < 10; i++) {
      const a = angle + (i / 10) * Math.PI * 2;
      const alpha = 0.05 + 0.06 * Math.abs(Math.cos(a));
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * Math.abs(Math.cos(a)), r, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201,149,106,${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }

    /* Dot clusters (continent silhouettes) */
    const clusters = [
      { dx: 0.28, dy: -0.18, n: 8 }, // North America
      { dx: 0.1, dy: 0.3, n: 5 }, // South America
      { dx: 0.46, dy: -0.05, n: 6 }, // Europe
      { dx: 0.52, dy: 0.18, n: 7 }, // Africa
      { dx: 0.7, dy: -0.1, n: 9 }, // Asia
      { dx: 0.82, dy: 0.28, n: 5 }, // Australia
    ];
    clusters.forEach((cl) => {
      for (let j = 0; j < cl.n; j++) {
        const ox = cl.dx + (j % 3) * 0.04 - 0.04;
        const oy = cl.dy + Math.floor(j / 3) * 0.04 - 0.02;
        const rotX = ox * Math.cos(angle) * r;
        const px = cx + rotX;
        const py = cy + oy * r;
        const visible = Math.cos(angle + ox * 2.5) > -0.2;
        if (!visible) continue;
        const opacity = 0.5 + 0.45 * Math.cos(angle + ox * 2);
        ctx.beginPath();
        ctx.arc(px, py, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,149,106,${Math.max(0, opacity).toFixed(2)})`;
        ctx.fill();
      }
    });

    /* Orbiting plane */
    const t = (Date.now() / 5000) % 1;
    const pa = t * Math.PI * 2;
    const px2 = cx + (r + 12) * Math.cos(pa + angle * 0.5);
    const py2 = cy + (r + 12) * 0.32 * Math.sin(pa + angle * 0.5);
    ctx.save();
    ctx.translate(px2, py2);
    ctx.rotate(pa + 0.8);
    ctx.fillStyle = "rgba(201,149,106,0.95)";
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(3, 2);
    ctx.lineTo(0, 1);
    ctx.lineTo(-3, 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    raf = requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════ LOAD WORLD DATA + BUILD GLOBE/MAP ══════════════════════ */
async function loadAndBuildMap() {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
    );
    worldData = await res.json();
  } catch (e) {
    console.warn("Could not load world-atlas; using fallback placeholder.");
    showFallbackMap();
    return;
  }

  buildD3Scene();
}

function buildD3Scene() {
  const stage = document.getElementById("globe-map-stage");
  const W = stage.clientWidth;
  const H = stage.clientHeight;

  /* ── Projections ── */
  projGlobe = d3
    .geoOrthographic()
    .scale(Math.min(W, H) * 0.38)
    .translate([W / 2, H / 2])
    .clipAngle(90)
    .rotate(globeRotation);

  projMap = d3
    .geoNaturalEarth1()
    .scale(W / 6.2)
    .translate([W / 2, H / 2]);

  pathGen = d3.geoPath().projection(projGlobe);

  /* ── SVG ── */
  svg = d3
    .select("#globe-container")
    .append("svg")
    .attr("width", W)
    .attr("height", H);

  /* Defs: gradient, glow filter */
  const defs = svg.append("defs");
  const radGrd = defs.append("radialGradient").attr("id", "globe-glow");
  radGrd
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "rgba(201,149,106,0.08)");
  radGrd
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "rgba(201,149,106,0)");

  const filter = defs
    .append("filter")
    .attr("id", "country-glow")
    .attr("x", "-20%")
    .attr("y", "-20%")
    .attr("width", "140%")
    .attr("height", "140%");
  filter
    .append("feGaussianBlur")
    .attr("stdDeviation", "3")
    .attr("result", "blur");
  filter
    .append("feComposite")
    .attr("in", "SourceGraphic")
    .attr("in2", "blur")
    .attr("operator", "over");

  /* ── Globe atmosphere ── */
  svg
    .append("circle")
    .attr("class", "globe-atmosphere")
    .attr("cx", W / 2)
    .attr("cy", H / 2)
    .attr("r", projGlobe.scale() + 18)
    .attr("fill", "url(#globe-glow)")
    .attr("stroke", "none");

  /* ── Sphere background ── */
  svg
    .append("path")
    .datum({ type: "Sphere" })
    .attr("class", "sphere")
    .attr("d", pathGen);

  /* ── Graticule ── */
  const graticule = d3.geoGraticule().step([20, 20]);
  svg
    .append("path")
    .datum(graticule())
    .attr("class", "graticule")
    .attr("d", pathGen);

  /* ── Countries ── */
  g = svg.append("g").attr("class", "countries");
  const countries = topojson.feature(worldData, worldData.objects.countries);

  // Build a master list of country names for search/autocomplete:
  // use curated names (NUMERIC_TO_NAME) when available, otherwise fall back
  // to the dataset's country name.
  const nameSet = new Set();
  countries.features.forEach((f) => {
    const idStr = String(f.id);
    const curated = NUMERIC_TO_NAME[idStr];
    const label = curated || f.properties?.name;
    if (label) nameSet.add(label);
  });
  allCountryNames = Array.from(nameSet).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );

  g.selectAll(".country-path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("class", "country-path")
    .attr("d", pathGen)
    .attr("data-id", (d) => d.id)
    .on("mouseenter", function (event, d) {
      const name = NUMERIC_TO_NAME[String(d.id)];
      if (name) d3.select(this).classed("hovered", true);
    })
    .on("mouseleave", function (event, d) {
      d3.select(this).classed("hovered", false);
    })
    .on("click", function (event, d) {
      // If the pointer moved more than the drag threshold, this is a drag-end — ignore
      if (didDrag) {
        didDrag = false;
        return;
      }
      event.stopPropagation();

      const name = NUMERIC_TO_NAME[String(d.id)];

      if (!name) {
        // Country not in curated list — still highlight it + show a generic enquiry card
        const centroid = d3.geoCentroid(d);
        setHighlightByNumericId(String(d.id));
        if (currentView === "globe") {
          rotateTo([-centroid[0], -centroid[1], 0], () => showGenericTooltip(d));
        } else {
          showGenericTooltip(d);
        }
        return;
      }

      if (currentView === "globe") {
        const centroid = d3.geoCentroid(d);
        rotateTo([-centroid[0], -centroid[1], 0], () => showTooltip(name));
      } else {
        // Map view: show tooltip immediately, no rotation needed
        showTooltip(name);
      }
      setHighlight(name);
    });

  /* ── Country borders ── */
  svg
    .append("path")
    .datum(
      topojson.mesh(worldData, worldData.objects.countries, (a, b) => a !== b),
    )
    .attr("class", "country-border")
    .attr("fill", "none")
    .attr("stroke", "rgba(201,149,106,0.12)")
    .attr("stroke-width", "0.3")
    .attr("d", pathGen);

  /* ── Drag to rotate (globe mode only) ── */
  // Track whether the pointer actually moved so we can distinguish a drag from a click.
  let dragStart = null;
  let didDrag = false;
  const DRAG_THRESHOLD = 4; // px — movement below this is treated as a click

  svg.call(
    d3
      .drag()
      .on("start", function (event) {
        if (currentView !== "globe") return;
        stopAutoRotate();
        dragStart = { x: event.x, y: event.y, rot: [...globeRotation] };
        didDrag = false;
      })
      .on("drag", function (event) {
        if (!dragStart || currentView !== "globe") return;
        const dx = event.x - dragStart.x;
        const dy = event.y - dragStart.y;
        if (Math.hypot(dx, dy) > DRAG_THRESHOLD) didDrag = true;
        globeRotation = [
          dragStart.rot[0] + dx * 0.35,
          Math.max(-80, Math.min(80, dragStart.rot[1] - dy * 0.35)),
          dragStart.rot[2],
        ];
        projGlobe.rotate(globeRotation);
        redrawPaths();
      })
      .on("end", function () {
        dragStart = null;
        if (currentView === "globe") startAutoRotate();
      }),
  );

  /* ── Resize handler ── */
  window.addEventListener("resize", () => {
    const W2 = stage.clientWidth,
      H2 = stage.clientHeight;
    svg.attr("width", W2).attr("height", H2);
    projGlobe.translate([W2 / 2, H2 / 2]).scale(Math.min(W2, H2) * 0.38);
    projMap.translate([W2 / 2, H2 / 2]).scale(W2 / 6.2);
    svg
      .select(".globe-atmosphere")
      .attr("cx", W2 / 2)
      .attr("cy", H2 / 2)
      .attr("r", projGlobe.scale() + 18);
    redrawPaths();
  });

  startAutoRotate();
}

/* ── Auto-rotate globe ── */
function startAutoRotate() {
  if (currentView !== "globe") return;
  stopAutoRotate();
  rotationTimer = setInterval(() => {
    globeRotation[0] += 0.18;
    projGlobe.rotate(globeRotation);
    redrawPaths();
  }, 30);
}
function stopAutoRotate() {
  if (rotationTimer) {
    clearInterval(rotationTimer);
    rotationTimer = null;
  }
}

/* ── Redraw all paths with current projection ── */
function redrawPaths() {
  if (!svg) return;
  svg
    .selectAll(".sphere, .graticule, .country-path, .country-border")
    .attr("d", pathGen);
}

/* ── Smooth rotation to a target ── */
function rotateTo(target, callback) {
  stopAutoRotate();
  const start = [...globeRotation];
  const duration = 900;
  const t0 = performance.now();

  function step(t) {
    const elapsed = t - t0;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    globeRotation = [
      start[0] + (target[0] - start[0]) * ease,
      start[1] + (target[1] - start[1]) * ease,
      start[2] + (target[2] - start[2]) * ease,
    ];
    projGlobe.rotate(globeRotation);
    redrawPaths();
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (callback) callback();
      // Resume rotation shortly after landing (no "freeze" on the country).
      setTimeout(startAutoRotate, 350);
    }
  }
  requestAnimationFrame(step);
}

/* ══════════════════════ GLOBE ↔ MAP TRANSITION ══════════════════════ */
function transitionTo(view) {
  if (isTransitioning || view === currentView || !svg) return;
  isTransitioning = true;
  currentView = view;
  stopAutoRotate();

  btnGlobe.classList.toggle("active", view === "globe");
  btnMap.classList.toggle("active", view === "map");

  const stage = document.getElementById("globe-map-stage");
  const W = stage.clientWidth,
    H = stage.clientHeight;

  // Build fresh path generators for each projection — do NOT assign to pathGen yet.
  // pathGen is only swapped once the morph is fully done, so redrawPaths() during
  // the interval-based globe rotation never uses the wrong projection mid-flight.
  const targetProjMap = d3
    .geoNaturalEarth1()
    .scale(W / 6.2)
    .translate([W / 2, H / 2]);
  const targetProjGlobe = d3
    .geoOrthographic()
    .scale(Math.min(W, H) * 0.38)
    .translate([W / 2, H / 2])
    .clipAngle(90)
    .rotate(globeRotation);

  const pathToMap = d3.geoPath().projection(targetProjMap);
  const pathToGlobe = d3.geoPath().projection(targetProjGlobe);

  const DURATION = 950;
  let finishedCount = 0;

  if (view === "map") {
    /* ── Globe → Map ─────────────────────────────────────────────── */

    // 1. Fade out the globe chrome first, slightly before paths start moving
    svg
      .select(".globe-atmosphere")
      .transition()
      .duration(300)
      .attr("opacity", 0);
    svg.select(".sphere").transition().duration(300).attr("opacity", 0);
    svg
      .select(".graticule")
      .transition()
      .duration(300)
      .attr("stroke-opacity", 0);

    // 2. Morph country fills
    const countryNodes = svg.selectAll(".country-path");
    const total = countryNodes.size();

    countryNodes
      .transition()
      .duration(DURATION)
      .ease(d3.easeCubicInOut)
      .attr("d", pathToMap)
      .on("end", function () {
        finishedCount++;
        if (finishedCount === total) {
          // All paths done — NOW swap pathGen and update the border in one frame
          pathGen = pathToMap;
          projMap = targetProjMap;
          svg
            .select(".country-border")
            .attr(
              "d",
              pathToMap(
                topojson.mesh(
                  worldData,
                  worldData.objects.countries,
                  (a, b) => a !== b,
                ),
              ),
            );
          isTransitioning = false;
        }
      });

    // Border stays hidden (opacity 0) while morphing — fade it in after paths finish
    svg
      .select(".country-border")
      .attr("opacity", 0)
      .transition()
      .delay(DURATION + 80)
      .duration(300)
      .attr("opacity", 1);
  } else {
    /* ── Map → Globe ─────────────────────────────────────────────── */

    // 1. Hide border immediately so it doesn't snap during morph
    svg.select(".country-border").attr("opacity", 0);

    // 2. Morph country fills back to globe
    const countryNodes = svg.selectAll(".country-path");
    const total = countryNodes.size();

    countryNodes
      .transition()
      .duration(DURATION)
      .ease(d3.easeCubicInOut)
      .attr("d", pathToGlobe)
      .on("end", function () {
        finishedCount++;
        if (finishedCount === total) {
          pathGen = pathToGlobe;
          projGlobe = targetProjGlobe;
          globeRotation = [...targetProjGlobe.rotate()];

          // Update border geometry and fade it back in
          svg
            .select(".country-border")
            .attr(
              "d",
              pathToGlobe(
                topojson.mesh(
                  worldData,
                  worldData.objects.countries,
                  (a, b) => a !== b,
                ),
              ),
            )
            .transition()
            .duration(300)
            .attr("opacity", 1);

          // Fade globe chrome back in
          svg
            .select(".globe-atmosphere")
            .transition()
            .duration(500)
            .attr("opacity", 1);
          svg.select(".sphere").transition().duration(500).attr("opacity", 1);
          svg
            .select(".graticule")
            .transition()
            .duration(500)
            .attr("stroke-opacity", 1);

          // Ensure sphere path is correct for new projection
          svg
            .select(".sphere")
            .datum({ type: "Sphere" })
            .attr("d", pathToGlobe);

          isTransitioning = false;
          startAutoRotate();
        }
      });
  }
}

/* View toggle buttons */
btnGlobe.addEventListener("click", () => transitionTo("globe"));
btnMap.addEventListener("click", () => transitionTo("map"));

/* ══════════════════════ TOOLTIP ══════════════════════ */
function showTooltip(name) {
  const d = DESTINATIONS[name];
  if (!d) return;
  // No emoji/flag shown in the tooltip header.
  tooltipFlag.textContent = "";
  tooltipCountry.textContent = name;
  tooltipSpecialist.textContent = d.specialist;
  tooltipDesc.textContent = d.desc;
  tooltipCTA.textContent = "Plan My Trip →";
  tooltip.classList.remove("hidden");
  tooltip.classList.add("visible");
}

// For countries not in our curated list — show a friendly get-in-touch card
function showGenericTooltip(feature) {
  const id = String(feature.id);
  // Prefer our curated label; otherwise fall back to the name provided
  // by the TopoJSON data, so every country on the map uses its real name.
  const countryName =
    NUMERIC_TO_COUNTRY_NAME[id] || feature.properties?.name || "This Destination";
  // No emoji/flag shown in the tooltip header.
  tooltipFlag.textContent = "";
  tooltipCountry.textContent = countryName;
  tooltipSpecialist.textContent = "Patricia Kho · Travel Specialist";
  tooltipDesc.textContent =
    "We craft bespoke journeys to this destination and beyond. Speak with our concierge to design your perfect experience.";
  tooltipCTA.textContent = "Enquire Now →";
  tooltip.classList.remove("hidden");
  tooltip.classList.add("visible");
}

function hideTooltip() {
  tooltip.classList.remove("visible");
  tooltip.classList.add("hidden");
  clearHighlight();
}

tooltipClose.addEventListener("click", hideTooltip);
tooltipCTA.addEventListener("click", () => {
  hideTooltip();
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

/* ══════════════════════ COUNTRY HIGHLIGHT ══════════════════════ */
function setHighlight(name) {
  currentHighlight = name;
  const data = DESTINATIONS[name];
  if (!data) return;
  const num =
    ISO_NUMERIC[data.code] && String(parseInt(ISO_NUMERIC[data.code], 10));
  if (!g) return;
  g.selectAll(".country-path")
    .classed("highlighted", (d) => String(d.id) === num)
    .classed("dimmed", (d) => String(d.id) !== num);
}

function setHighlightByNumericId(numericId) {
  currentHighlight = numericId;
  if (!g) return;
  const id = String(numericId);
  g.selectAll(".country-path")
    .classed("highlighted", (d) => String(d.id) === id)
    .classed("dimmed", (d) => String(d.id) !== id);
}

function clearHighlight() {
  currentHighlight = null;
  if (!g) return;
  g.selectAll(".country-path")
    .classed("highlighted", false)
    .classed("dimmed", false);
}

/* ══════════════════════ REGION FILTER ══════════════════════ */
function filterByRegion(region) {
  activeRegion = region;
  if (!g) return;

  if (region === "all") {
    g.selectAll(".country-path")
      .classed("dimmed", false)
      .classed("highlighted", false);
    return;
  }

  const codesInRegion = new Set(
    Object.values(DESTINATIONS)
      .filter((d) => d.region === region)
      .map((d) => ISO_NUMERIC[d.code]),
  );

  g.selectAll(".country-path")
    .classed("highlighted", (d) => codesInRegion.has(String(d.id)))
    .classed("dimmed", (d) => !codesInRegion.has(String(d.id)));
}

destPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    destPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    filterByRegion(pill.dataset.code);
  });
});

/* ══════════════════════ SEARCH / AUTOCOMPLETE ══════════════════════ */
searchInput.addEventListener("input", () => {
  const val = searchInput.value.toLowerCase().trim();
  if (!val) {
    acDrop.classList.remove("open");
    return;
  }
  const matches = allCountryNames.filter((n) =>
    n.toLowerCase().includes(val),
  );
  if (!matches.length) {
    acDrop.classList.remove("open");
    return;
  }
  acDrop.innerHTML = matches
    .map(
      (n) => `<div class="ac-item" data-name="${n}">${n}</div>`,
    )
    .join("");
  acDrop.classList.add("open");
});

acDrop.addEventListener("click", (e) => {
  const item = e.target.closest(".ac-item");
  if (!item) return;
  const name = item.dataset.name;
  searchInput.value = name;
  acDrop.classList.remove("open");

  /* Fly to country on globe, or highlight on map */
  if (!worldData) return;

  const featureCollection = topojson.feature(
    worldData,
    worldData.objects.countries,
  );

  // First, try to resolve via curated destination (by numeric ISO),
  // since we may have richer copy for certain countries.
  const curated = DESTINATIONS[name];
  let feature = null;

  if (curated) {
    const num =
      ISO_NUMERIC[curated.code] &&
      String(parseInt(ISO_NUMERIC[curated.code], 10));
    feature = featureCollection.features.find((f) => String(f.id) === num);
  }

  // If not curated or not found via numeric id, fall back to matching by label.
  if (!feature) {
    feature = featureCollection.features.find(
      (f) => f.properties?.name === name,
    );
  }

  if (!feature) return;

  const centroid = d3.geoCentroid(feature);

  // Curated: use rich tooltip; otherwise a generic enquiry card.
  const showDetails = curated
    ? () => {
        showTooltip(name);
        setHighlight(name);
      }
    : () => {
        showGenericTooltip(feature);
        setHighlightByNumericId(String(feature.id));
      };

  if (currentView === "globe") {
    rotateTo([-centroid[0], -centroid[1], 0], showDetails);
  } else {
    showDetails();
  }
});

document.addEventListener("click", (e) => {
  // Close autocomplete when clicking outside the search wrapper
  if (!e.target.closest(".dest-search-wrap")) acDrop.classList.remove("open");

  // Click-away: hide the tooltip when clicking anywhere except the tooltip itself.
  // Country clicks call stopPropagation(), so they won't immediately close it.
  // This allows clicking on the "ocean"/background of the globe/map to dismiss.
  const inTooltip = e.target.closest("#map-tooltip");
  if (!inTooltip) hideTooltip();
});

/* ══════════════════════ FALLBACK (if no CDN) ══════════════════════ */
function showFallbackMap() {
  globeContainer.innerHTML = `
       <div style="
         width:100%; height:100%;
         display:flex; flex-direction:column;
         align-items:center; justify-content:center;
         color:rgba(201,149,106,0.4); gap:16px;
         font-family:'Cormorant Garamond',serif;
       ">
         <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(201,149,106,0.4)" stroke-width="0.8">
           <circle cx="12" cy="12" r="10"/>
           <line x1="2" y1="12" x2="22" y2="12"/>
           <path d="M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>
         </svg>
         <span style="font-size:1.1rem; letter-spacing:0.2em;">Globe requires network access</span>
         <span style="font-size:0.75rem; font-family:Jost,sans-serif; letter-spacing:0.1em; color:rgba(201,149,106,0.25);">Please connect to the internet to load the interactive globe</span>
       </div>
     `;
}

/* ══════════════════════ TESTIMONIAL SLIDER ══════════════════════ */
(function initTestimonials() {
  let idx = 0;
  const slider = document.getElementById("testi-slider");
  const dots = document.querySelectorAll(".testi-dot");
  const slides = document.querySelectorAll(".testi-slide");
  let autoTimer;

  function goTo(i, stopAuto) {
    idx = (i + slides.length) % slides.length;
    slider.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle("active", j === idx));
    if (stopAuto) {
      clearInterval(autoTimer);
      startAuto();
    }
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(idx + 1), 5500);
  }

  document
    .getElementById("testi-prev")
    .addEventListener("click", () => goTo(idx - 1, true));
  document
    .getElementById("testi-next")
    .addEventListener("click", () => goTo(idx + 1, true));
  dots.forEach((d) =>
    d.addEventListener("click", () => goTo(+d.dataset.i, true)),
  );

  startAuto();
})();

/* ══════════════════════ SCROLL REVEAL ══════════════════════ */
(function initReveal() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
})();

/* ══════════════════════ STAT COUNTER ══════════════════════ */
(function initCounters() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll("[data-target]").forEach((el) => {
          const target = +el.dataset.target;
          const isLarge = target > 100;
          const duration = 2200;
          const start = performance.now();
          function tick(now) {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            el.textContent = isLarge
              ? Math.round(ease * target).toLocaleString()
              : Math.round(ease * target);
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
        obs.disconnect();
      });
    },
    { threshold: 0.3 },
  );

  const statsRow = document.querySelector(".stats-row");
  if (statsRow) obs.observe(statsRow);
})();

/* ══════════════════════ CURSOR ══════════════════════ */
(function initCursor() {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  const hoverTargets =
    "a, button, .service-card, .dest-pill, .country-path, .ac-item, .testi-dot";
  document.addEventListener("mouseover", (e) => {
    if (e.target.matches(hoverTargets) || e.target.closest(hoverTargets)) {
      ring.classList.add("hovering");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.matches(hoverTargets) || e.target.closest(hoverTargets)) {
      ring.classList.remove("hovering");
    }
  });

  function animCursor() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animCursor);
  }
  animCursor();
})();

/* ══════════════════════ NAV SCROLL ══════════════════════ */
window.addEventListener(
  "scroll",
  () => {
    document
      .getElementById("main-nav")
      .classList.toggle("scrolled", window.scrollY > 60);
  },
  { passive: true },
);

/* ══════════════════════ BOOT ══════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  loadAndBuildMap();
});
