function generateBubbles(e) {
  var t = e;
  $(".js-bubble-container svg") && $(".js-bubble-container svg").remove();
  var s, o = window.innerWidth,
    i = window.innerHeight,
    r = e.sessions[e.sessions.currentType].durations;
  if ($.inArray("HAVE A-BREAK", r) < 0 && $.inArray("SKIP-BREAK", r) < 0 && (e.flags._isBreakTime ? r.push("SKIP-BREAK") : r.push("HAVE A-BREAK")), 1 === r.length) s = 0;
  else {
    var a = r.slice(0, -1).reduce(function(e, t) {
      return e + t
    });
    s = parseInt(a / r.length)
  }
  var n = r.length,
    c = new Array(1),
    d = d3.range(n).map(function(e) {
      var n;
      n = isNaN(r[e]) ? s : r[e];
      var t = Math.floor(1 * Math.random()),
        a = {
          name: r[e],
          cluster: t,
          radius: function(e) {
            var t, a;
            a = 1200 < o ? (t = 50, 110) : 800 < o ? (t = 30, 90) : (t = 30, 40);
            var s = t + 1.4 * n;
            return t + a <= s ? a : s
          }(),
          x: 200 * Math.cos(t / 1 * 2 * Math.PI) + o / 2 + Math.random(),
          y: 200 * Math.sin(t / 1 * 2 * Math.PI) + i / 2 + Math.random()
        };
      return (!c[t] || n > c[t].radius) && (c[t] = a), a
    });
  force = d3.layout.force().nodes(d).size([o, i]).gravity(.4).charge(0).on("tick", function(e) {
    var t, i;
    m.each((i = 10 * e.alpha * e.alpha, function(e) {
      var t = c[e.cluster];
      if (t !== e) {
        var a = e.x - t.x,
          s = e.y - t.y,
          n = Math.sqrt(a * a + s * s),
          o = e.radius + t.radius;
        n !== o && (n = (n - o) / n * i, e.x -= a *= n, e.y -= s *= n, t.x += a, t.y += s)
      }
    })).each((t = d3.geom.quadtree(d), function(d) {
      var e = d.radius + 80 + Math.max(30, 6),
        u = d.x - e,
        m = d.x + e,
        p = d.y - e,
        l = d.y + e;
      t.visit(function(e, t, a, s, n) {
        if (e.point && e.point !== d) {
          var o = d.x - e.point.x,
            i = d.y - e.point.y,
            r = Math.sqrt(o * o + i * i),
            c = d.radius + e.point.radius + (d.cluster === e.point.cluster ? 30 : 6);
          r < c && (r = (r - c) / r * .5, d.x -= o *= r, d.y -= i *= r, e.point.x += o, e.point.y += i)
        }
        return m < t || s < u || l < a || n < p
      })
    })).attr("transform", function(e) {
      return "translate(" + e.x + "," + e.y + ")"
    })
  }).start();
  var u, m = d3.select(".js-bubble-container").append("svg").attr("width", o).attr("height", i).selectAll("circle").data(d).enter().append("g").attr("class", "bubble js-bubble-play").attr("data-duration", function(e) {
    return e.name
  }).call(force.drag);
  m.append("circle").attr("class", "bubble__circle").attr("r", function(e) {
    return e.radius
  }), m.append("text").text(function(e) {
    return e.name
  }).attr("dx", 0).attr("dy", ".35em").attr("y", function(e) {
    return isNaN(e.name) ? e.radius / -6 : 0
  }).attr("class", "bubble__text").attr("font-size", function(e) {
    return isNaN(e.name) ? e.radius / 3.5 : .8 * e.radius
  }).attr("letter-spacing", function(e) {
    if (isNaN(e.name)) return "0.2em"
  }).text(function(e) {
    return e.name
  }).call(function(e, d) {
    e.each(function() {
      for (var e = d3.select(this), t = e.text().split("-").reverse(), a = t.pop(), s = [], n = 0, o = e.attr("y"), i = parseFloat(e.attr("dy")), r = e.text(null).append("tspan").attr("x", 0).attr("y", o).attr("dy", i + "em"); a;) {
        if (s.push(a), r.text(s.join(" ")).attr("dy", function() {
          return 1 <= t.length ? "-0.05em" : i + "em"
        }), r.node().getComputedTextLength() > d && 1 < s.length) {
          s.pop(), r.text(s.join(" ")), s = [a];
          var c = 1.1 * ++n + i;
          r = e.append("tspan").attr("x", 0).attr("y", o).attr("dy", c + "em").text(a)
        }
        a = t.pop()
      }
    })
  }, 40), $(".js-bubble-play").on("click", function() {
    duration = $(this).attr("data-duration"), isNaN(duration) ? skipSessionType() : timerStart(parseInt(duration))
  }), window.onresize = function() {
    clearTimeout(u), u = setTimeout(function() {
      generateBubbles(t)
    }, 200)
  }
}
"serviceWorker" in navigator && window.addEventListener("load", function() {
  navigator.serviceWorker.register("/service-worker.js").then(function(e) {}, function(e) {})
});
var clipboard = function() {
  var e = $("#js-content-clipboard");
  return 0 !== e.length && e.attr("size", e.val().length - 2), new ClipboardJS(".js-copy-clipboard")
}();

