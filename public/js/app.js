var SHOWS = {
        uoc: {
          name: "Urgency of Change",
          cover: "https://pbcdn1.podbean.com/imglogo/image-logo/5956680/Podcast-Cover-Art-2025-m.jpg",
          desc: "Carefully chosen extracts on a theme explored by Krishnamurti. 250+ episodes.",
          eps: [
            ["u305", "Krishnamurti on Non-violence", "4 Nov 2026", 62, "https://mcdn.podbean.com/mf/web/mem663c8gp5z2b85/305_Urgency_of_Change8x1gp.mp3"],
            ["u304", "Krishnamurti on Ignorance", "17 Oct 2026", 76, "https://mcdn.podbean.com/mf/web/i87a4es4jsisqmbm/304_Urgency_of_Change92ycd.mp3"],
            ["u303", "Krishnamurti on The Timeless and The Eternal", "7 Oct 2026", 68, "https://mcdn.podbean.com/mf/web/ck5y252kahpzbybp/303_Urgency_of_Changebt47t.mp3"],
            ["u302", "Krishnamurti on Choiceless Awareness", "23 Sep 2026", 64, "https://mcdn.podbean.com/mf/web/fiervt6fsfxue3xf/302_Urgency_of_Change8p709.mp3"],
            ["u301", "Krishnamurti on Concepts", "9 Sep 2026", 71, "https://mcdn.podbean.com/mf/web/56d6igmzgtkdzwqw/301_Urgency_of_Changebwfb8.mp3"],
            ["u300", "Krishnamurti on Harmony", "12 Aug 2026", 72, "https://mcdn.podbean.com/mf/web/hcubs428unude9t2/300_Urgency_of_Changebjg0o.mp3"]
          ]
        },
        kc: {
          name: "The Krishnamurti Collection",
          cover: "https://pbcdn1.podbean.com/imglogo/image-logo/22322522/The_Krishnamurti_Collection_-_Smallbqqkw.jpg",
          desc: "Full-length, unedited recordings from the Foundation's archives. A new series every week.",
          eps: [
            ["c300", "300 • Rajghat 1969 • Discussion with Donald Ingram Smith: Flowering Is Only Possible in Freedom", "14 Nov 2026", 46, "https://mcdn.podbean.com/mf/web/xn2ebvd2zx23ywtd/0300_3KFT_01_RA69CDI_-_Rajghat_1969_-_Dialogue_-_Flowering_is_only_possible_in_freedomanr2r.mp3"],
            ["c299", "299 • Ojai 1984 (6/6) • Talk 4: Is Love Part of Consciousness?", "7 Nov 2026", 79, "https://mcdn.podbean.com/mf/web/w7d27spae9tjapi5/0299_2KC1_04_OJ84T4_-_Ojai_1984_-_Public_Talk_4_-_Is_love_part_of_consciousness9zg7e.mp3"],
            ["c298", "298 • Ojai 1984 (5/6) • Talk 3: Attention Is Like a Fire", "7 Nov 2026", 79, "https://mcdn.podbean.com/mf/web/72fj7e49e4593ad7/0298_1BPS_03_OJ84T3_-_Ojai_1984_-_Public_Talk_3_-_Attention_is_like_a_fire8v3gl.mp3"],
            ["c297", "297 • Ojai 1984 (4/6) • Question & Answer Meeting 2", "7 Nov 2026", 96, "https://mcdn.podbean.com/mf/web/fa7pppr77q3knujf/0297_9KC3_06_OJ84Q2_-_Ojai_1984_-_Public_Q_A_29sud5.mp3"],
            ["c294", "294 • Ojai 1984 (1/6) • Talk 1: Truth Is the Catalyst to End Conflict", "7 Nov 2026", 84, "https://mcdn.podbean.com/mf/web/snuwj82fsrbh6uyv/0294_6UOC_01_OJ84T1_-_Ojai_1984_-_Public_Talk_1_-_Truth_is_the_catalyst_to_end_conflict9uxmm.mp3"]
          ]
        }
      };
      var EPS = {};
      Object.keys(SHOWS).forEach(function (k) {
        var s = SHOWS[k];
        s.eps = s.eps.map(function (e) {
          var ep = { id: e[0], title: e[1], date: e[2], min: e[3], url: e[4], show: k };
          EPS[ep.id] = ep;
          return ep;
        });
      });

      var VIDEOS = {
        kft: {
          name: "KFT Channel",
          list: [
            ["R2qnrj9fssQ", "Do the right thing, whatever others do", "16 Nov 2026"],
            ["D2yzpTDRYxY", "Space means silence", "15 Nov 2026"],
            ["k05pL2MkeHg", "What do we mean by change?", "14 Nov 2026"],
            ["wwt2bQcVykc", "Are you carrying the burden of occupation?", "13 Nov 2026"],
            ["WrmdS6-wbVQ", "We are afraid to be free of mediocrity", "12 Nov 2026"],
            ["YQQyjwwyUvg", "Is relationship an escape from loneliness?", "11 Nov 2026"]
          ]
        },
        off: {
          name: "Official Channel",
          list: [
            ["SNKwpHnW2GI", "Knowledge creates fragmentation", "14 Nov 2026"],
            ["ocRWW0u_JWU", "Audio | Rome 1968 – Discussion – Why are we not aware of the danger of violence?", "10 Nov 2026"],
            ["NUaTzC7s3Sc", "The pursuit of non-fact", "5 Nov 2026"],
            ["Sc-7Dixd2bU", "Audio | Paris 1965 – Public Talk 5 – The root of contradiction is the division", "3 Nov 2026"],
            ["s3R5gc5hvMs", "We are being carefully conditioned", "2 Nov 2026"],
            ["PAoiDrJqvsw", "Audio | Paris 1965 – Public Talk 4 – The process of meditation", "27 Oct 2026"]
          ]
        }
      };
      var VIDS = {};
      Object.keys(VIDEOS).forEach(function (k) {
        VIDEOS[k].list = VIDEOS[k].list.map(function (v) {
          var o = { id: v[0], title: v[1], date: v[2], ch: VIDEOS[k].name, k: k };
          VIDS[o.id] = o;
          return o;
        });
      });

      var QUOTES = [
        ["The act of learning is the act of pure observation, and this observation is not held within the limitation of memory.", "The Whole Movement of Life Is Learning"],
        ["Awareness implies an observation in which there is no choice whatsoever, just observing without interpretation, translation or distortion.", "This Light in Oneself"],
        ["The simplicity is in the observation, not in the problem which may be complex.", "The Flight of the Eagle"],
        ["Observation is not possible if there is any form of prejudice, conclusion or formula.", "Beyond Violence"],
        ["Only when the brain is quiet can there be right observation.", "Krishnamurti's Notebook"]
      ];
      var UP = "https://kfoundation.org/wp-content/uploads/";
      var ARTICLES = [
        ["What Love Is Not", "We don't know how to love, we only know how to think about love.", "https://kfoundation.org/what-love-is-not", UP + "2022/07/black-and-white-photo-portrait-of-j-krishnamurti-on-a-dark-background-looking-at-the-camera.jpg"],
        ["Krishnamurti on Meditation", "Meditation must come naturally, like a flower that blooms. You cannot force it.", "https://kfoundation.org/meditation/", UP + "2022/07/black-and-white-photograph-of-j-krishnamurti-with-trees-in-the-background-looking-to-right.jpg"],
        ["The Root of Fear", "It is only with direct contact with fear that you are free.", "https://kfoundation.org/the-root-of-fear", UP + "2022/07/black-and-white-photograph-of-j-krishnamurti-looking-down-left-with-leaves-background.jpg"],
        ["On Loneliness", "As long as there is self-centred activity, there must be loneliness.", "https://kfoundation.org/on-loneliness", UP + "2022/07/black-and-white-photograph-of-j-krishnamurti-in-indian-clothes-looking-to-right.jpg"],
        ["Krishnamurti on Artificial Intelligence", "If the machine can do everything thought can do, what then is man?", "https://kfoundation.org/krishnamurti-on-ai", UP + "2023/09/K-on-AI-Square.jpg"],
        ["What Is Our Relationship to Nature?", "If you lose relationship with nature, you lose relationship with humanity.", "https://kfoundation.org/what-is-our-relationship-with-nature/", UP + "2022/07/colour-photograph-of-j-krishnamurti-looking-at-the-branches-of-a-tree.jpg"]
      ];
      var GENRES = [["Talk", "1,548"], ["Discussion", "760"], ["Question & Answer", "425"], ["Dialogue", "288"], ["Seminar", "192"], ["Film", "57"], ["Interview", "40"]];
      var START = [
        ["Where to Start", "https://kfoundation.org/start/"],
        ["Biography", "https://kfoundation.org/krishnamurti-biography"],
        ["Free 5-Day Introduction", "https://sub.kfoundation.org/five"]
      ];

      var RETREATS = [
        ["Young Adults Retreat", "young", "20–24 Nov 2026"],
        ["Group Retreat", "group", "27 Nov–1 Dec 2026"],
        ["Silent Retreat", "silent", "19–21 Feb 2027", "3 places left"],
        ["Group Retreat", "group", "26 Feb–2 Mar 2027"],
        ["Weekend Retreat", "weekend", "12–14 Mar 2027"],
        ["Young Adults Retreat", "young", "19–23 Mar 2027"],
        ["Group Retreat", "group", "16–20 Apr 2027"],
        ["Silent Retreat", "silent", "23–25 Apr 2027"],
        ["Group Retreat", "group", "7–11 May 2027"],
        ["Silent Retreat", "silent", "21–23 May 2027"],
        ["Weekend Retreat", "weekend", "4–6 Jun 2027"],
        ["Young Adults Retreat", "young", "18–22 Jun 2027"],
        ["Group Retreat", "group", "2–6 Jul 2027"],
        ["Silent Retreat", "silent", "30 Jul–1 Aug 2027"],
        ["Krishnamurti Gathering", "gathering", "13–18 Aug 2027"],
        ["Weekend Retreat", "weekend", "27–29 Aug 2027"]
      ];
      var RETREAT_DESC = {
        group: "Several days of shared inquiry into the questions Krishnamurti raised: video and audio sessions, dialogue in small groups, and time for walks and quiet in the South Downs.",
        silent: "A weekend held in silence. Video sessions, walks and unhurried time alone, with no discussion and nothing to achieve.",
        young: "A retreat for young adults: video sessions, open dialogue, walks and shared meals with others at a similar stage of life.",
        weekend: "A short retreat over two nights: a good first visit, with video sessions, dialogue and walks in the grounds.",
        gathering: "The Centre's annual Gathering: several days of sessions, dialogue and time together with people who come from many countries."
      };
      var BOOK = "https://krishnamurticentre.innstyle.co.uk";
      (function () {
        var app = document.getElementById("app");
        function $(id) { return document.getElementById(id); }
        function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
        var EXT = ' target="_blank" rel="noopener"'; // only for the map link and the YouTube fallback
        function BR(href, title, book) { return ' href="' + href + '" data-act="browse" data-title="' + esc(title) + '"' + (book ? ' data-book="1"' : ""); }
        var I = {
          play: '<svg class="x-i-play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
          pause: '<svg class="x-i-pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg>',
          heart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
          share: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4M8 8l4-4 4 4M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12"/></svg>',
          ear: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6" rx="1.5"/><rect x="16.5" y="14" width="4" height="6" rx="1.5"/></svg>',
          chev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
          out: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>',
          dl: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/></svg>',
          check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
          search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>',
          close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
        };
        var PP = I.play + I.pause;
        var PP_BIG = PP.replace(/width="18" height="18"/g, 'width="30" height="30"');
        function playBtn(id) {
          return '<button class="x-playbtn" data-act="play" data-ep="' + id + '" aria-label="Play ' + esc(EPS[id].title) + '">' + PP + "</button>";
        }
        function mins(ep) { return ep.min + " min"; }

        var state = { tab: "today", show: "uoc", ch: "kft", topic: null, vfilter: "all", saved: false, downloads: {} };

        // Images that fail keep a soft grey placeholder
        var PH = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"><rect width="4" height="3" fill="#eceeef"/></svg>');
        document.addEventListener("error", function (e) {
          var t = e.target;
          if (t && t.tagName === "IMG" && !t.dataset.failed) { t.dataset.failed = "1"; t.src = PH; }
        }, true);

        /* ---------- Today ---------- */
        function renderToday() {
          var c300 = EPS.c300, u305 = EPS.u305, v = VIDS.R2qnrj9fssQ;
          var todayLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
          var next = upcoming().slice(0, 2);
          $("s-today").innerHTML =
            '<div class="x-pad"><p class="x-smallcaps">' + esc(todayLabel) + "</p></div>" +
            '<article class="x-card x-passage">' +
              '<p class="x-smallcaps" style="color:var(--x-accent)">Today\'s passage</p>' +
              "<blockquote>Only when the brain is quiet can there be right observation.</blockquote>" +
              '<p class="x-meta">Krishnamurti\'s Notebook</p>' +
              '<div class="x-actions">' +
                '<button class="x-act" disabled aria-disabled="true">' + I.ear + "Audio in Daily app</button>" +
                '<button class="x-act' + (state.saved ? " is-on" : "") + '" data-act="save" aria-pressed="' + state.saved + '">' + I.heart + (state.saved ? "Saved" : "Save") + "</button>" +
                '<button class="x-act" data-act="share">' + I.share + "Share</button>" +
              "</div>" +
            "</article>" +
            '<div class="x-sec"><div class="x-sec-head"><h2 class="x-sec-title">New this week</h2></div><div class="x-rail">' +
              newCard("ep", c300.id, SHOWS.kc.cover, "The Krishnamurti Collection", "Rajghat 1969 • Flowering Is Only Possible in Freedom", c300.date + " · " + mins(c300)) +
              newCard("ep", u305.id, SHOWS.uoc.cover, "Urgency of Change", u305.title, u305.date + " · " + mins(u305)) +
              newCard("video", v.id, "https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg", "Video", v.title, v.date + " · KFT Channel") +
            "</div></div>" +
            '<div class="x-sec"><div class="x-sec-head"><h2 class="x-sec-title">Next at the Centre</h2></div>' +
              '<div class="x-card x-centre">' +
                '<p class="x-meta">The Krishnamurti Centre, Brockwood Park</p>' +
                (next.length ? next.map(centreRow).join("") : '<p class="x-meta" style="margin-top:8px">New dates coming soon.</p>') +
                '<button class="x-btn x-btn--block" data-act="tab" data-tab="visit" style="margin-top:12px">See programme</button>' +
              "</div></div>" +
            '<div class="x-sec" id="continue-wrap" hidden><div class="x-sec-head"><h2 class="x-sec-title">Continue listening</h2></div><div id="continue"></div></div>';
          renderContinue();
        }
        function newCard(kind, id, img, label, title, meta) {
          return '<button class="x-card x-newcard" data-act="' + kind + '" data-' + (kind === "ep" ? "ep" : "v") + '="' + id + '">' +
            '<img src="' + img + '" alt="" loading="lazy" />' +
            '<span class="x-nc-body"><span class="x-kind">' + esc(label) + '</span><span class="x-nc-title">' + esc(title) + '</span><span class="x-meta">' + esc(meta) + "</span></span></button>";
        }
        function centreRow(i) {
          var r = RETREATS[i];
          return '<button class="x-centre-row" style="width:100%;text-align:left" data-act="retreat" data-i="' + i + '"><span><span class="x-row-title" style="display:block">' + r[0] + '</span><span class="x-meta">' + r[2] + "</span></span>" + I.chev + "</button>";
        }
        function renderContinue() {
          var wrap = $("continue-wrap");
          if (!wrap || !cur) return;
          wrap.hidden = false;
          $("continue").innerHTML =
            '<div class="x-card x-continue">' +
              '<img src="' + SHOWS[cur.show].cover + '" alt="" />' +
              '<button class="x-c-body" style="text-align:left" data-act="np"><span class="x-row-title x-ellip">' + esc(cur.title) + '</span><span class="x-meta" id="continue-left">' + esc(SHOWS[cur.show].name) + '</span><span class="x-bar"><i class="x-prog"></i></span></button>' +
              playBtn(cur.id) +
            "</div>";
          syncPlay();
          progress();
        }

        /* ---------- Listen ---------- */
        function renderListen() {
          var s = SHOWS[state.show];
          $("s-listen").innerHTML =
            '<div class="x-seg" role="group" aria-label="Podcast">' +
              '<button data-act="lseg" data-k="uoc" class="' + (state.show === "uoc" ? "is-on" : "") + '" aria-pressed="' + (state.show === "uoc") + '">Urgency of Change</button>' +
              '<button data-act="lseg" data-k="kc" class="' + (state.show === "kc" ? "is-on" : "") + '" aria-pressed="' + (state.show === "kc") + '">The Krishnamurti Collection</button>' +
            "</div>" +
            '<div class="x-show"><img src="' + s.cover + '" alt="' + esc(s.name) + ' cover art" /><div><h2>' + esc(s.name) + '</h2><p class="x-meta">' + esc(s.desc) + "</p></div></div>" +
            '<ul class="x-list">' +
              s.eps.map(function (ep) {
                return '<li class="x-row"><button class="x-row-main" data-act="ep" data-ep="' + ep.id + '"><span class="x-row-title">' + esc(ep.title) + '</span><span class="x-meta">' + ep.date + " · " + mins(ep) + (state.downloads[ep.id] ? " · Downloaded" : "") + "</span></button>" + playBtn(ep.id) + "</li>";
              }).join("") +
            "</ul>";
          syncPlay();
        }
        function epDesc(ep) {
          if (ep.show === "uoc") {
            var theme = ep.title.replace("Krishnamurti on ", "");
            return "Extracts from Krishnamurti's talks and dialogues, chosen and brought together on one theme: " + theme.charAt(0).toLowerCase() + theme.slice(1) + ". Part of Urgency of Change, the Foundation's long-running thematic podcast.";
          }
          var parts = ep.title.split(" • ");
          return "A full-length, unedited recording from the Foundation's archives: " + parts.slice(1).join(", ") + ". Part of The Krishnamurti Collection, which releases a new series every week.";
        }
        function openEpisode(id) {
          var ep = EPS[id], s = SHOWS[ep.show];
          openDetail(s.name,
            '<img class="x-detail-cover" src="' + s.cover + '" alt="' + esc(s.name) + ' cover art" />' +
            '<p class="x-kind">' + esc(s.name) + "</p>" +
            "<h1>" + esc(ep.title) + "</h1>" +
            '<p class="x-meta">' + ep.date + " · " + mins(ep) + "</p>" +
            '<div class="x-btnrow">' +
              '<button class="x-btn" data-act="play" data-ep="' + ep.id + '" data-label="1"></button>' +
              dlBtn(ep.id) +
            "</div>" +
            '<p class="x-desc">' + esc(epDesc(ep)) + "</p>");
          syncPlay();
        }
        function dlBtn(id) {
          var on = !!state.downloads[id];
          return '<button class="x-btn x-btn--ghost' + (on ? " is-on" : "") + '" data-act="dl" data-ep="' + id + '" aria-pressed="' + on + '">' + (on ? I.check + "Downloaded" : I.dl + "Download for offline") + "</button>";
        }

        /* ---------- Watch ---------- */
        var TOPICS = ["Fear", "Love", "Freedom", "Meditation", "Relationship"];
        // Prototype filter: match the topic in the title. Production should use tags from the archive.
        var TOPIC_RE = { Fear: /fear|afraid/i, Love: /\blov/i, Freedom: /\bfree/i, Meditation: /meditat/i, Relationship: /relationship/i };
        function renderWatch() {
          var c = VIDEOS[state.ch];
          var list = state.topic ? c.list.filter(function (v) { return TOPIC_RE[state.topic].test(v.title); }) : c.list;
          $("s-watch").innerHTML =
            '<div class="x-seg" role="group" aria-label="Channel">' +
              '<button data-act="wseg" data-k="kft" class="' + (state.ch === "kft" ? "is-on" : "") + '" aria-pressed="' + (state.ch === "kft") + '">Extracts (KFT Channel)</button>' +
              '<button data-act="wseg" data-k="off" class="' + (state.ch === "off" ? "is-on" : "") + '" aria-pressed="' + (state.ch === "off") + '">Full talks (Official Channel)</button>' +
            "</div>" +
            '<div class="x-chips" role="group" aria-label="Topics">' +
              TOPICS.map(function (t) { return '<button class="x-chip' + (state.topic === t ? " is-on" : "") + '" data-act="topic" data-t="' + t + '" aria-pressed="' + (state.topic === t) + '">' + t + "</button>"; }).join("") +
            "</div>" +
            (list.length ? "" : '<p class="x-empty">No recent ' + esc(c.name) + " videos on " + esc(state.topic.toLowerCase()) + ".</p>") +
            '<div class="x-videos">' +
              list.map(function (v) {
                return '<button class="x-video" data-act="video" data-v="' + v.id + '"><span class="x-thumb"><img src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="" loading="lazy" /><span>' + I.play + '</span></span><span class="x-row-title">' + esc(v.title) + '</span><span class="x-meta">' + v.date + " · " + c.name + "</span></button>";
              }).join("") +
            "</div>";
        }
        var IS_PREVIEW = (function () {
          try { return String(window.origin) === "null" || !/^https?:$/.test(location.protocol); } catch (err) { return true; }
        })();
        function ytWatch(id) { return "https://www.youtube.com/watch?v=" + id; }
        function openYouTube(id) {
          if (!audio.paused) audio.pause();
          window.open(ytWatch(id), "_blank", "noopener");
        }
        function ytFrame(v) {
          if (IS_PREVIEW) return posterHtml(v);
          return '<iframe src="https://www.youtube.com/embed/' + v.id + '?playsinline=1&amp;rel=0&amp;autoplay=1" title="' + esc(v.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
        }
        function posterHtml(v) {
          return '<button class="x-poster" data-act="vplay" data-v="' + v.id + '" aria-label="Play ' + esc(v.title) + '"><img src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="" /><span>' + I.play.replace(/width="18" height="18"/, 'width="30" height="30"') + "</span></button>";
        }
        function startVideo(id) {
          var box = $("vplayer");
          if (!box) return;
          if (IS_PREVIEW) { openYouTube(id); return; }
          if (!audio.paused) audio.pause();
          box.innerHTML = ytFrame(VIDS[id]);
        }
        function openVideo(id, autoplay) {
          var v = VIDS[id];
          var desc = v.k === "kft"
            ? "A short extract from Krishnamurti's talks and discussions, published on the KFT Channel."
            : "From the Official Krishnamurti Channel, which publishes full-length talks, discussions and audio from the archive.";
          var rel = VIDEOS[v.k].list.filter(function (o) { return o.id !== v.id; });
          openDetail(v.ch,
            '<div class="x-embed" id="vplayer">' + (autoplay ? ytFrame(v) : posterHtml(v)) + "</div>" +
            '<div class="x-ytbox"><button class="x-btn x-btn--ghost x-btn--block" data-act="yt" data-v="' + v.id + '">' + I.play + " Play on YouTube</button>" +
            '<p class="x-ytnote">Videos play inline once the app is hosted; the preview window blocks YouTube\'s player.</p></div>' +
            '<p class="x-kind" style="margin-top:18px">' + esc(v.ch) + "</p>" +
            "<h1>" + esc(v.title) + "</h1>" +
            '<p class="x-meta">' + v.date + " · " + esc(v.ch) + "</p>" +
            '<p class="x-desc">' + esc(desc) + "</p>" +
            '<div class="x-sec" style="margin-top:22px"><h2 class="x-sec-title">More from the ' + esc(v.ch) + "</h2>" +
              '<ul class="x-rel-list">' +
                rel.map(function (o) {
                  return '<li><button class="x-rel" data-act="vswap" data-v="' + o.id + '"><img src="https://i.ytimg.com/vi/' + o.id + '/mqdefault.jpg" alt="" loading="lazy" /><span style="display:grid;gap:4px"><span class="x-row-title">' + esc(o.title) + '</span><span class="x-meta">' + o.date + "</span></span></button></li>";
                }).join("") +
              "</ul></div>");
          if (autoplay && !audio.paused) audio.pause();
        }

        /* ---------- In-app browser ---------- */
        function openBrowser(href, title, book) {
          var host = href;
          try { host = new URL(href).hostname.replace(/^www\./, ""); } catch (err) {}
          $("br-title").textContent = title || host;
          $("br-domain").textContent = host;
          $("br-out").href = href;
          $("br-banner").hidden = !book;
          $("br-spin").hidden = false;
          $("br-frame").title = title || host;
          $("br-frame").src = href;
          watchFrame();
          openSheet($("browser"));
        }
        var brTimer;
        function watchFrame() {
          clearTimeout(brTimer);
          $("br-fail").hidden = true;
          brTimer = setTimeout(function () {
            if ($("browser").classList.contains("is-open")) { $("br-spin").hidden = true; $("br-fail").hidden = false; }
          }, 8000);
        }
        $("br-frame").addEventListener("load", function () {
          if (this.getAttribute("src") !== "about:blank") { clearTimeout(brTimer); $("br-spin").hidden = true; $("br-fail").hidden = true; }
        });
        function openExternal(url) { window.open(url, "_blank", "noopener"); }

        /* ---------- Book your stay ---------- */
        var RATES = { standard: ["Standard", 100, 110, 612], large: ["Large", 115, 125, 702], flat: ["Flat", 150, 170, 927] };
        var MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
        var bk = { retreat: null, room: "standard", guests: 1, inD: "", outD: "" };
        function retreatDates(s) {
          var m = /^(\d+)(?: (\w{3}))?–(\d+) (\w{3}) (\d{4})$/.exec(s);
          if (!m) return null;
          var y = +m[5], m1 = MON[m[2] || m[4]], m2 = MON[m[4]];
          // A retreat over New Year ("30 Dec–2 Jan 2028") starts in the previous year
          return [new Date(m1 > m2 ? y - 1 : y, m1, +m[1]), new Date(y, m2, +m[3])];
        }
        // Indices of retreats that have not ended yet, so past dates drop off the programme
        function upcoming() {
          var now = new Date(); now.setHours(0, 0, 0, 0);
          return RETREATS.map(function (r, i) { return i; }).filter(function (i) {
            var d = retreatDates(RETREATS[i][2]);
            return !d || d[1] >= now;
          });
        }
        var CLOSURE = [new Date(2027, 0, 4), new Date(2027, 1, 12)]; // annual closure, inclusive
        function hitsClosure(a, b) { return a <= CLOSURE[1] && b > CLOSURE[0]; }
        function parseISO(v) { var p = v.split("-"); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null; }
        function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
        function estimate(a, b, room) {
          var r = RATES[room], nights = Math.round((b - a) / 864e5), total = 0, d = new Date(a);
          var weeks = Math.floor(nights / 7);
          total += weeks * r[3];
          d.setDate(d.getDate() + weeks * 7);
          for (var i = weeks * 7; i < nights; i++) { var w = d.getDay(); total += w === 5 || w === 6 ? r[2] : r[1]; d.setDate(d.getDate() + 1); }
          return { nights: nights, total: total };
        }
        function bkEstimate() {
          var a, b;
          if (bk.retreat !== null) { var rd = retreatDates(RETREATS[bk.retreat][2]); if (rd) { a = rd[0]; b = rd[1]; } }
          else { a = parseISO(bk.inD); b = parseISO(bk.outD); }
          if (!a || !b) return ["Choose your dates to see an estimate", ""];
          var e = estimate(a, b, bk.room);
          if (e.nights < 2) return ["Minimum stay is two nights", ""];
          if (hitsClosure(a, b)) return ["The Centre is closed from 4 January to 12 February 2027", ""];
          return [e.nights + " nights · " + RATES[bk.room][0] + " room, full board", "≈ £" + e.total.toLocaleString("en-GB")];
        }
        function renderBookEst() {
          var e = bkEstimate();
          $("bk-est").innerHTML = "<span>" + e[0] + "</span>" + (e[1] ? "<b>" + e[1] + "</b>" : "");
        }
        function renderBook() {
          var r = bk.retreat !== null ? RETREATS[bk.retreat] : null;
          var today = iso(new Date());
          var html =
            '<div class="x-grab"></div>' +
            '<div class="x-sheet-head"><h2>Book your stay</h2><button class="x-iconbtn" data-act="close-sheets" aria-label="Close">' + I.close + "</button></div>" +
            (r
              ? '<div class="x-bk-fixed" style="margin-top:8px"><b>' + esc(r[0]) + "</b>" + esc(r[2]) + " · The Krishnamurti Centre" + (r[3] ? ' <span class="x-badge">' + esc(r[3]) + "</span>" : "") + "</div>"
              : '<p class="x-bk-label">Individual stay</p><div class="x-bk-dates">' +
                  '<label>Check-in<input type="date" id="bk-in" min="' + today + '" value="' + bk.inD + '" /></label>' +
                  '<label>Check-out<input type="date" id="bk-out" min="' + today + '" value="' + bk.outD + '" /></label>' +
                '</div><p class="x-meta" style="margin-top:8px">Minimum stay two nights.</p>') +
            '<p class="x-bk-label">Room type</p><div class="x-seg" role="group" aria-label="Room type">' +
              Object.keys(RATES).map(function (k) {
                var on = bk.room === k;
                return '<button data-act="bk-room" data-k="' + k + '" class="' + (on ? "is-on" : "") + '" aria-pressed="' + on + '">' + RATES[k][0] + "<small>£" + RATES[k][1] + "–£" + RATES[k][2] + "</small></button>";
              }).join("") +
            "</div>" +
            '<p class="x-bk-label">Guests</p><div class="x-seg" role="group" aria-label="Guests">' +
              [1, 2].map(function (n) {
                var on = bk.guests === n, dis = n === 2 && bk.room !== "flat";
                return '<button data-act="bk-guests" data-n="' + n + '" class="' + (on ? "is-on" : "") + '" aria-pressed="' + on + '"' + (dis ? " disabled" : "") + ">" + n + (n === 1 ? " guest" : " guests") + (n === 2 ? "<small>Flat only</small>" : "") + "</button>";
              }).join("") +
            "</div>" +
            '<div class="x-bk-est" id="bk-est" aria-live="polite"></div>' +
            '<p style="font:500 14px/1.45 var(--sans);margin-top:10px">£100 non-refundable deposit secures your place.</p>' +
            '<button class="x-btn x-btn--block" style="margin-top:18px;min-height:50px" data-act="bk-go">Continue to secure booking</button>' +
            '<p class="x-bk-small">Payment is taken securely by Inn Style. In the app this opens inside an in-app browser.</p>';
          $("book-sheet").innerHTML = html;
          renderBookEst();
        }
        function openBook(i) {
          bk.retreat = i === undefined ? null : i;
          bk.room = "standard";
          bk.guests = 1;
          renderBook();
          openSheet($("book-sheet"));
        }
        $("book-sheet").addEventListener("change", function (e) {
          if (e.target.id === "bk-in") {
            bk.inD = e.target.value;
            var a = parseISO(bk.inD);
            if (a) {
              a.setDate(a.getDate() + 2);
              $("bk-out").min = iso(a);
              if (!bk.outD || parseISO(bk.outD) < a) { bk.outD = iso(a); $("bk-out").value = bk.outD; }
            }
          }
          if (e.target.id === "bk-out") bk.outD = e.target.value;
          renderBookEst();
        });

        /* ---------- Read ---------- */
        function renderRead() {
          $("s-read").innerHTML =
            '<label class="x-search">' + I.search + '<input id="search" type="search" placeholder="Search talks, articles, quotes…" aria-label="Search talks, articles, quotes" autocomplete="off" /></label>' +
            '<p class="x-note" id="search-note" hidden>In the full app this searches podcasts, videos and transcripts too</p>' +
            '<div class="x-sec" data-sec><div class="x-sec-head"><h2 class="x-sec-title">Quotes on Observation</h2></div><div class="x-rail">' +
              QUOTES.map(function (q) { return '<figure class="x-quote" style="margin:0" data-q="' + esc((q[0] + " " + q[1]).toLowerCase()) + '"><p>' + esc(q[0]) + '</p><figcaption class="x-meta">' + esc(q[1]) + "</figcaption></figure>"; }).join("") +
            "</div></div>" +
            '<div class="x-sec" data-sec><div class="x-sec-head"><h2 class="x-sec-title">Articles</h2></div>' +
              ARTICLES.map(function (a) { return '<a class="x-article"' + BR(a[2], a[0]) + ' data-q="' + esc((a[0] + " " + a[1]).toLowerCase()) + '"><img src="' + a[3] + '" alt="" loading="lazy" /><div><h3>' + esc(a[0]) + "</h3><p>‘" + esc(a[1]) + "’</p></div></a>"; }).join("") +
            "</div>" +
            '<div class="x-sec" data-sec><div class="x-sec-head"><h2 class="x-sec-title">Browse the archive</h2></div><div class="x-grid">' +
              GENRES.map(function (g) { return '<a class="x-tile"' + BR("https://kfoundation.org/video", g[0] + "s in the archive") + ' data-q="' + esc(g[0].toLowerCase()) + '"><b>' + esc(g[0]) + "</b><span>" + g[1] + "</span></a>"; }).join("") +
            "</div></div>" +
            '<div class="x-sec" data-sec><div class="x-sec-head"><h2 class="x-sec-title">Start here</h2></div><div style="border-top:1px solid var(--x-line)">' +
              START.map(function (s) { return '<a class="x-linkrow"' + BR(s[1], s[0]) + ' data-q="' + esc(s[0].toLowerCase()) + '">' + esc(s[0]) + I.chev + "</a>"; }).join("") +
            "</div></div>" +
            '<p class="x-empty" id="search-empty" hidden>Nothing on this tab matches.</p>';
          $("search").addEventListener("input", function () {
            var q = this.value.trim().toLowerCase(), any = false;
            $("search-note").hidden = !q;
            [].forEach.call($("s-read").querySelectorAll("[data-sec]"), function (sec) {
              var shown = 0;
              [].forEach.call(sec.querySelectorAll("[data-q]"), function (el) {
                var ok = !q || el.getAttribute("data-q").indexOf(q) > -1;
                el.hidden = !ok;
                if (ok) shown++;
              });
              sec.hidden = !shown;
              if (shown) any = true;
            });
            $("search-empty").hidden = any;
          });
        }

        /* ---------- Visit ---------- */
        var VF = [["all", "All"], ["group", "Group"], ["silent", "Silent"], ["young", "Young Adults"], ["weekend", "Weekend"], ["gathering", "Gathering"]];
        var CU = "https://krishnamurticentre.org.uk/wp-content/uploads/2020/05/";
        function renderVisit() {
          $("s-visit").innerHTML =
            '<div class="x-hero"><img src="' + CU + '2-gallery-1-SFW.jpg" alt="The Krishnamurti Centre at Brockwood Park" /><div><h1>The Krishnamurti Centre</h1><p>Quiet retreats in the South Downs National Park. A place of no authority, where nothing is imposed.</p></div></div>' +
            '<div class="x-strip">' +
              '<figure><img src="' + CU + '2-gallery-4-SFW.jpg" alt="The sitting room" loading="lazy" /><figcaption>Sitting room</figcaption></figure>' +
              '<figure><img src="' + CU + '2-gallery-5-SFW.jpg" alt="The library" loading="lazy" /><figcaption>Library</figcaption></figure>' +
              '<figure><img src="' + CU + '7-grove-SFW.jpg" alt="The Grove" loading="lazy" /><figcaption>The Grove</figcaption></figure>' +
            "</div>" +
            '<div class="x-sec" id="programme"><div class="x-sec-head"><h2 class="x-sec-title">Programme</h2></div>' +
              '<div class="x-chips" style="padding-top:0" role="group" aria-label="Retreat type" id="vchips"></div>' +
              '<ul class="x-list" id="retreats"></ul>' +
            "</div>" +
            '<div class="x-sec"><div class="x-card x-info"><h3>Individual stays</h3>' +
              '<table class="x-tbl"><thead><tr><th scope="col">Per night</th><th scope="col">Standard</th><th scope="col">Large</th><th scope="col">Flat</th></tr></thead><tbody>' +
                '<tr><th scope="row">Weekday<small>Sun–Thu</small></th><td>£100</td><td>£115</td><td>£150</td></tr>' +
                '<tr><th scope="row">Weekend<small>Fri–Sat</small></th><td>£110</td><td>£125</td><td>£170</td></tr>' +
                '<tr><th scope="row">Week<small>7 nights</small></th><td>£612</td><td>£702</td><td>£927</td></tr>' +
              "</tbody></table>" +
              "<p>Minimum stay two nights. Full board. Three reduced-price rooms at £80 (£90 Fri/Sat).</p>" +
              '<button class="x-btn x-btn--block" style="margin-top:14px" data-act="book">Check availability</button>' +
            "</div></div>" +
            '<div class="x-sec"><div class="x-card x-info"><h3>Day visits</h3>' +
              '<dl class="x-dl"><dt>With lunch</dt><dd>£20</dd><dt>With supper</dt><dd>£15</dd><dt>Lunch and supper</dt><dd>£35</dd><dt>Study facilities only</dt><dd>Free</dd></dl>' +
              "<p>Donations welcome. Book by phone.</p>" +
              '<a class="x-btn x-btn--ghost x-btn--block" style="margin-top:14px" href="tel:+441962771748">Call +44 (0)1962 771748</a>' +
            "</div></div>" +
            '<p class="x-closure">Annual closure: 4 January to 12 February 2027</p>' +
            '<div class="x-sec" style="border-top:1px solid var(--x-line)">' +
              '<a class="x-linkrow" href="' + BOOK + '/gift-vouchers" data-act="ext">Gift vouchers' + I.out + "</a>" +
              '<div class="x-info" style="margin:0;padding:16px 20px"><h3>Getting here</h3>' +
                '<p style="margin-top:0">11 miles from Winchester. Trains from London Waterloo to Petersfield or Winchester. About an hour from Heathrow.</p>' +
                '<a class="x-btn x-btn--ghost" style="margin-top:12px" href="https://www.google.com/maps/search/?api=1&amp;query=Krishnamurti%20Centre%2C%20Brockwood%20Park%2C%20Bramdean%2C%20Alresford%20SO24%200LQ"' + EXT + ">Open in Maps " + I.out + "</a>" +
              "</div>" +
            "</div>";
          renderRetreats();
        }
        function renderRetreats() {
          $("vchips").innerHTML = VF.map(function (f) { return '<button class="x-chip' + (state.vfilter === f[0] ? " is-on" : "") + '" data-act="vfilter" data-f="' + f[0] + '" aria-pressed="' + (state.vfilter === f[0]) + '">' + f[1] + "</button>"; }).join("");
          var open = upcoming();
          $("retreats").innerHTML = RETREATS.map(function (r, i) {
            if (open.indexOf(i) < 0) return "";
            if (state.vfilter !== "all" && r[1] !== state.vfilter) return "";
            return '<li><button class="x-row" style="width:100%;text-align:left" data-act="retreat" data-i="' + i + '"><span class="x-row-main"><span class="x-row-title">' + r[0] + '</span><span class="x-meta">' + r[2] + "</span></span>" + (r[3] ? '<span class="x-badge">' + r[3] + "</span>" : "") + I.chev + "</button></li>";
          }).join("");
        }
        function openRetreat(i) {
          var r = RETREATS[i];
          $("retreat-sheet").innerHTML =
            '<div class="x-grab"></div>' +
            '<div class="x-sheet-head"><h2>' + r[0] + '</h2><button class="x-iconbtn" data-act="close-sheets" aria-label="Close">' + I.close + "</button></div>" +
            '<p class="x-meta" style="display:flex;gap:8px;align-items:center">' + r[2] + " · The Krishnamurti Centre" + (r[3] ? ' <span class="x-badge">' + r[3] + "</span>" : "") + "</p>" +
            '<p class="x-desc" style="font:400 15px/1.55 var(--sans);color:#3b3f41;margin-top:14px">' + RETREAT_DESC[r[1]] + "</p>" +
            '<p style="font:500 14px/1.45 var(--sans);margin-top:12px">Full board, vegetarian. £100 non-refundable deposit secures your place.</p>' +
            '<button class="x-btn x-btn--block" style="margin-top:18px;min-height:50px" data-act="book" data-i="' + i + '">Book this retreat</button>' +
            '<div class="x-btnrow" style="margin-top:10px">' +
              '<button class="x-btn x-btn--ghost" style="flex:1" data-act="cal">Add to calendar</button>' +
              '<a class="x-btn x-btn--ghost" style="flex:1" href="mailto:info@krishnamurticentre.org.uk?subject=' + encodeURIComponent(r[0] + ", " + r[2]) + '">Ask a question</a>' +
            "</div>" +
            '<p class="x-meta" style="margin-top:14px">Book without leaving the app.</p>';
          openSheet($("retreat-sheet"));
        }
        /* ---------- Player ---------- */
        var audio = $("audio"), cur = null, rate = 1, dragging = false;
        $("mini-play").innerHTML = PP;
        $("np-play").innerHTML = PP_BIG;
        function fmt(s) {
          s = Math.max(0, Math.floor(s || 0));
          var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
          return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (x < 10 ? "0" : "") + x;
        }
        function dur() { return audio.duration && isFinite(audio.duration) ? audio.duration : cur ? cur.min * 60 : 0; }
        function playEp(id) {
          var ep = EPS[id];
          if (cur !== ep) {
            cur = ep;
            audio.src = ep.url;
            audio.playbackRate = rate;
            setNow();
          }
          if (audio.paused) {
            var p = audio.play();
            if (p && p.catch) p.catch(function (err) { if (err && err.name !== "AbortError") toast("Playback could not start. Check your connection."); syncPlay(); });
          } else audio.pause();
          syncPlay();
        }
        function toggle() { if (cur) playEp(cur.id); }
        function setNow() {
          var s = SHOWS[cur.show];
          $("mini").hidden = false;
          app.classList.add("has-player");
          $("mini-art").src = s.cover;
          $("mini-title").textContent = cur.title;
          $("mini-show").textContent = s.name;
          $("np-art").src = s.cover;
          $("np-art").alt = s.name + " cover art";
          $("np-show").textContent = s.name;
          $("np-title").textContent = cur.title;
          mediaSession();
          renderContinue();
          progress();
        }
        function syncPlay() {
          var playing = !!cur && !audio.paused;
          [].forEach.call(app.querySelectorAll('[data-act="play"][data-ep]'), function (b) {
            var on = playing && cur.id === b.getAttribute("data-ep");
            b.classList.toggle("is-playing", on);
            if (b.hasAttribute("data-label")) b.innerHTML = on ? I.pause.replace('class="x-i-pause"', "") + "Pause" : I.play.replace('class="x-i-play"', "") + (cur && cur.id === b.getAttribute("data-ep") && audio.currentTime > 0 ? "Resume" : "Play episode");
            else b.setAttribute("aria-label", (on ? "Pause " : "Play ") + EPS[b.getAttribute("data-ep")].title);
          });
          ["mini-play", "np-play"].forEach(function (id) {
            $(id).classList.toggle("is-playing", playing);
            $(id).setAttribute("aria-label", playing ? "Pause" : "Play");
          });
        }
        function progress() {
          if (!cur) return;
          var d = dur(), t = audio.currentTime || 0, pct = d ? Math.min(100, (t / d) * 100) : 0;
          [].forEach.call(app.querySelectorAll(".x-prog"), function (el) { el.style.width = pct + "%"; });
          if (!dragging) {
            $("np-range").value = Math.round(pct * 10);
            $("np-cur").textContent = fmt(t);
          }
          $("np-rem").textContent = "-" + fmt(d - t);
          var left = $("continue-left");
          if (left) left.textContent = SHOWS[cur.show].name + " · " + Math.max(1, Math.ceil((d - t) / 60)) + " min left";
        }
        ["play", "pause", "ended", "playing"].forEach(function (ev) { audio.addEventListener(ev, syncPlay); });
        audio.addEventListener("timeupdate", progress);
        audio.addEventListener("loadedmetadata", function () { audio.playbackRate = rate; progress(); });
        // A broken or expired MP3 URL fires "error", not a rejected play() promise
        audio.addEventListener("error", function () { if (cur) { toast("This episode could not load. Try again later."); syncPlay(); } });

        // Lock-screen and headphone controls (Media Session API, supported by iOS Safari 15+ and Chrome)
        function mediaSession() {
          if (!("mediaSession" in navigator) || !cur || !window.MediaMetadata) return;
          var s = SHOWS[cur.show];
          navigator.mediaSession.metadata = new MediaMetadata({ title: cur.title, artist: "J. Krishnamurti", album: s.name, artwork: [{ src: s.cover, sizes: "512x512" }] });
        }
        if ("mediaSession" in navigator) {
          var ms = navigator.mediaSession, h = function (a, f) { try { ms.setActionHandler(a, f); } catch (err) {} };
          h("play", function () { if (cur && audio.paused) toggle(); });
          h("pause", function () { if (cur && !audio.paused) toggle(); });
          h("seekbackward", function () { audio.currentTime = Math.max(0, audio.currentTime - 15); });
          h("seekforward", function () { audio.currentTime = Math.min(dur(), audio.currentTime + 30); });
        }
        $("np-range").addEventListener("input", function () {
          dragging = true;
          $("np-cur").textContent = fmt((this.value / 1000) * dur());
        });
        $("np-range").addEventListener("change", function () {
          dragging = false;
          if (cur) audio.currentTime = (this.value / 1000) * dur();
          progress();
        });

        /* ---------- Navigation, sheets, toast ---------- */
        var detail = $("detail");
        function openDetail(label, html) {
          $("detail-label").textContent = label;
          $("detail-body").innerHTML = html;
          $("detail-body").scrollTop = 0;
          detail.classList.add("is-open");
          detail.setAttribute("aria-hidden", "false");
        }
        function closeDetail() {
          if (!detail.classList.contains("is-open")) return;
          detail.classList.remove("is-open");
          detail.setAttribute("aria-hidden", "true");
          setTimeout(function () { if (!detail.classList.contains("is-open")) $("detail-body").innerHTML = ""; }, 360);
        }
        function switchTab(t) {
          closeDetail();
          closeSheets();
          state.tab = t;
          [].forEach.call(app.querySelectorAll(".x-screen"), function (s) { s.classList.toggle("is-active", s.id === "s-" + t); });
          [].forEach.call(app.querySelectorAll(".x-tab"), function (b) {
            var on = b.getAttribute("data-tab") === t;
            b.classList.toggle("is-on", on);
            if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
          });
        }
        function openSheet(el) {
          closeSheets(true);
          $("scrim").classList.add("is-open");
          el.classList.add("is-open");
          el.setAttribute("aria-hidden", "false");
          el.scrollTop = 0;
        }
        function closeSheets(keepScrim) {
          [].forEach.call(app.querySelectorAll(".x-sheet.is-open"), function (s) { s.classList.remove("is-open"); s.setAttribute("aria-hidden", "true"); });
          if (keepScrim !== true) $("scrim").classList.remove("is-open");
          setTimeout(function () {
            if (!$("browser").classList.contains("is-open") && $("br-frame").getAttribute("src") !== "about:blank") $("br-frame").src = "about:blank";
          }, 360);
        }
        var toastTimer;
        function toast(msg) {
          var t = $("toast");
          t.textContent = msg;
          t.classList.add("is-on");
          clearTimeout(toastTimer);
          toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 2400);
        }

        app.addEventListener("click", function (e) {
          var el = e.target.closest("[data-act]");
          if (!el) {
            if (e.target.closest("#mini")) openSheet($("np-sheet"));
            return;
          }
          var act = el.getAttribute("data-act");
          switch (act) {
            case "tab": switchTab(el.getAttribute("data-tab")); break;
            case "menu": openSheet($("menu-sheet")); break;
            case "close-sheets": closeSheets(); break;
            case "back": closeDetail(); break;
            case "play": playEp(el.getAttribute("data-ep")); break;
            case "toggle": toggle(); break;
            case "np": openSheet($("np-sheet")); break;
            case "ep": openEpisode(el.getAttribute("data-ep")); break;
            case "video": openVideo(el.getAttribute("data-v")); break;
            case "vplay": startVideo(el.getAttribute("data-v")); break;
            case "yt": openYouTube(el.getAttribute("data-v")); break;
            case "vswap": openVideo(el.getAttribute("data-v"), true); break;
            case "browse":
              e.preventDefault();
              openBrowser(el.getAttribute("href"), el.getAttribute("data-title"), el.hasAttribute("data-book"));
              break;
            case "br-reload":
              $("br-spin").hidden = false;
              var fr = $("br-frame"), u = fr.getAttribute("src");
              fr.src = "about:blank";
              setTimeout(function () { fr.src = u; }, 30);
              watchFrame();
              break;
            case "br-open": openExternal($("br-out").href); break;
            case "ext": e.preventDefault(); openExternal(el.getAttribute("href")); break;
            case "book": openBook(el.hasAttribute("data-i") ? +el.getAttribute("data-i") : undefined); break;
            case "bk-room":
              bk.room = el.getAttribute("data-k");
              if (bk.room !== "flat") bk.guests = 1;
              renderBook();
              break;
            case "bk-guests": bk.guests = +el.getAttribute("data-n"); renderBook(); break;
            case "bk-go": openBrowser(BOOK, "Book your stay", true); break;
            case "retreat": openRetreat(+el.getAttribute("data-i")); break;
            case "save":
              state.saved = !state.saved;
              el.classList.toggle("is-on", state.saved);
              el.setAttribute("aria-pressed", state.saved);
              el.innerHTML = I.heart + (state.saved ? "Saved" : "Save");
              toast(state.saved ? "Saved to your passages" : "Removed from saved");
              break;
            case "share":
              var text = "“Only when the brain is quiet can there be right observation.” Krishnamurti's Notebook";
              if (navigator.share) navigator.share({ title: "Today's passage", text: text }).catch(function () {});
              else if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast("Passage copied to share"); }, function () { toast("Sharing opens the share sheet on iPhone"); });
              else toast("Sharing opens the share sheet on iPhone");
              break;
            case "dl":
              var id = el.getAttribute("data-ep");
              state.downloads[id] = !state.downloads[id];
              el.outerHTML = dlBtn(id);
              toast(state.downloads[id] ? "Downloaded for offline listening (simulated)" : "Download removed");
              renderListen();
              break;
            case "lseg": state.show = el.getAttribute("data-k"); renderListen(); break;
            case "wseg": state.ch = el.getAttribute("data-k"); renderWatch(); break;
            case "topic":
              var t = el.getAttribute("data-t");
              state.topic = state.topic === t ? null : t;
              renderWatch();
              break;
            case "vfilter": state.vfilter = el.getAttribute("data-f"); renderRetreats(); break;
            case "skip":
              if (cur) { audio.currentTime = Math.max(0, Math.min(dur(), (audio.currentTime || 0) + +el.getAttribute("data-s"))); progress(); }
              break;
            case "speed":
              rate = +el.getAttribute("data-r");
              audio.playbackRate = rate;
              audio.defaultPlaybackRate = rate;
              [].forEach.call(el.parentNode.children, function (b) { b.classList.toggle("is-on", b === el); });
              break;
            case "cal": toast("Added to your calendar (simulated)"); break;
          }
        });
        document.addEventListener("keydown", function (e) {
          if (e.key !== "Escape") return;
          if (app.querySelector(".x-sheet.is-open")) closeSheets();
          else closeDetail();
        });

        renderToday();
        renderListen();
        renderWatch();
        renderRead();
        renderVisit();
        switchTab("today");
      })();
