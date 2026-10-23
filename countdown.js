// Countdown to the sign-up close date. Any element with data-deadline gets updated.
// Big countdown: has child elements with data-u="d|h|m|s".
// Inline countdown: class "cd-inline", gets text like "8 days" or "5 hrs 12 min".
(function () {
  var big = document.querySelectorAll(".countdown[data-deadline]");
  var inline = document.querySelectorAll(".cd-inline[data-deadline]");
  if (!big.length && !inline.length) return;

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function parts(deadline) {
    var ms = new Date(deadline).getTime() - Date.now();
    if (isNaN(ms) || ms <= 0) return null;
    var s = Math.floor(ms / 1000);
    return {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60
    };
  }

  function tick() {
    for (var i = 0; i < big.length; i++) {
      var el = big[i];
      var p = parts(el.getAttribute("data-deadline"));
      var units = el.querySelector(".cd-units");
      if (!p) {
        if (units) units.hidden = true;
        var label = el.querySelector(".cd-label");
        if (label) label.textContent = "Sign-ups for this class are closed";
        continue;
      }
      if (units) units.hidden = false;
      var cells = el.querySelectorAll("[data-u]");
      for (var j = 0; j < cells.length; j++) {
        var u = cells[j].getAttribute("data-u");
        cells[j].textContent = u === "d" ? String(p.d) : pad(p[u]);
      }
    }
    for (var k = 0; k < inline.length; k++) {
      var q = parts(inline[k].getAttribute("data-deadline"));
      if (!q) {
        inline[k].textContent = "sign-ups closed";
      } else if (q.d >= 1) {
        inline[k].textContent = q.d + (q.d === 1 ? " day" : " days");
      } else {
        inline[k].textContent = q.h + " hrs " + q.m + " min";
      }
    }
  }

  tick();
  setInterval(tick, 1000);
})();

// Keep the countdown bar exactly under the sticky header (header height changes with screen size and fonts).
(function () {
  function setHeaderHeight() {
    var header = document.querySelector(".topbar");
    if (!header) return;
    var height = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty("--hdr", height + "px");
  }
  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);
  window.addEventListener("load", setHeaderHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setHeaderHeight);
  }
})();