function joinCuckoo() {
  var e = Cookies.getJSON("cuckooUser");
  e && e.fullname ? (socket.emit("update user", e.fullname), e.email && socket.emit("change email", e.email)) : $(".js-page--name").fadeIn()
}

function timerStart(e) {
  socket.emit("start timer", e)
}

function timerAction(e) {
  socket.emit(e + " timer")
}

function removeSession(e) {
  var t = $(e).parents(".js-sessions").attr("data-session-type"),
    a = parseInt($(e).parent().text());
  socket.emit("remove session", t, a)
}

function removeRoadmapSession(e) {
  e = $(e).parents(".roadmap__item"), socket.emit("delete roadmap", e.attr("id"))
}

function skipSessionType() {
  socket.emit("skip session")
}

function presetSessions(e) {
  socket.emit("preset session", e)
}

function activateDeactivateRoadmap() {
  socket.emit("activate/deactivate roadmap")
}

function createRoadmapSession(e) {
  socket.emit("create roadmap", e)
}

function clearRoadmap() {
  socket.emit("clear roadmap")
}

function changePieconColor(e) {
  var t;
  t = "#42A5F0" === e ? "#BADEFA" : "#6B6DE2" === e ? "#C9CAF4" : "#FFF", Piecon.setOptions({
    color: e,
    shadow: e,
    background: t
  })
}
Piecon.setOptions({
  color: "#6B6DE2",
  background: "#fff",
  shadow: "#6B6DE2",
  fallback: !1
}), $(".js-join-cuckoo-form").submit(function(e) {
  e.preventDefault();
  var t = $("#username").val();
  socket.emit("update user", t)
}), $(".js-change-username-form").submit(function(e) {
  e.preventDefault();
  var t = $(".js-username").val();
  socket.emit("change username", t)
}), $(".js-change-email-form").submit(function(e) {
  e.preventDefault();
  var t = $(".js-email").val();
  socket.emit("change email", t)
}), $(".js-add-session-form").submit(function(e) {
  e.preventDefault();
  var t = $(this).find("input"),
    a = t.val(),
    s = $(this).attr("data-session-type");
  socket.emit("add session", s, a), t.val("")
}), $(".js-add-roadmap-session").submit(function(e) {
  e.preventDefault();
  var t = $(this).find(".js-roadmap-session-duration"),
    a = $(this).find(".js-roadmap-session-title"),
    s = t.val();
  createRoadmapSession({
    title: a.val(),
    duration: s
  }), t.val(5), a.val("")
}), $(".js-sound-mouseHover").hover(function() {
  Sounds.soundCuckooMouseOver.play()
});
var Notifications = function() {
    var a, e = window.Notify.default,
      t = new e("Cuckoo!", {
        body: "Time to get some rest!",
        icon: "images/desktop-icons/icon-desktop-notification-start-break.png",
        closeOnClick: !0
      }),
      s = new e("Cuckoo!", {
        body: "Time to make something great!",
        icon: "images/desktop-icons/icon-desktop-notification-start-work.png",
        closeOnClick: !0
      });
    return {
      timeToRest: t,
      timeToWork: s,
      verifyPermission: function() {
        e.needsPermission && e.isSupported() && e.requestPermission()
      },
      cuckooNotify: function(e) {
        e.flags._isBreakTime ? (Sounds.soundCuckooFocusEnd.play(), s.show()) : (Sounds.soundCuckooBreakEnd.play(), t.show())
      },
      inAppNotification: function(e, t) {
        e && $(".js-notification").html('<div class="notification">' + e + "</div>"), void 0 !== a && clearTimeout(a), a = setTimeout(function() {
          $(".js-notification").empty()
        }, 1e3 * t)
      }
    }
  }(),
  Shortcut = {
    init: function() {
      key("p, space, r, s, esc", function(e, t) {
        socket && socket.emit("shortcut", t.shortcut), "esc" === t.shortcut && document.body.classList.remove("isSidebarOpened")
      })
    }
  };

