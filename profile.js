/* =========================================================
   PROFILE SUMMARY PANEL - behaviour
   1) open/close the sidebar (button, overlay click, Esc)
   2) draw the BrainsFirst 16-skill spider chart as inline SVG
   ========================================================= */
(function () {
  "use strict";

  var openBtn = document.getElementById("profile-toggle");
  var closeBtn = document.getElementById("profile-close");
  var overlay = document.getElementById("profile-overlay");
  var panel = document.getElementById("profile-panel");

  if (!openBtn || !panel || !overlay) return;

  function onKeydown(e) {
    if (e.key === "Escape") closePanel();
  }

  function openPanel() {
    document.body.classList.add("profile-open");
    panel.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", onKeydown);
    if (closeBtn) closeBtn.focus();
  }

  function closePanel() {
    document.body.classList.remove("profile-open");
    panel.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onKeydown);
    openBtn.focus();
  }

  openBtn.addEventListener("click", openPanel);
  if (closeBtn) closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);

  // ---------------------------------------------------------
  // Spider chart - BrainsFirst NeurOlympics, 16 cognitive skills
  // Scores 0-100, normed against BrainsFirst's comparison group.
  // Order matches the spider graph in the original report.
  // ---------------------------------------------------------
  var skills = [
    { name: "Concentrating", score: 30 },
    { name: "Blocking", score: 25 },
    { name: "Dividing", score: 21 },
    { name: "Anticipating", score: 41 },
    { name: "Capacity", score: 70 },
    { name: "Eye for detail", score: 70 },
    { name: "Processing speed", score: 38 },
    { name: "Prioritizing", score: 89 },
    { name: "Consistency", score: 100 },
    { name: "Action speed", score: 11 },
    { name: "Precision", score: 93 },
    { name: "Grit", score: 48 },
    { name: "Self-control", score: 93 },
    { name: "Switching", score: 77 },
    { name: "Directing", score: 70 },
    { name: "Letting go", score: 68 }
  ];

  var svg = document.getElementById("brain-spider");
  if (svg && !svg.dataset.built) {
    var svgNS = "http://www.w3.org/2000/svg";
    var cx = 280, cy = 230, maxR = 150;
    var n = skills.length;

    function angle(i) { return -Math.PI / 2 + i * (2 * Math.PI / n); }
    function pt(i, r) {
      var a = angle(i);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    }

    // grid rings
    [0.25, 0.5, 0.75, 1].forEach(function (frac) {
      var points = skills.map(function (_, i) { return pt(i, maxR * frac).join(","); }).join(" ");
      var poly = document.createElementNS(svgNS, "polygon");
      poly.setAttribute("points", points);
      poly.setAttribute("class", "spider-ring");
      svg.appendChild(poly);
    });

    // spokes
    skills.forEach(function (_, i) {
      var p = pt(i, maxR);
      var line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", cx); line.setAttribute("y1", cy);
      line.setAttribute("x2", p[0]); line.setAttribute("y2", p[1]);
      line.setAttribute("class", "spider-spoke");
      svg.appendChild(line);
    });

    // data polygon
    var dataPoints = skills.map(function (s, i) { return pt(i, maxR * (s.score / 100)).join(","); }).join(" ");
    var dataPoly = document.createElementNS(svgNS, "polygon");
    dataPoly.setAttribute("points", dataPoints);
    dataPoly.setAttribute("class", "spider-data");
    svg.appendChild(dataPoly);

    // dots with tooltip
    skills.forEach(function (s, i) {
      var p = pt(i, maxR * (s.score / 100));
      var dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", p[0]); dot.setAttribute("cy", p[1]); dot.setAttribute("r", 3.5);
      dot.setAttribute("class", "spider-dot");
      var title = document.createElementNS(svgNS, "title");
      title.textContent = s.name + ": " + s.score + "/100";
      dot.appendChild(title);
      svg.appendChild(dot);
    });

    // labels
    skills.forEach(function (s, i) {
      var p = pt(i, maxR + 26);
      var a = angle(i);
      var cos = Math.cos(a), sin = Math.sin(a);
      var text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", p[0]); text.setAttribute("y", p[1]);
      var anchor = "middle";
      if (cos > 0.15) anchor = "start";
      else if (cos < -0.15) anchor = "end";
      text.setAttribute("text-anchor", anchor);
      text.setAttribute("dominant-baseline", sin > 0.75 ? "hanging" : (sin < -0.75 ? "auto" : "middle"));
      text.setAttribute("class", "spider-label");
      text.textContent = s.name;
      svg.appendChild(text);
    });

    svg.setAttribute("viewBox", "0 0 560 480");
    svg.dataset.built = "true";
  }
})();