function toggleSidebar(e) {
  $(".js-sidebar-content").hide(), $(".js-sidebar-content[data-sidebar-content=" + e + "]").show();
  var t = document.body.classList;
  t.contains("isSidebarOpened") ? $(".js-sidebar").attr("data-content-active") === e && t.remove("isSidebarOpened") : t.add("isSidebarOpened"), $(".js-sidebar").attr("data-content-active", e)
}

function toggleSwitcher(e) {
  $(".js-switcher").attr("data-content-active", e)
}
$(document).click(function(e) {
  $(e.target).closest(".js-checkbox").length || $(".js-checkbox").prop("checked", !1), $(e.target).closest(".js-sidebar").length || document.body.classList.remove("isSidebarOpened")
});
var Sounds = {
  soundCuckooBreakEnd: new buzz.sound("https://cuckoo.team/sounds/cuckoo-break-end.wav", {
    preload: !0
  }),
  soundCuckooFocusEnd: new buzz.sound("https://cuckoo.team/sounds/cuckoo-focus-end.wav", {
    preload: !0
  }),
  soundCuckooMouseOver: new buzz.sound("https://cuckoo.team/sounds/cuckoo-mouse-over.wav", {
    preload: !0
  }),
  soundCuckooMemberJoined: new buzz.sound("https://cuckoo.team/sounds/cuckoo-member-joined.wav", {
    preload: !0
  })
};

function updateCuckoo(e) {
  updateStates(e), updateSettings(e)
}

function updateTimer(e) {
  $(".js-timer").text(e.currentFormatted), $(".js-progress-bar").height(e.currentProgress + "%"), e.current <= 0 ? (Piecon.reset(), document.title = "Cuckoo - Timer for remote teams") : (Piecon.setProgress(e.currentProgress), updateTitleBar(e)), updateRoadmapProgress(e.roadmap)
}

function updateTitleBar(e) {
  e.roadmap ? document.title = e.currentFormatted + " - " + e.roadmap.sessionPurpose : document.title = e.currentFormatted
}

function updateActivity(e) {
  var t = e.activity,
    a = $(".js-activity");
  a.empty();
  for (var s = 0; s < t.length; s++) {
    var n = $('<div class="activity__item"><div class="activity__info">' + t[s].message + '<span class="activity__time">' + t[s].time_since + "</span></div></div>"),
      o = t[s].user;
    n.prepend(createAvatarElement(o)), a.append(n)
  }
}

function updateRoadmap(e) {
  var a = $(".js-roadmaps");
  a.empty(), e.sessions.forEach(function(e) {
    var t = $('<div id="' + e.id + '" class="roadmap__item"><div class="roadmap__duration">' + e.duration + '</div><div class="roadmap__title">' + e.title + '</div><div class="sidebar__delete" onclick="removeRoadmapSession(this)"><img src="images/icon-close-circle.svg"></div></div>');
    e.current && t.addClass("isCurrent"), e.finished && t.addClass("isFinished"), a.append(t)
  })
}

function updateRoadmapProgress(e) {
  e ? ($(".js-roadmap-eta-progress").width(e.currentProgress + "%"), $(".js-roadmap-eta-progress").attr("data-current", e.currentFormatted), $(".js-roadmap-eta-remaining").text(e.remainingFormatted)) : ($(".js-roadmap-eta-progress").width("0%"), $(".js-roadmap-eta-progress").removeAttr("data-current"), $(".js-roadmap-eta-remaining").text("--:--"))
}

function updateStates(e) {
  var t = document.body.classList;
  e.flags._isTimerPaused ? t.add("timerIsPaused") : t.remove("timerIsPaused"), e.flags._isTimerActive ? (t.add("timerIsActive"), dismissBubbles()) : t.remove("timerIsActive"), e.flags._isTimerRunning ? t.add("isTimerIsRunning") : t.remove("isTimerIsRunning"), e.flags._isTimerFinished ? t.add("isTimerFinished") : t.remove("isTimerFinished"), e.flags._isBreakTime ? (changePieconColor("#42A5F0"), t.add("isBreakTime")) : (changePieconColor("#6B6DE2"), t.remove("isBreakTime")), e.flags._isRoadmapActive ? t.add("isRoadmapActive") : t.remove("isRoadmapActive"), e.flags._isMessageOnly ? t.add("isMessageOnly") : t.remove("isMessageOnly"), $(".js-timer-purpose").html(e.sessionPurpose), updateTimer(e.timer)
}

function updateSettings(e) {
  function t(e, t) {
    var a, s = $(".js-sessions[data-session-type=" + t + "]");
    s.children().remove();
    for (var n = 0; n < e.length; n++) a = '<div class="sidebar__session">' + e[n] + '<div class="js-remove-session sidebar__delete" onclick="removeSession(this)"><img src="https://cuckoo.team/images/icon-close-circle.svg"></div></div>', $(s).append(a)
  }
  t(e.sessions.work.durations, "work"), t(e.sessions.breakTime.durations, "breakTime")
}

function updateSessions(e) {
  e.flags._isRoadmapActive || generateBubbles(e)
}

function updateUsers(e) {
  var t = $(".js-team__list"),
    a = $(".js-team__info");
  a.empty(), a.append("<span>" + e.length + " member(s) in this Cuckoo.</span>"), t.find(".avatar").remove(), e.forEach(function(e) {
    t.prepend(createAvatarElement(e))
  })
}

function updateUser(e) {
  Cookies.set("cuckooUser", e, {
    expires: 365
  }), e.fullname && $(".js-username").val(e.fullname), e.email && $(".js-email").val(e.email), $(".js-page--name").fadeOut(), $(".js-avatar").empty(), $(".js-avatar").prepend(createAvatarElement(e))
}

function createAvatarElement(e) {
  var t = $('<div class="avatar"></div>'),
    a = $('<div class="avatar__image"></div>'),
    s = $("<span></span>");
  return e.fullname && a.attr("data-fullname", e.fullname), e.initials && s.attr("data-label", e.initials), e.gravatar && (t.addClass("hasGravatar"), a.css("background-image", "url(" + e.gravatar + "&d=https://cuckoo.team/images/avatar-blank-slate.png)")), e.id === socket.id && (t.addClass("avatar--current-user"), a.attr("data-fullname", e.fullname + " (you)")), "cuckoo" === e && (t.addClass("avatar--cuckoo"), a.attr("data-fullname", e)), a.append(s), t.append(a), t
}

function dismissBubbles() {
  "undefined" != typeof force && -.5 !== force.gravity() && force.gravity(-.5).charge(10).start()
}

function connect() {
  var e = window.location.pathname;
  return socket = io(e), socket.connected
}
Shortcut.init(), Notifications.verifyPermission(), FastClick.attach(document.body), connect(), joinCuckoo(), socket.on("ping", function() {
  socket.emit("pong")
}), socket.on("update timer", function(e) {
  updateTimer(e)
}), socket.on("finish timer", function(e) {
  Notifications.cuckooNotify(e), updateCuckoo(e)
}), socket.on("update user", function(e) {
  updateUser(e)
}), socket.on("update users", function(e) {
  updateUsers(e)
}), socket.on("update sessions", function(e) {
  updateSessions(e)
}), socket.on("update settings", function(e) {
  updateCuckoo(e)
}), socket.on("update activity", function(e) {
  updateActivity(e)
}), socket.on("validation error", function(e) {
  Notifications.inAppNotification(e, 3)
}), socket.on("user joined", function() {
  Sounds.soundCuckooMemberJoined.play()
}), socket.on("update roadmap", function(e) {
  updateRoadmap(e)
});
