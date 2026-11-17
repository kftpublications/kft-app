      var SHOWS = {
        uoc: {
          name: "Urgency of Change",
          cover: "https://pbcdn1.podbean.com/imglogo/image-logo/5956680/Podcast-Cover-Art-2025-m.jpg",
          desc: "Carefully chosen extracts on a theme explored by Krishnamurti.",
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
      // Daily readings play through the same player; their list comes only from data/daily.json
      SHOWS.daily = { name: "Krishnamurti Daily", cover: "icons/icon-512.png", desc: "", eps: [] };
      var EPS = {};
      Object.keys(SHOWS).forEach(function (k) {
        var s = SHOWS[k];
        s.eps = s.eps.map(function (e) {
          var ep = { id: e[0], title: e[1], date: e[2], min: e[3], url: e[4], show: k };
          EPS[ep.id] = ep;
          return ep;
        });
      });
      // Topic words matched in titles, for videos that arrive from the live feed without tags
      var TOPIC_RE = { Fear: /fear|afraid/i, Love: /\blov/i, Freedom: /\bfree/i, Meditation: /meditat/i, Relationship: /relationship/i };

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
          var p = /^(\d+) (\w{3}) (\d{4})$/.exec(v[2]), mi = p ? "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(p[2]) / 3 : -1;
          var o = { id: v[0], title: v[1], date: v[2], ch: VIDEOS[k].name, k: k, iso: mi > -1 ? p[3] + "-" + ("0" + (mi + 1)).slice(-2) + "-" + ("0" + p[1]).slice(-2) : "" };
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
        ["What Love Is Not", "We don't know how to love, we only know how to think about love.", "https://kfoundation.org/what-love-is-not/", UP + "2022/07/black-and-white-photo-portrait-of-j-krishnamurti-on-a-dark-background-looking-at-the-camera.jpg"],
        ["Krishnamurti on Meditation", "Meditation must come naturally, like a flower that blooms. You cannot force it.", "https://kfoundation.org/meditation/", UP + "2022/07/black-and-white-photograph-of-j-krishnamurti-with-trees-in-the-background-looking-to-right.jpg"],
        ["The Root of Fear", "It is only with direct contact with fear that you are free.", "https://kfoundation.org/the-root-of-fear/", UP + "2022/07/black-and-white-photograph-of-j-krishnamurti-looking-down-left-with-leaves-background.jpg"],
        ["On Loneliness", "As long as there is self-centred activity, there must be loneliness.", "https://kfoundation.org/on-loneliness/", UP + "2022/07/black-and-white-photograph-of-j-krishnamurti-in-indian-clothes-looking-to-right.jpg"],
        ["Krishnamurti on Artificial Intelligence", "If the machine can do everything thought can do, what then is man?", "https://kfoundation.org/krishnamurti-on-ai/", UP + "2023/09/K-on-AI-Square.jpg"],
        ["What Is Our Relationship to Nature?", "If you lose relationship with nature, you lose relationship with humanity.", "https://kfoundation.org/what-is-our-relationship-with-nature/", UP + "2022/07/colour-photograph-of-j-krishnamurti-looking-at-the-branches-of-a-tree.jpg"]
      ];
      var GENRES = [["Talk", "1,548"], ["Discussion", "760"], ["Question & Answer", "425"], ["Dialogue", "288"], ["Seminar", "192"], ["Film", "57"], ["Interview", "40"]];
      var START = [
        ["Where to Start", "https://kfoundation.org/start/"],
        ["Biography", "https://kfoundation.org/krishnamurti-biography/"],
        ["Free 5-Day Introduction", "https://sub.kfoundation.org/five"]
      ];

      // Centre programme. The live list comes from feed.json ("retreats", read from the Centre's Inn Style
      // promotion pages each night). This copy (checked 16 Nov 2026) is only the offline fallback.
      var RETREAT_SRC = [
        { promo: 72322, name: "Young Adults Retreat", start: "2026-11-20", nights: 4 },
        { promo: 72330, name: "Group Retreat", start: "2026-11-27", nights: 4 },
        { promo: 75544, name: "Silent Retreat", start: "2027-02-19", nights: 2 },
        { promo: 75572, name: "Group Retreat", start: "2027-02-26", nights: 4 },
        { promo: 75563, name: "Weekend Retreat", start: "2027-03-12", nights: 2 },
        { promo: 75567, name: "Young Adults Retreat", start: "2027-03-19", nights: 4 },
        { promo: 75553, name: "Group Retreat", start: "2027-04-16", nights: 4 },
        { promo: 75545, name: "Silent Retreat", start: "2027-04-23", nights: 2 },
        { promo: 75573, name: "Group Retreat", start: "2027-05-07", nights: 4 },
        { promo: 75546, name: "Silent Retreat", start: "2027-05-21", nights: 2 },
        { promo: 75564, name: "Weekend Retreat", start: "2027-06-04", nights: 2 },
        { promo: 75568, name: "Young Adults Retreat", start: "2027-06-18", nights: 4 },
        { promo: 75555, name: "Group Retreat", start: "2027-07-02", nights: 4 },
        { promo: 75547, name: "Silent Retreat", start: "2027-07-30", nights: 2 },
        { promo: 75610, name: "Krishnamurti Gathering", start: "2027-08-13", nights: 5 },
        { promo: 75565, name: "Weekend Retreat", start: "2027-08-27", nights: 2 },
        { promo: 75571, name: "Young Adults Retreat", start: "2027-09-03", nights: 4 },
        { promo: 75548, name: "Silent Retreat", start: "2027-09-17", nights: 2 },
        { promo: 75556, name: "Group Retreat", start: "2027-09-24", nights: 4 },
        { promo: 75575, name: "Weekend Retreat", start: "2027-10-08", nights: 2 },
        { promo: 75549, name: "Silent Retreat", start: "2027-10-15", nights: 2 },
        { promo: 75570, name: "Young Adults Retreat", start: "2027-10-22", nights: 4 },
        { promo: 75550, name: "Silent Retreat", start: "2027-11-12", nights: 2 },
        { promo: 75557, name: "Group Retreat", start: "2027-11-26", nights: 4 },
        { promo: 75551, name: "Silent Retreat", start: "2027-12-03", nights: 2 }
      ];
      var MON3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      function isoToDate(v) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v)); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
      function retreatType(name) {
        return /silent/i.test(name) ? "silent" : /young/i.test(name) ? "young" : /weekend/i.test(name) ? "weekend" : /gathering/i.test(name) ? "gathering" : "group";
      }
      // "20–24 Nov 2026", "27 Nov–1 Dec 2026", "30 Dec 2027–2 Jan 2028"
      function rangeLabel(a, b) {
        if (a.getFullYear() !== b.getFullYear()) return a.getDate() + " " + MON3[a.getMonth()] + " " + a.getFullYear() + "–" + b.getDate() + " " + MON3[b.getMonth()] + " " + b.getFullYear();
        return a.getDate() + (a.getMonth() !== b.getMonth() ? " " + MON3[a.getMonth()] : "") + "–" + b.getDate() + " " + MON3[b.getMonth()] + " " + b.getFullYear();
      }
      // Validated retreat objects, soonest first. Bad rows from the feed are dropped, never guessed.
      function toRetreats(list) {
        if (!Array.isArray(list)) return [];
        return list.map(function (x) {
          if (!x || typeof x !== "object") return null;
          var a = isoToDate(x.start), n = Number(x.nights), promo = Number(x.promo), name = typeof x.name === "string" ? x.name.trim() : "";
          if (!a || !name || !(n >= 1 && n <= 31) || !(promo > 0) || Math.floor(promo) !== promo) return null;
          var b = new Date(a); b.setDate(b.getDate() + n);
          return { promo: promo, name: name, type: retreatType(name), start: a, end: b, nights: n, label: rangeLabel(a, b) };
        }).filter(Boolean).sort(function (x, y) { return x.start - y.start; });
      }
      var RETREATS = toRetreats(RETREAT_SRC);
      var RETREAT_DESC = {
        group: "Several days of shared inquiry into the questions Krishnamurti raised: video and audio sessions, dialogue in small groups, and time for walks and quiet in the South Downs.",
        silent: "A weekend held in silence. Video sessions, walks and unhurried time alone, with no discussion and nothing to achieve.",
        young: "A retreat for young adults: video sessions, open dialogue, walks and shared meals with others at a similar stage of life.",
        weekend: "A short retreat over two nights: a good first visit, with video sessions, dialogue and walks in the grounds.",
        gathering: "The Centre's annual Gathering: several days of sessions, dialogue and time together with people who come from many countries."
      };
      // Centre facts. The live copy is data/centre.json (edit that file, not this one); this is the offline fallback.
      var CENTRE = {
        rooms: [
          { id: "standard", name: "Standard", weekday: 100, weekend: 110, week: 612, sleeps: 1 },
          { id: "large", name: "Large", weekday: 115, weekend: 125, week: 702, sleeps: 1 },
          { id: "flat", name: "Flat", weekday: 150, weekend: 170, week: 927, sleeps: 2 }
        ],
        reduced: { weekday: 80, weekend: 90, rooms: 3 },
        dayVisits: [{ label: "With lunch", price: 20 }, { label: "With supper", price: 15 }, { label: "Lunch and supper", price: 35 }, { label: "Study facilities only", price: 0 }],
        deposit: 100,
        closures: [{ from: "2027-01-04", reopen: "2027-02-12" }],
        minNights: 2,
        maxNights: 14,
        adultsOnly: true,
        checkIn: "11:00",
        checkOut: "10:00",
        phone: { display: "+44 (0)1962 771748", tel: "+441962771748" },
        email: "info@krishnamurticentre.org.uk"
      };
      var BOOK = "https://krishnamurticentre.innstyle.co.uk";
      (function () {
        var app = document.getElementById("app");
        function $(id) { return document.getElementById(id); }
        function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
        function BR(href, title) { return ' href="' + href + '" data-act="browse" data-title="' + esc(title) + '"'; }
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
          close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
          headphones: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4" height="6.5" rx="1.5"/></svg>'
        };
        var PP = I.play + I.pause;
        var PP_BIG = PP.replace(/width="18" height="18"/g, 'width="30" height="30"');
        function playBtn(id) {
          var ep = getEp(id);
          return '<button class="x-playbtn" data-act="play" data-ep="' + esc(id) + '" aria-label="Play ' + esc(ep ? ep.title : "") + '">' + PP + "</button>";
        }
        function mins(ep) { return ep.min ? ep.min + " min" : ""; }
        // Date and duration, each left out when missing
        function joinMeta() { return [].filter.call(arguments, Boolean).join(" · "); }
        function epMeta(ep) { return esc(joinMeta(ep.date, mins(ep))); }
        // A video's own thumbnail from the feed, else YouTube's
        function vThumb(v, size) { return v.thumb || "https://i.ytimg.com/vi/" + v.id + "/" + (size || "hqdefault") + ".jpg"; }

        /* ---------- Saved state (silently does nothing where storage is blocked) ---------- */
        var SKEY = "kapp.v1.";
        function load(k, dflt) {
          try { var v = window.localStorage.getItem(SKEY + k); return v === null ? dflt : JSON.parse(v); } catch (err) { return dflt; }
        }
        function store(k, v) {
          try { window.localStorage.setItem(SKEY + k, JSON.stringify(v)); } catch (err) {}
        }
        function loadObj(k) { var v = load(k, {}); return v && typeof v === "object" && !Array.isArray(v) ? v : {}; }
        var positions = loadObj("pos");   // episode id -> seconds listened
        var played = loadObj("played");   // episode id -> time marked played
        var savedItems = loadObj("savedItems"); // episode or video id -> time saved
        var downloads = loadObj("dl");    // episode id -> time downloaded (audio kept in the Cache API)
        var library = loadObj("lib");     // id -> what is needed to show a saved, started or downloaded item offline
        var recent = load("recent", []);  // episode ids, most recently played first
        if (!Array.isArray(recent)) recent = [];

        var state = { tab: "today", show: "uoc", wkind: /^(full|extract|short)$/.test(load("wkind", "")) ? load("wkind", "") : "full", topic: null, vfilter: "all", restartAsk: false, more: { uoc: 10, kc: 10 } };
        // Keeps enough about an episode or video to list it again after a reload, even if it has left the feed
        function remember(item, kind) {
          if (!item) return;
          library[item.id] = kind === "video"
            ? { kind: "video", title: item.title, date: item.date || "", k: item.k, thumb: item.thumb || "" }
            : { kind: "ep", title: item.title, date: item.date || "", min: item.min || null, url: item.url, show: item.show };
          store("lib", library);
        }
        // Drops library entries nothing refers to any more
        function tidyLibrary() {
          Object.keys(library).forEach(function (id) {
            if (!savedItems[id] && !downloads[id] && !positions[id] && recent.indexOf(id) < 0 && !(cur && cur.id === id)) delete library[id];
          });
          store("lib", library);
        }
        // Episodes and videos known only from the library (saved earlier, now out of the feed or offline)
        function fromLibrary(id) {
          var e = library[id];
          if (!e || typeof e !== "object" || typeof e.title !== "string") return null;
          if (e.kind === "video" && VIDEOS[e.k] && /^[\w-]{6,20}$/.test(id)) {
            if (!VIDS[id]) VIDS[id] = { id: id, title: e.title, date: e.date || "", thumb: isHttp(e.thumb) ? e.thumb : "", ch: VIDEOS[e.k].name, k: e.k };
            return VIDS[id];
          }
          if (e.kind === "ep" && SHOWS[e.show] && isHttp(e.url)) {
            if (!EPS[id]) EPS[id] = { id: id, title: e.title, date: e.date || "", min: typeof e.min === "number" ? e.min : null, url: e.url, show: e.show };
            return EPS[id];
          }
          return null;
        }
        function getEp(id) { return EPS[id] || fromLibrary(id); }
        function getVid(id) { return VIDS[id] || fromLibrary(id); }
        var PAGE = 10;
        function moreBtn(k, total) {
          return total > state.more[k] ? '<button class="x-btn x-btn--ghost x-more" data-act="more" data-k="' + k + '">Load more</button>' : "";
        }

        // Images that fail keep a soft grey placeholder
        var PH = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"><rect width="4" height="3" fill="#eceeef"/></svg>');
        document.addEventListener("error", function (e) {
          var t = e.target;
          if (t && t.tagName === "IMG" && t.dataset.letter) { t.outerHTML = letterTile(t.dataset.letter); return; }
          if (t && t.tagName === "IMG" && !t.dataset.failed) { t.dataset.failed = "1"; t.src = PH; }
        }, true);

        /* ---------- Today ---------- */
        // Top to bottom: date, today's passage, continue listening, new this week, Instagram, the Centre, saved
        function renderToday() {
          var todayLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
          $("s-today").innerHTML =
            '<div class="x-pad x-today-head"><h1 class="x-smallcaps x-today-date">' + esc(todayLabel) + "</h1></div>" +
            todayHero() +
            '<div class="x-sec" id="continue-wrap" hidden><div class="x-sec-head"><h2 class="x-sec-title">Continue listening</h2></div><div id="continue"></div></div>' +
            newThisWeek() +
            '<div id="ig-wrap">' + instagramHtml() + "</div>" +
            centreCard() +
            '<div class="x-sec" id="saved-wrap" hidden><div class="x-sec-head"><h2 class="x-sec-title">Saved</h2></div><ul class="x-list" id="saved-list"></ul></div>';
          renderContinue();
          renderSaved();
        }

        // Today's passage: today's entry in data/daily.json when there is one. Otherwise, INTERIM: the app's own
        // QUOTES, one per day of the year, until the kfoundation.org quotes pipeline (step 3) supplies passages.
        // Nothing is made up here: every passage is either from daily.json or from QUOTES.
        var HERO_PHOTO = ARTICLES[5][3]; // colour photograph of K looking at the branches of a tree (local copy via feed.json images)
        function dayOfYear(d) { var s = new Date(d.getFullYear(), 0, 1); return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - s) / 864e5); }
        function todayPassage() {
          var p = DAILY.byDay[dailyDayNumber()];
          if (p) return { daily: p, text: p.text.split(/\n\s*\n/)[0].trim(), source: sourceLine(p), interim: false };
          if (!QUOTES.length) return null;
          var q = QUOTES[dayOfYear(new Date()) % QUOTES.length];
          return { daily: null, text: q[0], source: q[1], interim: true };
        }
        function quoteId(text) {
          var h = 0;
          for (var i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
          return "quote:" + (h >>> 0).toString(36);
        }
        function quoteSaveBtn(id) {
          var on = !!savedItems[id];
          return '<button class="x-act' + (on ? " is-on" : "") + '" data-act="save-quote" data-id="' + esc(id) + '" aria-pressed="' + on + '">' + I.heart + (on ? "Saved" : "Save") + "</button>";
        }
        function todayHero() {
          var q = todayPassage();
          if (!q) return "";
          var p = q.daily, ep = p && p.audioUrl ? getEp("d" + p.day) : null, photo = IMGMAP[HERO_PHOTO], id = quoteId(q.text);
          var dayLine = p ? joinMeta("Day " + p.day + " of 365", flowLine(p)) : "";
          return '<article class="x-card x-today-hero' + (p ? " x-daily-card" : "") + '" aria-labelledby="th-label" data-passage="' + (q.interim ? "interim" : "daily") + '" data-qid="' + esc(id) + '">' +
            (photo ? '<img class="x-th-photo" src="' + esc(photo) + '" alt="J. Krishnamurti looking at the branches of a tree" />' : "") +
            '<div class="x-th-body">' +
              '<p class="x-smallcaps x-accent" id="th-label">Today\'s passage</p>' +
              (p
                ? '<button class="x-th-quote" data-act="dopen" data-day="' + p.day + '"><span class="x-th-text">' + esc(q.text) + '</span><span class="x-visually-hidden">. Read today\'s passage in full</span></button>'
                : '<blockquote class="x-th-text">' + esc(q.text) + "</blockquote>") +
              (q.source ? '<p class="x-meta x-th-source">' + esc(q.source) + "</p>" : "") +
              (dayLine ? '<p class="x-meta x-th-day">' + esc(dayLine) + "</p>" : "") +
              '<div class="x-actions">' +
                (ep ? '<button class="x-act" data-act="play" data-ep="' + esc(ep.id) + '" aria-label="Listen to today\'s passage">' + PP + "<span>Listen</span></button>" : "") +
                quoteSaveBtn(id) +
                '<button class="x-act" data-act="share-quote">' + I.share + "Share</button>" +
              "</div>" +
            "</div>" +
          "</article>";
        }
        function toggleSaveQuote(id) {
          var q = todayPassage(), hadFocus = document.activeElement && document.activeElement.getAttribute("data-id") === id;
          if (savedItems[id]) { delete savedItems[id]; store("savedItems", savedItems); tidyLibrary(); }
          else if (q && quoteId(q.text) === id) {
            savedItems[id] = Date.now();
            library[id] = { kind: "quote", title: q.text, source: q.source || "", day: q.daily ? q.daily.day : null };
            store("lib", library);
            store("savedItems", savedItems);
          }
          [].forEach.call(app.querySelectorAll('.x-today-hero [data-act="save-quote"][data-id="' + id + '"]'), function (b) { b.outerHTML = quoteSaveBtn(id); });
          toast(savedItems[id] ? "Saved. Find it on Today." : "Removed from saved");
          renderSaved();
          var nb = $("s-today").querySelector('.x-today-hero [data-act="save-quote"]');
          if (nb && hadFocus) nb.focus();
        }
        function shareQuote() {
          var q = todayPassage();
          if (!q) return;
          var link = location.href.split("#")[0];
          var text = "“" + q.text + "”\n\nJ. Krishnamurti" + (q.source ? ", " + q.source : "");
          if (navigator.share) { navigator.share({ title: "Today's passage", text: text, url: link }).catch(function () {}); return; }
          if (navigator.clipboard) navigator.clipboard.writeText(link).then(function () { toast("Link copied"); }, function () { toast("Copy is not available here"); });
          else toast("Copy is not available here");
        }

        // New this week: the newest episodes of both podcasts and the newest videos of both channels, newest first
        var VBADGE = { full: "Full talk", extract: "Extract", short: "Short" };
        function epIso(ep) {
          if (ep.iso) return ep.iso;
          var m = /^(\d{1,2}) (\w{3})\w* (\d{4})$/.exec(ep.date || ""), mi = m ? "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(m[2]) / 3 : -1;
          return mi > -1 ? m[3] + "-" + ("0" + (mi + 1)).slice(-2) + "-" + ("0" + m[1]).slice(-2) : "";
        }
        function newItems() {
          var out = [];
          [["kc", 2], ["uoc", 2]].forEach(function (s) {
            SHOWS[s[0]].eps.slice(0, s[1]).forEach(function (ep) {
              out.push({ kind: "ep", id: ep.id, img: SHOWS[s[0]].cover, badge: "Podcast", label: SHOWS[s[0]].name, title: ep.title.replace(/^\d+\s*•\s*/, ""), meta: joinMeta(ep.date, mins(ep)), iso: epIso(ep) });
            });
          });
          ["kft", "off"].forEach(function (k) {
            VIDEOS[k].list.slice().sort(function (a, b) { return (b.iso || "").localeCompare(a.iso || ""); }).slice(0, 3).forEach(function (v) {
              out.push({ kind: "video", id: v.id, img: vThumb(v), badge: VBADGE[kindOf(v)] || "Video", label: v.ch, title: v.title, meta: joinMeta(v.date, vDur(v)), iso: v.iso || "" });
            });
          });
          return out.sort(function (a, b) { return b.iso.localeCompare(a.iso); }).slice(0, 8);
        }
        function newThisWeek() {
          var items = newItems();
          if (!items.length) return "";
          return '<div class="x-sec"><div class="x-sec-head"><h2 class="x-sec-title">New this week</h2><button class="x-seeall" data-act="tab" data-tab="listen">See all</button></div><div class="x-rail">' +
            items.map(function (o) { return newCard(o.kind, o.id, o.img, o.badge, o.label, o.title, o.meta); }).join("") +
          "</div></div>";
        }
        function newCard(kind, id, img, badge, label, title, meta) {
          return '<button class="x-card x-newcard" data-act="' + (kind === "ep" ? "ep" : "video") + '" data-' + (kind === "ep" ? "ep" : "v") + '="' + esc(id) + '" aria-label="' + esc(badge + ": " + title + (meta ? ", " + meta : "")) + '">' +
            '<span class="x-nc-art"><img src="' + esc(img) + '" alt="" loading="lazy" /><span class="x-nc-badge" aria-hidden="true">' + esc(badge) + "</span></span>" +
            '<span class="x-nc-body" aria-hidden="true"><span class="x-kind">' + esc(label) + '</span><span class="x-nc-title">' + esc(title) + '</span><span class="x-meta">' + esc(meta) + "</span></span></button>";
        }
        function metaText(ep) { return joinMeta(ep.date, mins(ep)); }

        // Instagram: only from data/instagram.json (built by the pipeline; no Meta scripts in the app).
        // Without the file: one compact "Follow us" row. With it: the latest post large, the next ones small.
        var IG_URL = "https://www.instagram.com/krishnamurtifoundationtrust/";
        var IG = null, IG_NOTE = "";
        var IGI = {
          carousel: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="7" width="13" height="13" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',
          video: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
          logo: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>'
        };
        var IG_TYPE = { image: "Photo", carousel: "Carousel", video: "Video" };
        function igImage(u) { return (isHttp(u) && /^https:/i.test(u)) || /^data\/ig\/[\w.-]+\.(jpe?g|png|webp)$/i.test(txt(u)); }
        function applyInstagram(x) {
          var posts = x && Array.isArray(x.posts) ? x.posts : [];
          var list = posts.map(function (p) {
            if (!p || typeof p !== "object") return null;
            var link = txt(p.permalink), t = txt(p.type).toLowerCase(), d = new Date(txt(p.timestamp));
            if (!txt(p.id) || !/^https:\/\/(www\.)?instagram\.com\/[\w\/.-]+$/.test(link) || !igImage(p.image) || !IG_TYPE[t]) return null;
            return { id: txt(p.id), link: link, image: txt(p.image), type: t, caption: plainText(p.caption), date: isNaN(d.getTime()) ? null : d };
          }).filter(Boolean).sort(function (a, b) { return (b.date || 0) - (a.date || 0); });
          IG = list.length ? list : null;
          // A hand-saved example file says so in "note"; it is shown under the posts so nobody mistakes it for a live feed
          IG_NOTE = IG && x.example === true ? plainText(x.note) : "";
          var w = $("ig-wrap");
          if (w) w.innerHTML = instagramHtml();
        }
        function loadInstagram() {
          if (!window.fetch || IS_PREVIEW) return;
          try {
            fetch("data/instagram.json", { cache: "no-cache" })
              .then(function (r) { if (!r.ok) throw new Error("instagram " + r.status); return r.json(); })
              .then(applyInstagram)
              .catch(function () {});
          } catch (err) {}
        }
        function igDate(d) { return d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""; }
        function igAlt(p) { return IG_TYPE[p.type] + (p.caption ? ": " + p.caption.slice(0, 90) : "") + (p.date ? ", " + igDate(p.date) : "") + ". Opens Instagram"; }
        function instagramHtml() {
          if (!IG) {
            return '<div class="x-sec x-ig-compact"><a class="x-card x-ig-follow" href="' + IG_URL + '" data-act="ext" data-kind="link">' + IGI.logo +
              '<span><span class="x-row-title">Follow us on Instagram</span><span class="x-meta">@krishnamurtifoundationtrust</span></span>' + I.out + "</a></div>";
          }
          var top = IG[0], more = IG.slice(1, 7);
          return '<div class="x-sec"><div class="x-sec-head"><h2 class="x-sec-title">Instagram</h2></div>' +
            '<a class="x-card x-ig-feature" href="' + esc(top.link) + '" data-act="ext" data-kind="link" aria-label="' + esc(igAlt(top)) + '">' +
              '<span class="x-ig-img"><img src="' + esc(top.image) + '" alt="" loading="lazy" />' + (IGI[top.type] ? '<span class="x-ig-type">' + IGI[top.type] + "</span>" : "") + "</span>" +
              '<span class="x-ig-body" aria-hidden="true">' + (top.caption ? '<span class="x-ig-cap">' + esc(top.caption) + "</span>" : "") + '<span class="x-meta">' + esc(joinMeta(igDate(top.date), "@krishnamurtifoundationtrust")) + "</span></span>" +
            "</a>" +
            (more.length ? '<h3 class="x-ig-more-title">More from Instagram</h3><div class="x-ig-grid">' + more.map(function (p) {
              return '<a class="x-ig-tile" href="' + esc(p.link) + '" data-act="ext" data-kind="link" aria-label="' + esc(igAlt(p)) + '"><img src="' + esc(p.image) + '" alt="" loading="lazy" />' + (IGI[p.type] ? '<span class="x-ig-type">' + IGI[p.type] + "</span>" : "") + "</a>";
            }).join("") + "</div>" : "") +
            (IG_NOTE ? '<p class="x-meta x-ig-note">' + esc(IG_NOTE) + "</p>" : "") +
            '<div class="x-pad"><a class="x-btn x-btn--ghost x-btn--block u-mt4" href="' + IG_URL + '" data-act="ext" data-kind="link">Follow on Instagram ' + I.out + "</a></div>" +
          "</div>";
        }

        // At the Centre: photo header, the next two retreats (upcoming() leaves out ended ones), any coming closure
        function centreCard() {
          var closure = closuresShort()[0];
          return '<div class="x-sec"><div class="x-sec-head"><h2 class="x-sec-title">At the Centre</h2></div>' +
            '<div class="x-card x-centre">' +
              '<div class="x-centre-photo"><img src="' + CU + '2-gallery-1-SFW.jpg" alt="" loading="lazy" /><div class="x-overphoto"><p class="x-centre-name">The Krishnamurti Centre</p><p class="x-centre-place">Brockwood Park, Hampshire</p></div></div>' +
              '<div class="x-centre-body">' +
                (upcoming().slice(0, 2).map(centreRow).join("") || '<p class="x-meta x-centre-empty">New dates are announced soon.</p>') +
                (closure ? '<p class="x-meta x-centre-closure">' + esc(closure) + "</p>" : "") +
                '<button class="x-btn x-btn--block u-mt4" data-act="book">Book a stay</button>' +
                '<button class="x-btn x-btn--ghost x-btn--block u-mt3" data-act="programme">See programme</button>' +
              "</div>" +
            "</div></div>";
        }
        function centreRow(i) {
          var r = RETREATS[i];
          return '<button class="x-centre-row" data-act="retreat" data-i="' + r.promo + '"><span><span class="x-row-title">' + esc(r.name) + '</span><span class="x-meta">' + esc(r.label) + "</span></span>" + I.chev + "</button>";
        }
        // Retreats are referred to by their Inn Style promotion id, which stays the same when the feed reloads
        function retreatBy(promo) {
          for (var i = 0; i < RETREATS.length; i++) if (RETREATS[i].promo === +promo) return RETREATS[i];
          return null;
        }
        function startOfToday() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
        // Indexes of retreats that have not ended yet (RETREATS is sorted soonest first)
        function upcoming() {
          var t = startOfToday();
          return RETREATS.map(function (r, i) { return r.end >= t ? i : -1; }).filter(function (i) { return i > -1; });
        }
        // Minutes left, from the saved position and the known length
        function leftText(ep) {
          var d = ep.min ? ep.min * 60 : 0, t = cur && cur.id === ep.id ? curTime() : positions[ep.id] || 0;
          if (cur && cur.id === ep.id && audio.duration && isFinite(audio.duration)) d = audio.duration;
          return d && t ? Math.max(1, Math.ceil((d - t) / 60)) + " min left" : "";
        }
        function pctOf(ep) {
          var d = ep.min ? ep.min * 60 : 0, t = positions[ep.id] || 0;
          return d && t ? Math.min(100, (t / d) * 100) : 0;
        }
        // Up to three started, unfinished episodes: the current one first, then the most recent
        function continueIds() {
          var ids = (cur ? [cur.id] : []).concat(recent), out = [];
          ids.forEach(function (id) {
            if (out.length >= 3 || out.indexOf(id) > -1 || played[id] || !getEp(id)) return;
            if ((cur && cur.id === id) || positions[id] > 0) out.push(id);
          });
          return out;
        }
        function renderContinue() {
          var wrap = $("continue-wrap");
          if (!wrap) return;
          var ids = continueIds();
          wrap.hidden = !ids.length;
          $("continue").innerHTML = ids.map(function (id) {
            var ep = getEp(id), s = SHOWS[ep.show], isCur = cur && cur.id === id;
            return '<div class="x-card x-continue">' +
              '<img src="' + esc(s.cover) + '" alt="" />' +
              '<button class="x-c-body" data-act="' + (isCur ? "np" : "ep") + '" data-ep="' + esc(id) + '"><span class="x-row-title x-clamp2">' + esc(ep.title) + '</span><span class="x-meta" data-left="' + esc(id) + '">' + esc(leftText(ep) || s.name) + '</span><span class="x-bar"><i class="x-prog" data-ep="' + esc(id) + '" style="width:' + pctOf(ep) + '%"></i></span></button>' +
              playBtn(id) +
            "</div>";
          }).join("");
          syncPlay();
          progress();
        }
        // Saved episodes and videos, newest first; kept on the device, shown offline from the library
        function renderSaved() {
          var wrap = $("saved-wrap");
          if (!wrap) return;
          var ids = Object.keys(savedItems).sort(function (a, b) { return (savedItems[b] || 0) - (savedItems[a] || 0); });
          var html = ids.map(function (id) {
            var e = library[id] || {};
            if (e.kind === "quote") {
              if (typeof e.title !== "string" || !e.title) return "";
              return '<li class="x-row x-saved-quote"><div class="x-row-main"><span class="x-row-title">“' + esc(e.title) + '”</span><span class="x-meta">' + esc(joinMeta("Passage", typeof e.source === "string" ? e.source : "")) + "</span></div>" +
                '<button class="x-playbtn" data-act="save-quote" data-id="' + esc(id) + '" aria-pressed="true" aria-label="Remove passage from saved">' + I.heart.replace('fill="none"', 'fill="currentColor"') + "</button></li>";
            }
            if (e.kind === "video" || (!e.kind && VIDS[id])) {
              var v = getVid(id);
              if (!v) return "";
              return '<li class="x-row"><button class="x-row-main" data-act="video" data-v="' + esc(id) + '"><span class="x-row-title">' + esc(v.title) + '</span><span class="x-meta">' + esc(joinMeta("Video", v.ch)) + "</span></button></li>";
            }
            var ep = getEp(id);
            if (!ep) return "";
            return '<li class="x-row"><button class="x-row-main" data-act="ep" data-ep="' + esc(id) + '"><span class="x-row-title">' + esc(ep.title) + '</span><span class="x-meta">' + esc(joinMeta(SHOWS[ep.show].name, epState(ep))) + "</span></button>" + playBtn(id) + "</li>";
          }).join("");
          wrap.hidden = !html;
          $("saved-list").innerHTML = html;
          syncPlay();
        }
        // "Played", "12 min left" or "Downloaded", as the episode's own state
        function epState(ep) {
          return joinMeta(played[ep.id] ? "Played" : leftText(ep), downloads[ep.id] ? "Downloaded" : "");
        }

        /* ---------- Listen ---------- */
        function renderListen() {
          var s = SHOWS[state.show];
          // A Collection series opened from search lists just its parts, in order
          var ser = state.show === "kc" && state.series ? state.series : null;
          var rows = ser ? s.eps.filter(function (ep) { return ep.series === ser; }).sort(function (a, b) { return (a.part || 0) - (b.part || 0); }) : s.eps.slice(0, state.more[state.show]);
          $("s-listen").innerHTML =
            '<div class="x-seg" role="group" aria-label="Podcast">' +
              '<button data-act="lseg" data-k="uoc" class="' + (state.show === "uoc" ? "is-on" : "") + '" aria-pressed="' + (state.show === "uoc") + '">Urgency of Change</button>' +
              '<button data-act="lseg" data-k="kc" class="' + (state.show === "kc" ? "is-on" : "") + '" aria-pressed="' + (state.show === "kc") + '">Collection</button>' +
            "</div>" +
            '<div class="x-show"><img src="' + esc(s.cover) + '" alt="' + esc(s.name) + ' cover art" /><div><h2>' + esc(s.name) + '</h2><p class="x-meta x-clamp2' + (state.descOpen ? " is-open" : "") + '" id="show-desc">' + esc(s.desc) + '</p><p class="x-meta">' + esc(feedTotal(state.show).toLocaleString("en-GB") + " episodes") + (s.desc.length > 70 ? ' <button class="x-more-link" data-act="desc-more" aria-expanded="' + !!state.descOpen + '" aria-controls="show-desc">' + (state.descOpen ? "Less" : "More") + "</button>" : "") + "</p></div></div>" +
            (ser ? '<div class="x-pad x-series-head"><p class="x-meta">' + esc(state.seriesName || "Series") + '</p><button class="x-btn x-btn--ghost x-btn--block u-mt2" data-act="series-clear">All Collection episodes</button></div>' : "") +
            '<ul class="x-list">' +
              (ser && !rows.length ? '<li class="x-empty">Loading this series…</li>' : "") +
              rows.map(function (ep) {
                var pct = played[ep.id] ? 0 : pctOf(ep);
                return '<li class="x-row' + (played[ep.id] ? " is-played" : "") + '"><button class="x-row-main" data-act="ep" data-ep="' + esc(ep.id) + '"><span class="x-row-title" data-fit="' + esc(ep.title) + '">' + esc(ep.title) + '</span><span class="x-meta">' + esc(joinMeta(ep.date, mins(ep), epState(ep))) + "</span>" +
                  (pct ? '<span class="x-bar x-rowbar"><i class="x-prog" data-ep="' + esc(ep.id) + '" style="width:' + pct + '%"></i></span>' : "") +
                  "</button>" + playBtn(ep.id) + "</li>";
              }).join("") +
            "</ul>" +
            (ser ? "" : moreBtn(state.show, feedTotal(state.show)));
          fitTitles($("s-listen"));
          syncPlay();
        }
        function epDesc(ep) {
          if (ep.desc) return ep.desc;
          if (ep.show === "uoc") {
            if (!/^Krishnamurti on /.test(ep.title)) return "Extracts from Krishnamurti's talks and dialogues, chosen and brought together on one theme. Part of Urgency of Change, the Foundation's long-running thematic podcast.";
            var theme = ep.title.replace("Krishnamurti on ", "");
            return "Extracts from Krishnamurti's talks and dialogues, chosen and brought together on one theme: " + theme.charAt(0).toLowerCase() + theme.slice(1) + ". Part of Urgency of Change, the Foundation's long-running thematic podcast.";
          }
          var parts = ep.title.split(" • ");
          if (parts.length < 2) return "A full-length, unedited recording from the Foundation's archives. Part of The Krishnamurti Collection, which releases a new series every week.";
          return "A full-length, unedited recording from the Foundation's archives: " + parts.slice(1).join(", ") + ". Part of The Krishnamurti Collection, which releases a new series every week.";
        }
        function openEpisode(id) {
          var ep = getEp(id);
          if (!ep) return;
          if (ep.show === "daily") { var dd = +String(ep.id).slice(1); if (DAILY.byDay[dd]) { openDailyDay(dd); return; } }
          var s = SHOWS[ep.show];
          openDetail(s.name,
            '<img class="x-detail-cover" src="' + esc(s.cover) + '" alt="' + esc(s.name) + ' cover art" />' +
            '<p class="x-kind">' + esc(s.name) + "</p>" +
            "<h1>" + esc(ep.title) + "</h1>" +
            '<p class="x-meta" id="ep-meta">' + esc(joinMeta(ep.date, mins(ep), epState(ep))) + "</p>" +
            '<div class="x-btnrow">' +
              '<button class="x-btn" data-act="play" data-ep="' + esc(ep.id) + '" data-label="1"></button>' +
              dlBtn(ep.id) +
            "</div>" +
            '<div class="x-actions u-mt3">' + saveBtn(ep.id) + playedBtn(ep.id) + "</div>" +
            '<p class="x-desc">' + esc(epDesc(ep)) + "</p>" +
            chaptersHtml(ep) +
            '<div id="xlinks" data-for="' + esc(ep.id) + '">' + crossLinks(ep.id) + "</div>");
          syncPlay();
          if (!MATCHES) loadMatches();
        }
        // Urgency of Change chapters (from data/podcasts/uoc.json): tap to play from that point
        function chaptersHtml(ep) {
          if (!ep.chapters || !ep.chapters.length) return "";
          return '<div class="x-sec u-mt6"><h2 class="x-sec-title">Chapters</h2><ul class="x-rel-list">' + ep.chapters.map(function (c) {
            var inner = '<span class="x-rel-body"><span class="x-row-title">' + esc(c.title) + '</span><span class="x-meta">' + esc(joinMeta(c.start !== null ? fmt(c.start) : "", c.source)) + "</span></span>";
            return "<li>" + (c.start !== null ? '<button class="x-rel" data-act="chap" data-ep="' + esc(ep.id) + '" data-t="' + c.start + '">' + inner + "</button>" : '<div class="x-rel">' + inner + "</div>") + "</li>";
          }).join("") + "</ul></div>";
        }
        function saveBtn(id) {
          var on = !!savedItems[id];
          return '<button class="x-act' + (on ? " is-on" : "") + '" data-act="save-item" data-id="' + esc(id) + '" aria-pressed="' + on + '">' + I.heart + (on ? "Saved" : "Save") + "</button>";
        }
        function playedBtn(id) {
          var on = !!played[id];
          return '<button class="x-act' + (on ? " is-on" : "") + '" data-act="mark-played" data-ep="' + esc(id) + '" aria-pressed="' + on + '">' + I.check + (on ? "Played" : "Mark as played") + "</button>";
        }
        function dlBtn(id) {
          var on = !!downloads[id], busy = dlBusy[id];
          var label = busy ? I.dl + "Downloading… " + (busy.pct ? busy.pct + "%" : "") : on ? I.check + "Downloaded" : I.dl + "Download";
          return '<button class="x-btn x-btn--ghost' + (on ? " is-on" : "") + '" data-act="dl" data-ep="' + esc(id) + '" aria-pressed="' + on + '"' + (busy ? ' aria-busy="true"' : "") + ">" + label + "</button>";
        }

        /* ---------- Downloads: the MP3 is kept in the Cache API; sw.js serves it (with byte ranges) offline ---------- */
        var AUDIO_CACHE = "kft-audio-v1", dlBusy = {};
        // Same-origin address the service worker answers from the audio cache
        function offlineUrl(id) { return new URL("offline-audio/" + encodeURIComponent(id), location.href).href; }
        function canDownload() { return !!(window.caches && window.fetch && navigator.serviceWorker && navigator.serviceWorker.controller); }
        function refreshDl(id) {
          [].forEach.call(app.querySelectorAll('[data-act="dl"][data-ep="' + id + '"]'), function (b) { b.outerHTML = dlBtn(id); });
        }
        function download(id) {
          var ep = getEp(id);
          if (!ep || dlBusy[id]) return;
          if (!canDownload()) { toast("Downloads work in the installed app, or once this page has loaded fully."); return; }
          dlBusy[id] = { pct: 0 };
          refreshDl(id);
          fetch(ep.url, { mode: "cors" }).then(function (r) {
            if (!r.ok) throw new Error("audio " + r.status);
            var total = +r.headers.get("content-length") || 0, got = 0, chunks = [], reader = r.body && r.body.getReader ? r.body.getReader() : null;
            var type = r.headers.get("content-type") || "audio/mpeg";
            if (!reader) return r.blob();
            function pump() {
              return reader.read().then(function (x) {
                if (x.done) return new Blob(chunks, { type: type });
                chunks.push(x.value); got += x.value.length;
                if (total) { var p = Math.floor((got / total) * 100); if (p !== dlBusy[id].pct) { dlBusy[id].pct = p; refreshDl(id); } }
                return pump();
              });
            }
            return pump();
          }).then(function (blob) {
            return caches.open(AUDIO_CACHE).then(function (c) {
              return c.put(offlineUrl(id), new Response(blob, { headers: { "Content-Type": blob.type || "audio/mpeg", "Content-Length": String(blob.size) } }));
            });
          }).then(function () {
            delete dlBusy[id];
            downloads[id] = Date.now(); store("dl", downloads); remember(ep, "ep");
            toast("Downloaded for offline listening");
            afterChange(id);
          }).catch(function () {
            delete dlBusy[id];
            toast("Download failed. Check your connection and storage space.");
            refreshDl(id);
          });
        }
        function removeDownload(id) {
          var ep = getEp(id);
          delete downloads[id]; store("dl", downloads); tidyLibrary();
          if (ep && window.caches) caches.open(AUDIO_CACHE).then(function (c) { return c.delete(offlineUrl(id)); }).catch(function () {});
          toast("Download removed");
          afterChange(id);
        }
        // Re-draws whatever shows an episode's state, keeping the detail view open
        function afterChange(id) {
          refreshDl(id);
          var meta = $("ep-meta"), ep = getEp(id);
          if (meta && ep && $("detail-body").querySelector('[data-ep="' + id + '"]')) meta.textContent = joinMeta(ep.date, mins(ep), epState(ep));
          if (state.tab !== "listen") renderListen(); else { var y = $("s-listen").scrollTop; renderListen(); $("s-listen").scrollTop = y; }
          renderContinue();
          renderSaved();
        }

        /* ---------- Watch: Full talks | Extracts | Shorts, from each video's "kind" in the data ---------- */
        var TOPICS = ["Fear", "Love", "Freedom", "Meditation", "Relationship"];
        var WKINDS = [["full", "Full talks"], ["extract", "Extracts"], ["short", "Shorts"]];
        // kind from the data: "full" | "extract" | "short" | "unknown". A Short flag wins. Older feeds carry the
        // talk form instead (talk, discussion, audio…), which are full recordings. Anything else, or no kind at all,
        // follows the channel, as the pipeline does: the Official Channel is full talks, other channels extracts.
        var FULL_FORMS = /^(talk|discussion|dialogue|conversation|qa|seminar|interview|audio)$/;
        function videoKind(kind, isShort, ch) {
          var k = typeof kind === "string" ? kind.toLowerCase() : "";
          if (isShort || k === "short") return "short";
          if (k === "full" || k === "extract") return k;
          if (FULL_FORMS.test(k)) return "full";
          return ch === "off" ? "full" : "extract";
        }
        // Every known video once, newest first
        function allVideos() {
          var seen = {}, out = [];
          Object.keys(VIDEOS).forEach(function (k) {
            VIDEOS[k].list.forEach(function (v) { if (!seen[v.id]) { seen[v.id] = 1; out.push(v); } });
          });
          return out.sort(function (a, b) { return (b.iso || "").localeCompare(a.iso || ""); });
        }
        function kindOf(v) { return v.kind || videoKind("", false, v.k); }
        function watchCounts() {
          var n = { full: 0, extract: 0, short: 0 };
          allVideos().forEach(function (v) { n[kindOf(v)]++; });
          return n;
        }
        function vDur(v) { return v.sec ? fmt(v.sec) : ""; }
        // Audio-only full recordings: a text card (place and year large, title, a small "Audio" label) instead of
        // YouTube's thumbnail, which is the same still photograph for every audio upload
        function audioCard(v, d) {
          var place = v.place || "", year = v.year ? String(v.year) : "";
          return '<button class="x-video x-video--audio" data-act="video" data-v="' + esc(v.id) + '"><span class="x-thumb x-audiocard" aria-hidden="true">' +
            '<span class="x-ac-big">' + esc(place || year || "Audio") + (place && year ? " <b>" + esc(year) + "</b>" : "") + '</span><span class="x-ac-label">' + I.headphones + "Audio</span>" +
            (d ? '<em class="x-dur">' + esc(d) + "</em>" : "") + '</span><span class="x-row-title">' + esc(v.title) + '</span><span class="x-meta">' + esc(joinMeta(v.date, v.ch)) + "</span></button>";
        }
        function renderWatch() {
          var counts = watchCounts();
          var segs = WKINDS.filter(function (w) { return counts[w[0]] > 0; });
          if (segs.length && !counts[state.wkind]) state.wkind = segs[0][0];
          var all = allVideos().filter(function (v) { return kindOf(v) === state.wkind; });
          var list = all.filter(function (v) { return !state.topic || TOPIC_RE[state.topic].test(v.title); });
          var isShort = state.wkind === "short", mk = "w-" + state.wkind;
          if (!state.more[mk]) state.more[mk] = PAGE;
          $("s-watch").innerHTML =
            (segs.length > 1 ? '<div class="x-seg x-wseg" role="tablist" aria-label="Video type">' +
              segs.map(function (w) {
                var on = state.wkind === w[0];
                return '<button role="tab" id="wtab-' + w[0] + '" aria-controls="watch-panel" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-act="wseg" data-k="' + w[0] + '" class="' + (on ? "is-on" : "") + '">' + w[1] + ' <span class="x-count">' + counts[w[0]].toLocaleString("en-GB") + "</span></button>";
              }).join("") + "</div>" : "") +
            '<div id="watch-panel" role="tabpanel"' + (segs.length > 1 ? ' aria-labelledby="wtab-' + state.wkind + '"' : "") + ">" +
            (segs.length ? '<div class="x-chips" role="group" aria-label="Topics">' +
              TOPICS.map(function (t) { return '<button class="x-chip' + (state.topic === t ? " is-on" : "") + '" data-act="topic" data-t="' + t + '" aria-pressed="' + (state.topic === t) + '">' + t + "</button>"; }).join("") +
            "</div>" : "") +
            '<div class="x-videos' + (isShort ? " x-shorts" : "") + '">' +
              (list.slice(0, state.more[mk]).map(function (v) {
                var d = vDur(v);
                if (v.fmt === "audio" && !isShort) return audioCard(v, d);
                return '<button class="x-video" data-act="video" data-v="' + esc(v.id) + '"><span class="x-thumb"><img src="' + esc(vThumb(v)) + '" alt="" loading="lazy" /><span>' + I.play + "</span>" + (d ? '<em class="x-dur">' + esc(d) + "</em>" : "") + '</span><span class="x-row-title">' + esc(v.title) + '</span><span class="x-meta">' + esc(joinMeta(v.date, v.ch)) + "</span></button>";
              }).join("") || '<p class="x-empty">' + (segs.length ? "No videos on " + esc((state.topic || "").toLowerCase()) + " here yet." : "Videos are on their way. Check your connection.") + "</p>") +
            "</div>" +
            moreBtn(mk, list.length) + "</div>";
        }
        var IS_PREVIEW = (function () {
          try { return String(window.origin) === "null" || !/^https?:$/.test(location.protocol); } catch (err) { return true; }
        })();
        function ytWatch(id) { return "https://www.youtube.com/watch?v=" + encodeURIComponent(id); }
        function openYouTube(id) {
          if (!audio.paused) audio.pause();
          openExternal(ytWatch(id), "youtube");
        }
        function ytFrame(v) {
          if (IS_PREVIEW) return posterHtml(v);
          return '<iframe src="https://www.youtube.com/embed/' + encodeURIComponent(v.id) + '?playsinline=1&amp;rel=0&amp;autoplay=1" title="' + esc(v.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
        }
        function posterHtml(v) {
          return '<button class="x-poster" data-act="vplay" data-v="' + esc(v.id) + '" aria-label="Play ' + esc(v.title) + '"><img src="' + esc("https://i.ytimg.com/vi/" + encodeURIComponent(v.id) + "/hqdefault.jpg") + '" alt="" /><span>' + I.play.replace(/width="18" height="18"/, 'width="30" height="30"') + "</span></button>";
        }
        function startVideo(id) {
          var box = $("vplayer");
          if (!box) return;
          if (IS_PREVIEW) { openYouTube(id); return; }
          if (!audio.paused) audio.pause();
          box.innerHTML = ytFrame(getVid(id));
        }
        // Swaps a playing inline video back to its poster, so audio and video never overlap
        function stopVideo() {
          var box = $("vplayer");
          if (box && box.querySelector("iframe")) box.innerHTML = posterHtml(getVid(box.getAttribute("data-v")));
        }
        function openVideo(id, autoplay) {
          var v = getVid(id);
          if (!v) return;
          // The video's own YouTube description, from data/videos/<channel>/descriptions.json (nothing is made up)
          var desc = videoDesc(v);
          if (desc === null) loadDescriptions(v.k, function () { var el = $("vdesc"); if (el && $("vplayer") && $("vplayer").getAttribute("data-v") === v.id) el.textContent = videoDesc(v) || ""; });
          var vk = kindOf(v), rel = allVideos().filter(function (o) { return o.id !== v.id && kindOf(o) === vk; }).slice(0, 8);
          openDetail(v.ch,
            '<div class="x-embed" id="vplayer" data-v="' + esc(v.id) + '">' + (autoplay ? ytFrame(v) : posterHtml(v)) + "</div>" +
            // Only where YouTube's embedded player cannot run (a sandboxed preview with no web origin)
            (IS_PREVIEW ? '<div class="x-ytbox"><button class="x-btn x-btn--ghost x-btn--block" data-act="yt" data-v="' + esc(v.id) + '">' + I.play + " Play on YouTube</button>" +
            '<p class="x-ytnote">This preview window blocks YouTube\'s player. Videos play inside the app when it is hosted.</p></div>' : "") +
            '<p class="x-kind u-mt4">' + esc(v.ch) + "</p>" +
            "<h1>" + esc(v.title) + "</h1>" +
            '<p class="x-meta">' + esc(joinMeta(v.date, v.ch)) + "</p>" +
            '<div class="x-actions u-mt3">' + saveBtn(v.id) + "</div>" +
            (v.full && v.full !== v.id ? '<button class="x-btn x-btn--ghost x-btn--block u-mt3" data-act="vfull" data-v="' + esc(v.id) + '">' + I.play + " Watch full talk</button>" : "") +
            '<p class="x-desc" id="vdesc">' + esc(desc || "") + "</p>" +
            '<div class="x-sec u-mt6"><h2 class="x-sec-title">More ' + esc(vk === "full" ? "full talks" : vk === "short" ? "Shorts" : "extracts") + "</h2>" +
              '<ul class="x-rel-list">' +
                rel.map(function (o) {
                  return '<li><button class="x-rel" data-act="vswap" data-v="' + esc(o.id) + '"><img src="' + esc(vThumb(o, "mqdefault")) + '" alt="" loading="lazy" /><span class="x-rel-body"><span class="x-row-title">' + esc(o.title) + '</span><span class="x-meta">' + esc(o.date) + "</span></span></button></li>";
                }).join("") +
              "</ul></div>" +
            '<div id="xlinks" data-for="' + esc(v.id) + '">' + crossLinks(v.id) + "</div>" +
            '<p class="x-meta x-ytattr">Video from YouTube. <a href="' + esc(ytWatch(v.id)) + '" data-act="ext" data-kind="youtube">Open on YouTube</a> · <a href="https://www.youtube.com/t/terms" data-act="ext" data-kind="link">YouTube Terms of Service</a></p>');
          if (!MATCHES) loadMatches();
          if (autoplay && !IS_PREVIEW && !audio.paused) audio.pause();
        }

        /* ---------- In-app browser ---------- */
        // Only kfoundation.org and the Centre's site open in the framed in-app browser. Inn Style (booking,
        // gift vouchers) never does: Safari blocks its session cookie inside a frame. Everything else uses openExternal.
        function canFrame(href) {
          try {
            var u = new URL(href, location.href);
            if (u.protocol !== "https:") return false;
            var h = u.hostname.toLowerCase();
            // Forms and payments open as a full page: framed, the donation form's script fails ("Blocked a frame")
            // and the browser drops the site's consent and Stripe cookies as third-party (checked 17 Nov 2026)
            if (/^\/(donate|give|newsletter|checkout|cart|my-account)(\/|$)/i.test(u.pathname)) return false;
            return h === "kfoundation.org" || h === "www.kfoundation.org" ||
              h === "krishnamurticentre.org.uk" || h === "www.krishnamurticentre.org.uk";
          } catch (err) { return false; }
        }
        function openBrowser(href, title) {
          if (!canFrame(href)) { openExternal(href, "link"); return; }
          var host = href;
          try { host = new URL(href).hostname.replace(/^www\./, ""); } catch (err) {}
          $("br-title").textContent = title || host;
          $("br-domain").textContent = host;
          $("br-out").href = href;
          $("br-spin").hidden = false;
          $("br-frame").title = title || host;
          $("br-frame").src = href;
          openSheet($("browser"));
        }
        $("br-frame").addEventListener("load", function () {
          if (this.getAttribute("src") !== "about:blank") $("br-spin").hidden = true;
        });
        // The one way the app leaves for a full web page. kind: "booking" | "voucher" | "youtube" | "maps" | "link".
        // Native shell: window.KFTShell.openExternal(url, kind) takes over (Capacitor in-app browser, full screen).
        // Web: Inn Style (booking, vouchers) opens in this same tab as a full page, never in a frame: its Book
        // form targets _top and Safari blocks its cookie in frames. The app's state is kept in sessionStorage
        // and restored when the user comes Back. Other links open a new tab.
        function hasShell() { try { return !!(window.KFTShell && typeof window.KFTShell.openExternal === "function"); } catch (err) { return false; } }
        function leaveNote() { return hasShell() ? "Opens the Centre\'s secure booking site, Inn Style." : "You\'ll continue on the Centre\'s booking site. Use Back to return."; }
        function openExternal(url, kind) {
          if (!isHttp(url)) return;
          if (hasShell()) { try { window.KFTShell.openExternal(url, kind || "link"); return; } catch (err) {} }
          if (kind === "booking" || kind === "voucher") {
            saveReturnState();
            if (!audio.paused) audio.pause();
            location.assign(url);
            return;
          }
          window.open(url, "_blank", "noopener");
        }
        var RETURN_KEY = "kapp.return";
        function saveReturnState() {
          var sheet = app.querySelector(".x-sheet.is-open"), scr = $("s-" + state.tab);
          var st = { tab: state.tab, scroll: scr ? scr.scrollTop : 0, vfilter: state.vfilter, at: Date.now() };
          if (sheet && sheet.id === "retreat-sheet") st.retreat = openRetreatId;
          if (sheet && sheet.id === "book-sheet") st.book = { retreat: bk.retreat, room: bk.room, guests: bk.guests, inD: bk.inD, outD: bk.outD };
          try { sessionStorage.setItem(RETURN_KEY, JSON.stringify(st)); } catch (err) {}
          // Back from Inn Style comes to the app URL with the tab in the hash
          try { history.replaceState(null, "", "#" + state.tab); } catch (err) {}
        }
        // On load: the saved state from a booking hand-off, else a tab named in the hash (#visit)
        var TABS = ["today", "daily", "listen", "watch", "read", "visit"];
        function restoreReturnState() {
          var st = null;
          try { st = JSON.parse(sessionStorage.getItem(RETURN_KEY) || "null"); sessionStorage.removeItem(RETURN_KEY); } catch (err) { st = null; }
          var hashTab = (location.hash || "").replace("#", "");
          if (!st || typeof st !== "object" || !(Date.now() - st.at < 6 * 3600e3) || TABS.indexOf(st.tab) < 0) {
            if (TABS.indexOf(hashTab) > -1) switchTab(hashTab);
            return null;
          }
          if (typeof st.vfilter === "string" && /^[a-z]+$/.test(st.vfilter)) { state.vfilter = st.vfilter; renderRetreats(); }
          switchTab(st.tab);
          var scr = $("s-" + st.tab);
          if (scr && st.scroll > 0) scr.scrollTop = st.scroll;
          if (st.retreat && retreatBy(st.retreat)) openRetreat(st.retreat);
          else if (st.retreat) st.pendingRetreat = st.retreat; // may be in the live feed only
          else if (st.book && typeof st.book === "object") {
            var b = st.book;
            if (b.retreat === null || retreatBy(b.retreat)) {
              openBook(b.retreat === null ? undefined : b.retreat);
              if (b.guests === 2) bk.guests = 2;
              if (typeof b.room === "string" && CENTRE.rooms.some(function (o) { return o.id === b.room; })) bk.room = b.room;
              if (isoToDate(b.inD)) bk.inD = b.inD;
              if (isoToDate(b.outD)) bk.outD = b.outD;
              renderBook();
            }
          }
          return st;
        }

        /* ---------- Book your stay ---------- */
        var bk = { retreat: null, room: "standard", guests: 1, inD: "", outD: "" };
        function parseISO(v) { return isoToDate(v); }
        function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
        function money(n) { return "£" + Number(n).toLocaleString("en-GB"); }
        function room(id) { for (var i = 0; i < CENTRE.rooms.length; i++) if (CENTRE.rooms[i].id === id) return CENTRE.rooms[i]; return CENTRE.rooms[0]; }
        function minN() { return CENTRE.minNights; }
        function maxN() { return CENTRE.maxNights; }
        // Individual-stay estimate from the published rates: week price per full 7 nights, then Fri/Sat at the weekend rate
        function estimate(a, b, roomId) {
          var r = room(roomId), nights = Math.round((b - a) / 864e5), total = 0, d = new Date(a);
          var weeks = Math.floor(nights / 7);
          total += weeks * r.week;
          d.setDate(d.getDate() + weeks * 7);
          for (var i = weeks * 7; i < nights; i++) { var w = d.getDay(); total += w === 5 || w === 6 ? r.weekend : r.weekday; d.setDate(d.getDate() + 1); }
          return { nights: nights, total: total };
        }
        function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
        function fmtDay(d) { return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); }
        function fmtLong(d) { return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
        // A closure that a stay touches: any night from "from" up to the night before "reopen"
        function closureHit(a, b) {
          for (var i = 0; i < CENTRE.closures.length; i++) {
            var c = CENTRE.closures[i], f = isoToDate(c.from), r = isoToDate(c.reopen);
            if (f && r && a < r && b > f) return c;
          }
          return null;
        }
        function closureText(c) { return "The Centre is closed from " + fmtLong(isoToDate(c.from)) + " and re-opens on " + fmtLong(isoToDate(c.reopen)) + "."; }
        function closuresShort() {
          return CENTRE.closures.filter(function (c) { var r = isoToDate(c.reopen); return r && r > startOfToday(); })
            .map(function (c) { var f = isoToDate(c.from), r = isoToDate(c.reopen); return "Closed from " + f.getDate() + " " + MON3[f.getMonth()] + (f.getFullYear() !== r.getFullYear() ? " " + f.getFullYear() : "") + ", re-opens " + r.getDate() + " " + MON3[r.getMonth()] + " " + r.getFullYear(); });
        }
        // Checks an individual stay; returns { ok, nights, total } or { msg, err }
        function checkStay() {
          var a = parseISO(bk.inD), b = parseISO(bk.outD);
          if (!a || !b) return { msg: "Choose your dates to see an estimate." };
          if (a < startOfToday()) return { msg: "Check-in can't be in the past.", err: true };
          if (b <= a) return { msg: "Check-out must be after check-in.", err: true };
          var c = closureHit(a, b);
          if (c) return { msg: closureText(c), err: true };
          var n = Math.round((b - a) / 864e5);
          if (n < minN()) return { msg: "Minimum stay is " + minN() + " nights.", err: true };
          if (n > maxN()) return { msg: "Maximum stay is " + maxN() + " nights.", err: true };
          var e = estimate(a, b, bk.room);
          return { ok: true, a: a, b: b, nights: n, total: e.total };
        }
        function renderBookEst() {
          if (bk.retreat !== null) return;
          var s = checkStay(), el = $("bk-est");
          el.classList.toggle("is-err", !!s.err);
          el.innerHTML = s.ok
            ? "<span>" + s.nights + " nights · " + esc(fmtDay(s.a)) + " to " + esc(fmtDay(s.b)) + "<br />" + esc(room(bk.room).name) + " room, full board</span><b>≈ " + money(s.total) + "</b>"
            : "<span>" + esc(s.msg) + "</span>";
          $("bk-go").disabled = !s.ok;
        }
        // Inn Style deep links (checked 16 Nov 2026). Both open at the room-and-price step with dates and adults filled in.
        // Retreat: /enquiries/<promotion id>?…&promotion=<id>. Individual stay: /enquiries/1?… (the "1" id is not documented by Inn Style).
        function innStyleUrl(enquiry, start, nights, guests, promo) {
          return BOOK + "/enquiries/" + encodeURIComponent(enquiry) + "?start_date=" + iso(start) + "&nights=" + nights +
            "&occupancies_attributes%5Badults%5D=" + guests + "&bo=1964" + (promo ? "&promotion=" + encodeURIComponent(promo) : "");
        }
        function bookUrl() {
          if (bk.retreat !== null) {
            var r = retreatBy(bk.retreat);
            return r ? innStyleUrl(r.promo, r.start, r.nights, bk.guests, r.promo) : null;
          }
          var s = checkStay();
          return s.ok ? innStyleUrl(1, s.a, s.nights, bk.guests) : null;
        }
        function renderBook() {
          var r = bk.retreat !== null ? retreatBy(bk.retreat) : null;
          var today = iso(startOfToday());
          var a = parseISO(bk.inD);
          var guests = '<p class="x-bk-label">Guests</p><div class="x-seg" role="group" aria-label="Guests">' +
            [1, 2].map(function (n) {
              var on = bk.guests === n, dis = !r && n === 2 && room(bk.room).sleeps < 2;
              var label = n === 1 ? "1 guest" : "2 guests<small>" + (r ? "Sharing a flat" : "Flat only") + "</small>";
              return '<button data-act="bk-guests" data-n="' + n + '" class="' + (on ? "is-on" : "") + '" aria-pressed="' + on + '"' + (dis ? " disabled" : "") + ">" + label + "</button>";
            }).join("") +
            "</div>";
          var html =
            '<div class="x-grab"></div>' +
            '<div class="x-sheet-head"><h2>' + (r ? "Book this retreat" : "Book your stay") + '</h2><button class="x-iconbtn" data-act="close-sheets" aria-label="Close">' + I.close + "</button></div>" +
            (r
              ? '<div class="x-bk-fixed u-mt2"><b>' + esc(r.name) + "</b>" + esc(r.label) + " · " + r.nights + " nights, full board</div>" +
                guests +
                '<p class="x-bk-info">The next step shows the retreat price for each room type, with your dates and guests already selected.</p>'
              : '<p class="x-bk-label">Individual stay</p><div class="x-bk-dates">' +
                  '<label>Check-in<input type="date" id="bk-in" min="' + today + '" value="' + esc(bk.inD) + '" /></label>' +
                  '<label>Check-out<input type="date" id="bk-out" min="' + (a ? iso(addDays(a, minN())) : iso(addDays(startOfToday(), minN()))) + '"' + (a ? ' max="' + iso(addDays(a, maxN())) + '"' : "") + ' value="' + esc(bk.outD) + '" /></label>' +
                '</div><p class="x-meta u-mt2">' + esc([minN() + " to " + maxN() + " nights"].concat(closuresShort()).join(". ") + ".") + "</p>" +
                '<p class="x-bk-label">Room type</p><div class="x-seg" role="group" aria-label="Room type">' +
                  CENTRE.rooms.map(function (o) {
                    var on = bk.room === o.id;
                    return '<button data-act="bk-room" data-k="' + esc(o.id) + '" class="' + (on ? "is-on" : "") + '" aria-pressed="' + on + '">' + esc(o.name) + "<small>" + money(o.weekday) + "–" + money(o.weekend) + "</small></button>";
                  }).join("") +
                "</div>" +
                guests +
                '<div class="x-bk-est" id="bk-est" aria-live="polite"></div>' +
                '<p class="x-bk-info">The next step shows the rooms free for your dates, with your dates and guests already selected.</p>') +
            '<p class="x-note-strong">' + money(CENTRE.deposit) + " non-refundable deposit secures your place." + (CENTRE.adultsOnly ? " Adults only." : "") + "</p>" +
            '<div class="x-sheet-foot"><button class="x-btn x-btn--block x-btn--lg" id="bk-go" data-act="bk-go">Continue to secure booking</button>' +
            '<p class="x-bk-small" id="bk-leave">' + leaveNote() + "</p></div>";
          $("book-sheet").setAttribute("aria-label", r ? "Book this retreat" : "Book your stay");
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
        app.addEventListener("change", function (e) {
          if (e.target && e.target.id === "daily-time") {
            var v = e.target.value;
            store("dailyReminder", /^\d{2}:\d{2}$/.test(v) ? v : "");
            toast(v ? "Reminder time saved: " + v : "Reminder time cleared");
          }
        });
        $("book-sheet").addEventListener("change", function (e) {
          if (e.target.id === "bk-in") {
            bk.inD = e.target.value;
            var a = parseISO(bk.inD);
            if (a) {
              var lo = addDays(a, minN()), hi = addDays(a, maxN()), b = parseISO(bk.outD);
              $("bk-out").min = iso(lo);
              $("bk-out").max = iso(hi);
              if (!b || b < lo || b > hi) { bk.outD = iso(lo); $("bk-out").value = bk.outD; }
            }
          }
          if (e.target.id === "bk-out") bk.outD = e.target.value;
          renderBookEst();
        });

        /* ---------- Daily: a 365-day journey of passages from data/daily.json (nothing built in) ---------- */
        // Contract: README "Daily data contract". Missing or empty file -> a calm empty state, nothing invented.
        var DAILY = { loaded: false, list: [], byDay: {}, flows: [] };
        var dailyView = { day: null, flow: null };
        var DAILY_CACHE = "kft-daily-v1";
        var dailyFav = loadObj("dailyFav");      // day -> { at, title, text, source, flowTitle }
        var dailyDl = load("dailyDl", null);     // { at, files, bytes, failed } after "Download all readings"
        var dailyBusy = null;                    // { done, total, bytes } while downloading
        function dailyStart() {
          var s = load("dailyStart", "");
          return isoToDate(s) ? s : "";
        }
        // Day 1 is the user's start date; the journey wraps after day 365
        function dailyDayNumber() {
          var s = isoToDate(dailyStart());
          if (!s) return 1;
          var n = Math.round((startOfToday() - s) / 864e5);
          if (n < 0) n = 0;
          return (n % 365) + 1;
        }
        function validPassage(p) {
          if (!p || typeof p !== "object") return null;
          var day = Number(p.day), text = typeof p.text === "string" ? p.text.trim() : "";
          if (!(day >= 1 && day <= 365) || Math.floor(day) !== day || !text) return null;
          var src = p.source && typeof p.source === "object" ? p.source : {};
          var o = {
            day: day, text: text, title: txt(p.title),
            flowId: txt(p.flowId), flowTitle: txt(p.flowTitle),
            flowIndex: Number(p.flowIndex) >= 1 ? Math.floor(p.flowIndex) : null,
            flowLength: Number(p.flowLength) >= 1 ? Math.floor(p.flowLength) : null,
            source: { work: txt(src.work), date: txt(src.date), place: txt(src.place) },
            audioUrl: isHttp(p.audioUrl) ? p.audioUrl : "",
            durationSec: Number(p.durationSec) > 0 ? Math.round(p.durationSec) : null,
            transcriptUrl: isHttp(p.transcriptUrl) ? p.transcriptUrl : ""
          };
          return o;
        }
        function applyDaily(d) {
          DAILY = { loaded: true, list: [], byDay: {}, flows: [] };
          var raw = d && typeof d === "object" && Array.isArray(d.passages) ? d.passages : [];
          raw.forEach(function (p) { var o = validPassage(p); if (o && !DAILY.byDay[o.day]) { DAILY.byDay[o.day] = o; DAILY.list.push(o); } });
          DAILY.list.sort(function (a, b) { return a.day - b.day; });
          var seen = {};
          DAILY.list.forEach(function (p) {
            if (!p.flowId) return;
            if (!seen[p.flowId]) { seen[p.flowId] = { id: p.flowId, title: p.flowTitle || p.flowId, days: [] }; DAILY.flows.push(seen[p.flowId]); }
            seen[p.flowId].days.push(p.day);
          });
          if (DAILY.list.length && !dailyStart()) store("dailyStart", iso(startOfToday()));
          // Readings with audio play in the app's player, as the "Krishnamurti Daily" show
          SHOWS.daily.eps = DAILY.list.filter(function (p) { return p.audioUrl; }).map(dailyEp);
          SHOWS.daily.eps.forEach(function (ep) { EPS[ep.id] = ep; });
          renderDaily();
          renderToday();
          dailyTab();
        }
        // The Daily tab is shown only once data/daily.json has passages (hidden in index.html until then)
        function dailyTab() {
          var b = app.querySelector('.x-tab[data-tab="daily"]');
          if (!b) return;
          b.hidden = !DAILY.list.length;
          if (b.hidden && DAILY.loaded && state.tab === "daily") switchTab("today");
        }
        function dailyEp(p) {
          return { id: "d" + p.day, title: p.title || "Day " + p.day + (p.flowTitle ? " · " + p.flowTitle : ""), date: "", min: p.durationSec ? Math.max(1, Math.round(p.durationSec / 60)) : null, url: p.audioUrl, show: "daily", desc: p.text.split(/\n\s*\n/)[0], day: p.day };
        }
        function loadDaily() {
          if (!window.fetch || IS_PREVIEW) { DAILY.loaded = true; renderDaily(); dailyTab(); return; }
          fetch("data/daily.json", { cache: "no-cache" })
            .then(function (r) { if (!r.ok) throw new Error("daily " + r.status); return r.json(); })
            .then(applyDaily)
            .catch(function () { DAILY.loaded = true; renderDaily(); renderToday(); dailyTab(); });
        }
        function paras(text) {
          return text.split(/\n\s*\n/).map(function (t) { return t.trim(); }).filter(Boolean).map(function (t) { return "<p>" + esc(t).replace(/\n/g, "<br />") + "</p>"; }).join("");
        }
        function sourceLine(p) { return joinMeta(p.source.work, p.source.place, p.source.date); }
        function flowLine(p) {
          if (!p.flowTitle) return "";
          return "Flow: " + p.flowTitle + (p.flowIndex && p.flowLength ? ", " + p.flowIndex + " of " + p.flowLength : "");
        }
        function shareText(p) { return (p.title ? p.title + "\n\n" : "") + p.text + (sourceLine(p) ? "\n\n" + sourceLine(p) : "") + "\n\nJ. Krishnamurti"; }
        function favBtn(day) {
          var on = !!dailyFav[day];
          return '<button class="x-act' + (on ? " is-on" : "") + '" data-act="dfav" data-day="' + day + '" aria-pressed="' + on + '">' + I.heart + "Favourite" + "</button>";
        }
        function passageCard(p, compact) {
          var ep = p.audioUrl ? getEp("d" + p.day) : null;
          return '<article class="x-card x-passage x-daily-card' + (compact ? " is-compact" : "") + '" aria-labelledby="dp-' + p.day + '">' +
            '<p class="x-smallcaps x-accent">Day ' + p.day + " of 365</p>" +
            (flowLine(p) ? '<p class="x-meta x-flowline">' + esc(flowLine(p)) + "</p>" : "") +
            (p.title ? '<h2 class="x-daily-title" id="dp-' + p.day + '">' + esc(p.title) + "</h2>" : '<h2 class="x-visually-hidden" id="dp-' + p.day + '">Day ' + p.day + "</h2>") +
            '<div class="x-daily-text">' + (compact ? "<p>" + esc(p.text.split(/\n\s*\n/)[0]) + "</p>" : paras(p.text)) + "</div>" +
            (sourceLine(p) ? '<p class="x-meta x-source">' + esc(sourceLine(p)) + "</p>" : "") +
            '<div class="x-actions">' +
              (compact ? '<button class="x-act" data-act="dopen" data-day="' + p.day + '">' + I.chev + "Read</button>" : "") +
              (ep ? '<button class="x-act" data-act="play" data-ep="' + esc(ep.id) + '" aria-label="Play reading for day ' + p.day + '">' + PP + "<span>Listen</span></button>" : "") +
              favBtn(p.day) +
              '<button class="x-act" data-act="dshare" data-day="' + p.day + '">' + I.share + "Share</button>" +
            "</div>" +
            (!compact && p.transcriptUrl ? '<a class="x-linkrow x-daily-tr"' + (canFrame(p.transcriptUrl) ? BR(p.transcriptUrl, "Transcript") : ' href="' + esc(p.transcriptUrl) + '" data-act="ext" data-kind="link"') + ">Read the full transcript" + I.chev + "</a>" : "") +
          "</article>";
        }
        function fmtBytes(n) { return n >= 1e9 ? (n / 1e9).toFixed(1) + " GB" : n >= 1e6 ? Math.round(n / 1e6) + " MB" : Math.max(1, Math.round(n / 1e3)) + " KB"; }
        function dailyDlBox() {
          var withAudio = DAILY.list.filter(function (p) { return p.audioUrl; }).length;
          var h = '<div class="x-card x-info" id="daily-dl"><h3>Offline</h3>';
          if (dailyBusy) {
            var pct = dailyBusy.total ? Math.floor((dailyBusy.done / dailyBusy.total) * 100) : 0;
            h += '<p aria-live="polite">Saving readings… ' + dailyBusy.done + " of " + dailyBusy.total + " (" + fmtBytes(dailyBusy.bytes) + ")</p>" +
              '<div class="x-bar u-mt2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Download progress"><i style="width:' + pct + '%"></i></div>';
          } else if (dailyDl && dailyDl.files) {
            h += "<p>Saved on this device: " + esc(joinMeta((dailyDl.passages || 0) + " passages", (dailyDl.audio || 0) + " audio readings", fmtBytes(dailyDl.bytes || 0))) + "." + (dailyDl.failed ? " " + dailyDl.failed + (dailyDl.failed === 1 ? " file" : " files") + " could not be saved." : "") + "</p>" +
              '<button class="x-btn x-btn--ghost x-btn--block u-mt3" data-act="ddl-remove">Remove downloads</button>';
          } else {
            h += "<p>Save every passage" + (withAudio ? " and its reading (" + withAudio + " audio files)" : "") + " on this device, to read and listen without a connection.</p>" +
              '<button class="x-btn x-btn--ghost x-btn--block u-mt3" data-act="ddl">Download all readings</button>';
          }
          return h + "</div>";
        }
        function renderDaily() {
          var el = $("s-daily");
          if (!el) return;
          if (!DAILY.loaded) { el.innerHTML = '<div class="x-skel" aria-hidden="true"><i></i><i></i><i></i></div>'; return; }
          if (!DAILY.list.length) {
            el.innerHTML = '<div class="x-empty-state"><p class="x-smallcaps">Krishnamurti Daily</p><h2>Daily passages coming soon</h2>' +
              "<p>A passage from Krishnamurti for each day of the year will appear here.</p></div>";
            return;
          }
          var today = dailyDayNumber();
          var day = dailyView.day || today;
          var p = DAILY.byDay[day];
          var days = DAILY.list.map(function (x) { return x.day; }).filter(function (d) { return d <= today; });
          var prev = days.filter(function (d) { return d < day; }).pop(), next = days.filter(function (d) { return d > day; })[0];
          var favDays = Object.keys(dailyFav).map(Number).filter(function (d) { return d >= 1 && d <= 365; }).sort(function (a, b) { return (dailyFav[b].at || 0) - (dailyFav[a].at || 0); });
          var flow = dailyView.flow ? DAILY.flows.filter(function (f) { return f.id === dailyView.flow; })[0] : null;
          el.innerHTML =
            '<div class="x-pad"><p class="x-smallcaps">' + esc(day === today ? "Today · " + new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : "Day " + day) + "</p></div>" +
            (p ? passageCard(p, false) : '<div class="x-card x-info u-mt4"><p>There is no passage for day ' + day + " yet.</p></div>") +
            '<div class="x-daynav" role="group" aria-label="Browse days">' +
              '<button class="x-btn x-btn--ghost" data-act="dday" data-day="' + (prev || "") + '"' + (prev ? "" : " disabled") + ">Previous day</button>" +
              (day !== today ? '<button class="x-btn x-btn--ghost" data-act="dday" data-day="' + today + '">Today</button>' : "") +
              '<button class="x-btn x-btn--ghost" data-act="dday" data-day="' + (next || "") + '"' + (next ? "" : " disabled") + ">Next day</button>" +
            "</div>" +
            (DAILY.flows.length ? '<div class="x-sec"><div class="x-sec-head"><h2 class="x-sec-title">Flows</h2></div>' +
              (flow
                ? '<p class="x-pad x-meta">' + esc(flow.title) + ' <button class="x-act" data-act="dflow" data-flow="">All flows</button></p><ul class="x-list">' +
                  flow.days.filter(function (d) { return d <= today; }).map(function (d) { var q = DAILY.byDay[d]; return '<li class="x-row"><button class="x-row-main" data-act="dday" data-day="' + d + '"><span class="x-row-title">' + esc(q.title || "Day " + d) + '</span><span class="x-meta">' + esc(joinMeta("Day " + d, q.flowIndex && q.flowLength ? q.flowIndex + " of " + q.flowLength : "")) + "</span></button></li>"; }).join("") +
                  (flow.days.some(function (d) { return d > today; }) ? '<li class="x-row x-meta">' + flow.days.filter(function (d) { return d > today; }).length + " more to come in this flow</li>" : "") + "</ul>"
                : '<ul class="x-list">' + DAILY.flows.map(function (f) {
                    var reached = f.days.filter(function (d) { return d <= today; }).length;
                    return '<li class="x-row"><button class="x-row-main" data-act="dflow" data-flow="' + esc(f.id) + '"><span class="x-row-title">' + esc(f.title) + '</span><span class="x-meta">' + esc(joinMeta(f.days.length + (f.days.length === 1 ? " passage" : " passages"), reached ? reached + " so far" : "Not reached yet")) + "</span></button></li>";
                  }).join("") + "</ul>") +
              "</div>" : "") +
            '<div class="x-sec"><div class="x-sec-head"><h2 class="x-sec-title">Favourites</h2></div>' +
              (favDays.length ? '<ul class="x-list">' + favDays.map(function (d) {
                var f = dailyFav[d];
                return '<li class="x-row"><button class="x-row-main" data-act="dday" data-day="' + d + '"><span class="x-row-title x-clamp2">' + esc(f.title || f.text || "Day " + d) + '</span><span class="x-meta">' + esc(joinMeta("Day " + d, f.source)) + "</span></button></li>";
              }).join("") + "</ul>" : '<p class="x-pad x-meta">Passages you add to favourites are kept here, also offline.</p>') +
            "</div>" +
            '<div class="x-sec">' + dailyDlBox() + "</div>" +
            '<div class="x-sec"><div class="x-card x-info"><h3>Reminder</h3>' +
              '<label class="x-field">Daily reminder time<input type="time" id="daily-time" value="' + esc(/^\d{2}:\d{2}$/.test(load("dailyReminder", "")) ? load("dailyReminder", "") : "") + '" /></label>' +
              "<p>Reminders arrive in the app version.</p>" +
            "</div></div>" +
            '<div class="x-sec"><div class="x-card x-info"><h3>Your journey</h3>' +
              "<p>Started " + esc(isoToDate(dailyStart()) ? fmtLong(isoToDate(dailyStart())) : "today") + ". Today is day " + today + " of 365.</p>" +
              '<button class="x-btn x-btn--ghost x-btn--block u-mt3" data-act="drestart"' + (state.restartAsk ? ' aria-describedby="restart-q"' : "") + ">" + (state.restartAsk ? "Yes, start again from day 1" : "Restart from day 1") + "</button>" +
              (state.restartAsk ? '<p id="restart-q">Your favourites and downloads are kept.</p>' : "") +
            "</div></div>";
          syncPlay();
        }
        function openDailyDay(d) {
          dailyView.day = d;
          switchTab("daily");
          renderDaily();
          $("s-daily").scrollTop = 0;
        }
        function toggleDailyFav(d) {
          var p = DAILY.byDay[d];
          if (dailyFav[d]) delete dailyFav[d];
          else if (p) dailyFav[d] = { at: Date.now(), title: p.title || p.text.split(/\n\s*\n/)[0].slice(0, 140), text: p.text, source: sourceLine(p), flowTitle: p.flowTitle };
          store("dailyFav", dailyFav);
          [].forEach.call(app.querySelectorAll('[data-act="dfav"][data-day="' + d + '"]'), function (b) { b.outerHTML = favBtn(d); });
          toast(dailyFav[d] ? "Added to favourites" : "Removed from favourites");
          if (state.tab !== "daily") renderDaily();
        }
        function shareDaily(d) {
          var p = DAILY.byDay[d];
          if (!p) return;
          var text = shareText(p);
          if (navigator.share) navigator.share({ title: p.title || "Krishnamurti Daily", text: text }).catch(function () {});
          else if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast("Passage copied"); }, function () { toast("Copy is not available here"); });
          else toast("Copy is not available here");
        }
        // Saves daily.json, transcripts and every reading in the Cache API. Audio is stored under the
        // same-origin offline address the player already uses (sw.js serves it with byte ranges).
        function downloadDaily() {
          if (dailyBusy) return;
          if (!canDownload()) { toast("Downloads work in the installed app, or once this page has loaded fully."); return; }
          var jobs = [{ kind: "json", url: new URL("data/daily.json", location.href).href }];
          DAILY.list.forEach(function (p) {
            if (p.transcriptUrl) jobs.push({ kind: "text", url: p.transcriptUrl });
            if (p.audioUrl) jobs.push({ kind: "audio", url: p.audioUrl, id: "d" + p.day });
          });
          dailyBusy = { done: 0, total: jobs.length, bytes: 0 };
          var failed = 0, gotText = false, gotAudio = 0;
          renderDailyDl();
          var i = 0;
          function step() {
            if (i >= jobs.length) {
              dailyDl = { at: Date.now(), files: dailyBusy.done - failed, passages: gotText ? DAILY.list.length : 0, audio: gotAudio, bytes: dailyBusy.bytes, failed: failed };
              store("dailyDl", dailyDl);
              dailyBusy = null;
              store("dl", downloads);
              renderDailyDl();
              toast(failed ? "Saved, except " + failed + " files" : "All readings saved for offline use");
              return;
            }
            var j = jobs[i++];
            fetch(j.url, { mode: "cors" }).then(function (r) {
              if (!r.ok) throw new Error(String(r.status));
              return r.blob();
            }).then(function (blob) {
              var key = j.kind === "audio" ? offlineUrl(j.id) : j.url;
              var cacheName = j.kind === "audio" ? AUDIO_CACHE : DAILY_CACHE;
              return caches.open(cacheName).then(function (c) {
                return c.put(key, new Response(blob, { headers: { "Content-Type": blob.type || (j.kind === "audio" ? "audio/mpeg" : "application/json"), "Content-Length": String(blob.size) } }));
              }).then(function () {
                dailyBusy.bytes += blob.size;
                if (j.kind === "audio") { gotAudio++; downloads[j.id] = Date.now(); remember(getEp(j.id), "ep"); }
                if (j.kind === "json") gotText = true;
              });
            }).catch(function () { failed++; }).then(function () {
              dailyBusy.done++;
              renderDailyDl();
              step();
            });
          }
          step();
        }
        function removeDailyDownloads() {
          DAILY.list.forEach(function (p) { if (downloads["d" + p.day]) delete downloads["d" + p.day]; });
          store("dl", downloads);
          dailyDl = null;
          store("dailyDl", null);
          if (window.caches) {
            caches.delete(DAILY_CACHE).catch(function () {});
            caches.open(AUDIO_CACHE).then(function (c) { DAILY.list.forEach(function (p) { if (p.audioUrl) c.delete(offlineUrl("d" + p.day)); }); }).catch(function () {});
          }
          tidyLibrary();
          renderDailyDl();
          toast("Downloads removed");
        }
        function renderDailyDl() {
          var box = $("daily-dl");
          if (box) box.outerHTML = dailyDlBox();
        }
        // Today's passage on the Today tab, only when the data has one
        function todayDailyCard() {
          var p = DAILY.byDay[dailyDayNumber()];
          return p ? passageCard(p, true) : "";
        }

        /* ---------- Cross-links (data/matches.json): the same talk as audio and as video ---------- */
        var MATCHES = null, matchesLoading = false;
        function loadMatches() {
          if (MATCHES || matchesLoading || !FILES["matches.json"]) return;
          matchesLoading = true;
          getJSON("matches.json").then(function (m) {
            MATCHES = m && typeof m === "object" && m.talks && m.byItem ? m : { talks: {}, byItem: {}, fullTalk: {} };
            var box = $("xlinks");
            if (box) box.innerHTML = crossLinks(box.getAttribute("data-for"));
          }).catch(function () { matchesLoading = false; });
        }
        // Rows linking an episode to its video(s), or a video to its episode(s), from the data only
        function crossLinks(id) {
          if (!MATCHES || !id) return "";
          var keys = Array.isArray(MATCHES.byItem[id]) ? MATCHES.byItem[id] : [];
          var rows = [], seen = {};
          keys.forEach(function (k) {
            var t = MATCHES.talks[k];
            if (!t || typeof t !== "object") return;
            var label = txt(t.label);
            (Array.isArray(t.v) ? t.v : []).forEach(function (x) {
              var vid = Array.isArray(x) ? txt(x[1]) : "";
              if (!/^[\w-]{6,20}$/.test(vid) || vid === id || seen[vid]) return;
              seen[vid] = 1;
              var v = VIDS[vid];
              rows.push('<li><button class="x-rel" data-act="xvid" data-v="' + esc(vid) + '"><span class="x-rel-body"><span class="x-kind">Watch this talk</span><span class="x-row-title">' + esc(v ? v.title : label) + '</span><span class="x-meta">' + esc(joinMeta(label, v ? v.ch : "")) + "</span></span>" + I.chev + "</button></li>");
            });
            (Array.isArray(t.c) ? t.c : []).map(function (c) { return [c, -1]; }).concat(Array.isArray(t.u) ? t.u : []).forEach(function (x) {
              var key = Array.isArray(x) ? txt(x[0]) : "";
              if (!/^[uc]\d+$/.test(key) || key === id || seen[key]) return;
              seen[key] = 1;
              var ep = getEp(key), ci = Array.isArray(x) && typeof x[1] === "number" ? x[1] : -1;
              rows.push('<li><button class="x-rel" data-act="xep" data-ep="' + esc(key) + '" data-ci="' + ci + '"><span class="x-rel-body"><span class="x-kind">Listen as audio</span><span class="x-row-title">' + esc(ep ? ep.title : label) + '</span><span class="x-meta">' + esc(joinMeta(label, key.charAt(0) === "u" ? "Urgency of Change" : "The Krishnamurti Collection", ci > -1 ? "part of the episode" : "")) + "</span></span>" + I.chev + "</button></li>");
            });
          });
          return rows.length ? '<div class="x-sec u-mt6"><h2 class="x-sec-title">Also in the app</h2><ul class="x-rel-list">' + rows.join("") + "</ul></div>" : "";
        }
        // Opens an episode by key, loading the full podcast lists first when needed
        function openEpisodeKey(key, ci) {
          var ep = getEp(key);
          function go(e) {
            openEpisode(e.id);
            if (ci > -1 && e.chapters && e.chapters[ci] && e.chapters[ci].start !== null) {
              var b = $("detail-body").querySelector('[data-act="chap"][data-t="' + e.chapters[ci].start + '"]');
              if (b) b.scrollIntoView({ block: "center" });
            }
          }
          if (ep && (ep.chapters || ci < 0 || !FILES["podcasts/uoc.json"])) { go(ep); return; }
          loadFullPodcasts();
          var tries = 0, t = setInterval(function () {
            var e = EPS[key];
            if ((e && (e.chapters || ci < 0)) || ++tries > 40) { clearInterval(t); if (e || ep) go(e || ep); else toast("This episode could not load. Check your connection."); }
          }, 150);
        }

        /* ---------- Search across the app (data/search.json, loaded on first use, cached by the service worker) ---------- */
        var SEARCH = null, searchLoading = false;
        var STYPE = { u: "Urgency of Change", c: "Collection", cs: "Collection series", v: "Video", pl: "Playlist", a: "Archive" };
        function norm(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
        function loadSearch() {
          if (SEARCH || searchLoading || !FILES["search.json"]) return;
          searchLoading = true;
          getJSON("search.json").then(function (x) {
            var f = x && Array.isArray(x.fields) ? x.fields : [], at = function (n) { return f.indexOf(n); };
            var iT = at("type"), iI = at("id"), iTi = at("title"), iP = at("place"), iY = at("year"), iG = at("group"), iE = at("extra"), iK = at("kind");
            SEARCH = (Array.isArray(x.items) ? x.items : []).filter(function (r) { return Array.isArray(r) && STYPE[r[iT]] && txt(r[iI]) && txt(r[iTi]); }).map(function (r) {
              var o = { type: r[iT], id: txt(r[iI]), title: txt(r[iTi]), place: txt(r[iP]), year: txt(r[iY]), group: txt(r[iG]), extra: txt(r[iE]), kind: txt(r[iK]) };
              o.hay = norm([o.title, o.place, o.year, o.group, o.extra].join(" "));
              return o;
            });
            var q = $("search");
            if (q && q.value.trim()) runSearch(q.value);
          }).catch(function () { searchLoading = false; });
        }
        function resultRow(o) {
          var meta = joinMeta(STYPE[o.type], o.type === "v" ? (o.group === "kft" ? "KFT Channel" : o.group === "official" ? "Official Channel" : "") : "", o.place, o.year, o.type === "a" || o.type === "v" ? o.extra : "");
          return '<li><button class="x-row" data-act="sres" data-type="' + esc(o.type) + '" data-id="' + esc(o.id) + '"><span class="x-row-main"><span class="x-row-title">' + esc(o.title) + '</span><span class="x-meta">' + esc(meta) + "</span></span>" + I.chev + "</button></li>";
        }
        function runSearch(raw) {
          var box = $("search-results");
          if (!box) return;
          var toks = norm(raw).split(/\s+/).filter(function (t) { return t.length > 1; });
          if (!toks.length) { box.innerHTML = ""; box.hidden = true; return; }
          box.hidden = false;
          if (!SEARCH) { box.innerHTML = FILES["search.json"] ? '<div class="x-skel" aria-hidden="true"><i></i><i></i></div>' : ""; loadSearch(); return; }
          var hits = [];
          for (var i = 0; i < SEARCH.length && hits.length < 200; i++) {
            var o = SEARCH[i], ok = true;
            for (var j = 0; j < toks.length; j++) if (o.hay.indexOf(toks[j]) < 0) { ok = false; break; }
            if (ok) hits.push(o);
          }
          // Titles that match every word come first; then podcasts, videos, archive
          var rank = { u: 1, c: 1, cs: 0, v: 2, pl: 3, a: 4 };
          hits.sort(function (a, b) {
            var ta = toks.every(function (t) { return norm(a.title).indexOf(t) > -1; }) ? 0 : 1, tb = toks.every(function (t) { return norm(b.title).indexOf(t) > -1; }) ? 0 : 1;
            return ta - tb || rank[a.type] - rank[b.type];
          });
          var shown = hits.slice(0, state.searchMore || 20);
          box.innerHTML = '<div class="x-sec-head u-mt4"><h2 class="x-sec-title">Across the app</h2><span class="x-meta" aria-live="polite">' + (hits.length >= 200 ? "200+" : hits.length) + (hits.length === 1 ? " result" : " results") + "</span></div>" +
            (shown.length ? '<ul class="x-list">' + shown.map(resultRow).join("") + "</ul>" : '<p class="x-empty">Nothing matches. Try fewer words.</p>') +
            (hits.length > shown.length ? '<button class="x-btn x-btn--ghost x-more" data-act="smore">Show more results</button>' : "");
        }
        var archiveIdx = null;
        function openSearchResult(type, id) {
          var o = null;
          for (var i = 0; SEARCH && i < SEARCH.length; i++) if (SEARCH[i].type === type && SEARCH[i].id === id) { o = SEARCH[i]; break; }
          if (type === "u" || type === "c") { openEpisodeKey(id, -1); return; }
          if (type === "cs") { state.show = "kc"; state.series = id; state.seriesName = o ? o.title : ""; switchTab("listen"); renderListen(); $("s-listen").scrollTop = 0; return; }
          if (type === "v" || (type === "a" && o && /^[\w-]{6,20}$/.test(o.group))) {
            var vid = type === "v" ? id : o.group;
            if (!VIDS[vid] && o) VIDS[vid] = { id: vid, title: o.title, date: o.year, thumb: "", ch: type === "a" ? "Archive" : (VIDEOS[o.group === "official" ? "off" : o.group] || { name: "YouTube" }).name, k: o.group === "official" ? "off" : VIDEOS[o.group] ? o.group : "off", kind: videoKind(o.kind, o.kind === "short", o.group === "official" ? "off" : "kft"), iso: "" };
            openVideo(vid);
            return;
          }
          if (type === "pl") { openExternal("https://www.youtube.com/playlist?list=" + encodeURIComponent(id), "youtube"); return; }
          if (type === "a") {
            // Archive item without a YouTube ID: its kfoundation.org media page, found in data/archive/index.json
            var open = function () {
              var row = (archiveIdx || []).filter(function (r) { return String(r.id) === id; })[0];
              if (row && /^[\w-]+$/.test(txt(row.s))) openBrowser("https://kfoundation.org/media/" + row.s + "/", o ? o.title : "Archive");
              else toast("This archive item has no page in the app yet.");
            };
            if (archiveIdx) { open(); return; }
            getJSON("archive/index.json").then(function (x) { archiveIdx = x && Array.isArray(x.rows) ? x.rows : []; open(); }).catch(function () { toast("The archive could not load. Check your connection."); });
          }
        }

        /* ---------- Read ---------- */
        // Each genre has its own archive page on kfoundation.org (/media-genre/<slug>/, the WordPress term link;
        // "Question & Answer" → question-answer). Checked 17 Nov 2026 for all eight genres.
        function genreUrl(name) {
          var slug = String(name).toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
          return slug ? "https://kfoundation.org/media-genre/" + slug + "/" : "https://kfoundation.org/video/";
        }
        function genreTiles() {
          return GENRES.map(function (g) { return '<a class="x-tile"' + BR(genreUrl(g[0]), g[0] + " in the archive") + ' data-q="' + esc(g[0].toLowerCase()) + '"><b>' + esc(g[0]) + "</b><span>" + esc(g[1]) + "</span></a>"; }).join("");
        }
        // kfoundation.org blocks its images on other sites, so only the feed's own copy (data/img/…) is used;
        // without one, a calm tinted tile with the title's first letter
        var IMGMAP = {};
        function letterTile(title) { return '<span class="x-letter" aria-hidden="true">' + esc((title.match(/[A-Za-z]/) || ["K"])[0].toUpperCase()) + "</span>"; }
        function articleArt(a) {
          var local = IMGMAP[a[3]];
          return local ? '<img src="' + esc(local) + '" alt="" loading="lazy" data-letter="' + esc(a[0]) + '" />' : letterTile(a[0]);
        }
        function renderRead() {
          $("s-read").innerHTML =
            '<label class="x-search">' + I.search + '<input id="search" type="search" placeholder="Search talks, podcasts, videos…" aria-label="Search talks, podcasts, videos and this page" autocomplete="off" /></label>' +
            '<div id="search-results" hidden></div>' +
            '<p class="x-note" id="search-note" hidden>Also on this page:</p>' +
            '<div class="x-sec" data-sec><div class="x-sec-head"><h2 class="x-sec-title">Quotes on Observation</h2></div><div class="x-rail">' +
              QUOTES.map(function (q) { return '<figure class="x-quote" data-q="' + esc((q[0] + " " + q[1]).toLowerCase()) + '"><p>' + esc(q[0]) + '</p><figcaption class="x-meta">' + esc(q[1]) + "</figcaption></figure>"; }).join("") +
            "</div></div>" +
            '<div class="x-sec" data-sec><div class="x-sec-head"><h2 class="x-sec-title">Articles</h2></div><div class="x-articles">' +
              ARTICLES.map(function (a) { return '<a class="x-article"' + BR(a[2], a[0]) + ' data-q="' + esc((a[0] + " " + a[1]).toLowerCase()) + '">' + articleArt(a) + "<div><h3>" + esc(a[0]) + '</h3><p class="x-clamp2">‘' + esc(a[1]) + "’</p></div></a>"; }).join("") +
            "</div></div>" +
            '<div class="x-sec" data-sec><div class="x-sec-head"><h2 class="x-sec-title">Browse the archive</h2></div><div class="x-grid">' +
              genreTiles() +
            "</div></div>" +
            '<div class="x-sec" data-sec><div class="x-sec-head"><h2 class="x-sec-title">Start here</h2></div><div class="x-linklist">' +
              START.map(function (s) { return '<a class="x-linkrow"' + BR(s[1], s[0]) + ' data-q="' + esc(s[0].toLowerCase()) + '">' + esc(s[0]) + I.chev + "</a>"; }).join("") +
            "</div></div>" +
            '<p class="x-empty" id="search-empty" hidden>Nothing on this tab matches.</p>';
          $("search").addEventListener("focus", loadSearch);
          $("search").addEventListener("input", function () {
            state.searchMore = 20;
            runSearch(this.value);
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
            $("search-empty").hidden = any || !!SEARCH;
            $("search-note").hidden = !q || !any;
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
              '<div class="x-chips" role="group" aria-label="Retreat type" id="vchips"></div>' +
              '<ul class="x-list" id="retreats"></ul>' +
            "</div>" +
            '<div class="x-sec" id="centre-info"></div>' +
            '<div class="x-sec x-linklist">' +
              '<a class="x-linkrow" href="' + BOOK + '/gift-vouchers" data-act="ext" data-kind="voucher">Gift vouchers' + I.out + "</a>" +
              '<div class="x-info x-gettinghere"><h3>Getting here</h3>' +
                '<p>11 miles from Winchester. Trains from London Waterloo to Petersfield or Winchester. About an hour from Heathrow.</p>' +
                '<a class="x-btn x-btn--ghost u-mt3" href="https://www.google.com/maps/search/?api=1&amp;query=Krishnamurti%20Centre%2C%20Brockwood%20Park%2C%20Bramdean%2C%20Alresford%20SO24%200LQ" data-act="ext" data-kind="maps">Open in Maps ' + I.out + "</a>" +
              "</div>" +
            "</div>";
          renderCentreInfo();
          renderRetreats();
        }
        // Rates, day visits, closure and contact, all from CENTRE (data/centre.json)
        function renderCentreInfo() {
          var box = $("centre-info");
          if (!box) return;
          var rs = CENTRE.rooms, red = CENTRE.reduced, row = function (label, small, key) {
            return '<tr><th scope="row">' + esc(label) + "<small>" + esc(small) + "</small></th>" + rs.map(function (o) { return "<td>" + money(o[key]) + "</td>"; }).join("") + "</tr>";
          };
          var flats = rs.filter(function (o) { return o.sleeps > 1; }).map(function (o) { return o.name; });
          var notes = [CENTRE.minNights + " to " + CENTRE.maxNights + " nights. Full board, vegetarian."];
          if (flats.length) notes.push(flats.join(" and ") + " sleeps two.");
          if (red && red.weekday) notes.push((red.rooms ? (red.rooms === 3 ? "Three" : red.rooms) + " rooms at a reduced price of " : "Reduced price: ") + money(red.weekday) + (red.weekend ? " (" + money(red.weekend) + " Fri/Sat)" : "") + ".");
          if (CENTRE.checkIn && CENTRE.checkOut) notes.push("Check-in from " + hm(CENTRE.checkIn) + ", check-out by " + hm(CENTRE.checkOut) + ".");
          if (CENTRE.adultsOnly) notes.push("Adults only.");
          box.innerHTML =
            '<div class="x-card x-info"><h3>Individual stays</h3>' +
              '<div class="x-tbl-wrap"><table class="x-tbl"><thead><tr><th scope="col">Per night</th>' + rs.map(function (o) { return '<th scope="col">' + esc(o.name) + "</th>"; }).join("") + "</tr></thead><tbody>" +
                row("Weekday", "Sun–Thu", "weekday") + row("Weekend", "Fri–Sat", "weekend") + row("Week", "7 nights", "week") +
              "</tbody></table></div>" +
              "<p>" + esc(notes.join(" ")) + "</p>" +
              '<button class="x-btn x-btn--block u-mt3" data-act="book">Check availability</button>' +
            "</div>" +
            '<div class="x-card x-info u-mt4"><h3>Day visits</h3>' +
              '<dl class="x-dl">' + CENTRE.dayVisits.map(function (d) { return "<dt>" + esc(d.label) + "</dt><dd>" + (d.price ? money(d.price) : "Free") + "</dd>"; }).join("") + "</dl>" +
              "<p>Only when no event is taking place. Donations welcome. Book in advance by phone or email.</p>" +
              '<a class="x-btn x-btn--ghost x-btn--block u-mt3" href="tel:' + esc(CENTRE.phone.tel) + '">Call ' + esc(CENTRE.phone.display) + "</a>" +
            "</div>" +
            closuresShort().map(function (c) { return '<p class="x-closure">Annual closure: ' + esc(c.replace(/^Closed from /, "")) + "</p>"; }).join("");
        }
        function hm(v) { var m = /^(\d{1,2}):(\d{2})$/.exec(v || ""); if (!m) return esc(v || ""); var h = +m[1]; return (h % 12 || 12) + (m[2] !== "00" ? ":" + m[2] : "") + (h < 12 ? "am" : "pm"); }
        function renderRetreats() {
          $("vchips").innerHTML = VF.map(function (f) { return '<button class="x-chip' + (state.vfilter === f[0] ? " is-on" : "") + '" data-act="vfilter" data-f="' + f[0] + '" aria-pressed="' + (state.vfilter === f[0]) + '">' + f[1] + "</button>"; }).join("");
          var lastMonth = "";
          var html = upcoming().map(function (i) {
            var r = RETREATS[i];
            if (state.vfilter !== "all" && r.type !== state.vfilter) return "";
            // A small month header before the first retreat of each month
            var m = r.start.toLocaleDateString("en-GB", { month: "long", year: "numeric" }), head = "";
            if (m !== lastMonth) { lastMonth = m; head = '<li class="x-month" aria-hidden="true">' + esc(m) + "</li>"; }
            return head + '<li><button class="x-row" data-act="retreat" data-i="' + r.promo + '"><span class="x-row-main"><span class="x-row-title">' + esc(r.name) + '</span><span class="x-meta">' + esc(r.label) + "</span></span>" + I.chev + "</button></li>";
          }).join("");
          $("retreats").innerHTML = html || '<li class="x-empty">No upcoming retreats of this type yet.</li>';
        }
        var openRetreatId = null;
        function openRetreat(i) {
          var r = retreatBy(i);
          if (!r) return;
          openRetreatId = r.promo;
          $("retreat-sheet").innerHTML =
            '<div class="x-grab"></div>' +
            '<div class="x-sheet-head"><h2>' + esc(r.name) + '</h2><button class="x-iconbtn" data-act="close-sheets" aria-label="Close">' + I.close + "</button></div>" +
            '<p class="x-meta">' + esc(r.label) + " · " + r.nights + " nights · The Krishnamurti Centre</p>" +
            '<p class="x-sheet-desc">' + esc(RETREAT_DESC[r.type]) + "</p>" +
            '<p class="x-note-strong">Full board, vegetarian. ' + money(CENTRE.deposit) + " non-refundable deposit secures your place.</p>" +
            '<button class="x-btn x-btn--block x-btn--lg u-mt6" data-act="book" data-i="' + r.promo + '">Book this retreat</button>' +
            '<div class="x-btnrow x-btnrow--even u-mt3">' +
              '<button class="x-btn x-btn--ghost" data-act="cal" data-i="' + r.promo + '">Add to calendar</button>' +
              (CENTRE.email ? '<a class="x-btn x-btn--ghost" href="mailto:' + esc(CENTRE.email) + "?subject=" + esc(encodeURIComponent(r.name + ", " + r.label)) + '">Ask a question</a>' : "") +
            "</div>" +
            '<p class="x-meta u-mt3">' + leaveNote() + "</p>";
          openSheet($("retreat-sheet"));
        }
        // Builds an .ics file for a retreat (all-day, arrival to departure; DTEND is exclusive)
        function addToCal(i) {
          var r = retreatBy(i);
          if (!r) return;
          function f(x) { return iso(x).replace(/-/g, ""); }
          var ics = [
            "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Krishnamurti App Prototype//EN", "BEGIN:VEVENT",
            "UID:retreat-" + r.promo + "@krishnamurticentre.org.uk",
            "DTSTAMP:" + f(new Date()) + "T000000Z",
            "DTSTART;VALUE=DATE:" + f(r.start),
            "DTEND;VALUE=DATE:" + f(addDays(r.end, 1)),
            "SUMMARY:" + r.name.replace(/[,;\\]/g, "\\$&") + " at the Krishnamurti Centre",
            "LOCATION:The Krishnamurti Centre\\, Brockwood Park\\, Bramdean\\, Alresford SO24 0LQ",
            "END:VEVENT", "END:VCALENDAR"
          ].join("\r\n");
          try {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
            a.download = r.name.replace(/[^\w]+/g, "-") + "-" + f(r.start) + ".ics";
            a.click();
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
            toast("Calendar file saved: " + r.label);
          } catch (err) { toast("Adds to your calendar in the app"); }
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
        var pendingSeek = 0, lastSaved = 0;
        function dur() { return audio.duration && isFinite(audio.duration) ? audio.duration : cur && cur.min ? cur.min * 60 : 0; }
        // Position before the file has loaded comes from the saved position
        function curTime() { return audio.readyState > 0 ? audio.currentTime || 0 : pendingSeek || 0; }
        function savePos(t) {
          if (!cur || played[cur.id]) return;
          var d = dur();
          if (t > 5 && (!d || d - t > 15)) positions[cur.id] = Math.floor(t);
          else {
            // Within 15 s of the end counts as played
            if (d && t > 5 && d - t <= 15) markPlayed(cur.id, true, true);
            delete positions[cur.id];
          }
          lastSaved = t;
          store("pos", positions);
        }
        function seekTo(t) {
          if (!cur) return;
          var d = dur();
          t = Math.max(0, d ? Math.min(d, t) : t);
          if (audio.readyState > 0) audio.currentTime = t; else pendingSeek = t;
          savePos(t);
          progress();
        }
        function loadEp(ep) {
          cur = ep;
          // A downloaded episode plays from the device (served by sw.js), streamed ones from Podbean
          audio.src = downloads[ep.id] && canDownload() ? offlineUrl(ep.id) : ep.url;
          audio.playbackRate = rate;
          pendingSeek = positions[ep.id] || 0;
          store("cur", { id: ep.id, title: ep.title, date: ep.date, min: ep.min, url: ep.url, show: ep.show });
          remember(ep, "ep");
          recent = [ep.id].concat(recent.filter(function (x) { return x !== ep.id; })).slice(0, 10);
          store("recent", recent);
          setNow();
        }
        function playEp(id) {
          var ep = getEp(id);
          if (!ep) return;
          if (!cur || cur.id !== id || !audio.getAttribute("src")) {
            loadEp(ep);
            // Starting a played episode again starts it from the beginning
            if (played[id]) { markPlayed(id, false, true); pendingSeek = 0; }
          } else if (played[id] && audio.paused) markPlayed(id, false, true);
          if (audio.paused) {
            stopVideo();
            var p = audio.play();
            if (p && p.catch) p.catch(function (err) {
              // A broken file is reported by the "error" event below
              if (err && err.name !== "AbortError" && err.name !== "NotSupportedError" && !audio.error) toast("Playback could not start. Check your connection.");
              syncPlay();
            });
          } else audio.pause();
          syncPlay();
        }
        function toggle() { if (cur) playEp(cur.id); }
        // Titles cut where they no longer fit end at a word, not mid-word. The element keeps its CSS clamp
        // (1 or 2 lines); words are dropped until the text fits, and the full title stays in title/aria.
        function fitTitle(el, text) {
          if (!el) return;
          el.textContent = text;
          el.removeAttribute("title");
          if (!el.clientWidth) return; // not on screen: fitted again when its tab opens
          var over = function () { return el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1; };
          if (!over()) return;
          var words = text.split(/\s+/), lo = 1, hi = words.length - 1, best = 1;
          while (lo <= hi) {
            var mid = (lo + hi) >> 1;
            el.textContent = words.slice(0, mid).join(" ").replace(/[\s•·:,;&–-]+$/, "") + "…";
            if (over()) hi = mid - 1; else { best = mid; lo = mid + 1; }
          }
          var cut = words.slice(0, best).join(" ").replace(/[\s•·:,;&–-]+$/, "") + "…";
          el.innerHTML = '<span aria-hidden="true">' + esc(cut) + '</span><span class="x-visually-hidden">' + esc(text) + "</span>";
          el.setAttribute("title", text);
        }
        function fitTitles(root) {
          if (!root) return;
          [].forEach.call(root.querySelectorAll("[data-fit]"), function (el) { fitTitle(el, el.getAttribute("data-fit")); });
        }
        // Player art: the episode's own image when it has one, else its show's cover, else the built-in cover,
        // else the app icon, each tried in turn when an image fails to load (no blank square in the mini player)
        var BUILTIN_COVER = { uoc: SHOWS.uoc.cover, kc: SHOWS.kc.cover, daily: SHOWS.daily.cover };
        function setArt(img, ep) {
          if (!img || !ep) return;
          var s = SHOWS[ep.show] || {};
          var chain = [ep.image, s.cover, BUILTIN_COVER[ep.show], "icons/icon-512.png"].filter(function (u, i, a) { return u && a.indexOf(u) === i; });
          var i = 0;
          img.onerror = function () { i++; if (i < chain.length) img.src = chain[i]; else img.onerror = null; };
          img.src = chain[0];
        }
        function setNow() {
          var s = SHOWS[cur.show];
          $("mini").hidden = false;
          app.classList.add("has-player");
          setArt($("mini-art"), cur);
          fitTitle($("mini-title"), cur.title);
          $("mini-show").textContent = s.name;
          setArt($("np-art"), cur);
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
            if (b.hasAttribute("data-label")) b.innerHTML = on ? I.pause.replace('class="x-i-pause"', "") + "Pause" : I.play.replace('class="x-i-play"', "") + (cur && cur.id === b.getAttribute("data-ep") && curTime() > 0 ? "Resume" : "Play episode");
            else { var e = getEp(b.getAttribute("data-ep")); b.setAttribute("aria-label", (on ? "Pause " : "Play ") + (e ? e.title : "")); }
          });
          ["mini-play", "np-play"].forEach(function (id) {
            $(id).classList.toggle("is-playing", playing);
            $(id).setAttribute("aria-label", playing ? "Pause" : "Play");
          });
        }
        function progress() {
          if (!cur) return;
          var d = dur(), t = curTime(), pct = d ? Math.min(100, (t / d) * 100) : 0;
          // The mini player's bar, and any row bar for this episode
          [].forEach.call(app.querySelectorAll(".x-prog"), function (el) {
            var id = el.getAttribute("data-ep");
            if (!id || id === cur.id) el.style.width = pct + "%";
          });
          if (!dragging) {
            $("np-range").value = Math.round(pct * 10);
            $("np-cur").textContent = fmt(t);
          }
          $("np-rem").textContent = d ? "-" + fmt(d - t) : "";
          [].forEach.call(app.querySelectorAll('[data-left="' + cur.id + '"]'), function (el) {
            el.textContent = joinMeta(SHOWS[cur.show].name, d && t ? Math.max(1, Math.ceil((d - t) / 60)) + " min left" : "");
          });
          positionState();
        }
        ["play", "pause", "ended", "playing"].forEach(function (ev) { audio.addEventListener(ev, syncPlay); });
        audio.addEventListener("timeupdate", function () {
          progress();
          if (cur && Math.abs(audio.currentTime - lastSaved) >= 5) savePos(audio.currentTime);
        });
        audio.addEventListener("pause", function () { if (cur && audio.readyState > 0) savePos(audio.currentTime); });
        audio.addEventListener("ended", function () {
          if (!cur) return;
          delete positions[cur.id]; store("pos", positions);
          markPlayed(cur.id, true);
        });
        // played: id -> time. quiet skips the re-render (used while the player itself is updating)
        function markPlayed(id, on, quiet) {
          if (on) { played[id] = Date.now(); delete positions[id]; store("pos", positions); }
          else delete played[id];
          store("played", played);
          if (quiet) return;
          [].forEach.call(app.querySelectorAll('[data-act="mark-played"][data-ep="' + id + '"]'), function (b) { b.outerHTML = playedBtn(id); });
          afterChange(id);
        }
        window.addEventListener("pagehide", function () { if (cur && audio.readyState > 0) savePos(audio.currentTime); });
        audio.addEventListener("loadedmetadata", function () {
          audio.playbackRate = rate;
          if (pendingSeek) { try { audio.currentTime = Math.min(pendingSeek, Math.max(0, dur() - 1)); } catch (err) {} pendingSeek = 0; }
          progress();
        });
        // A broken or expired MP3 URL fires "error", not a rejected play() promise
        audio.addEventListener("error", function () {
          // The device copy is gone (storage cleared): stream instead
          if (cur && audio.getAttribute("src") === offlineUrl(cur.id)) { var t = curTime(); audio.src = cur.url; pendingSeek = t; audio.play().catch(function () {}); return; }
          if (cur && audio.getAttribute("src")) { toast("This episode could not load. Try again later."); syncPlay(); }
        });

        // Lock-screen and headphone controls (Media Session API)
        function mediaSession() {
          try {
            if (!("mediaSession" in navigator) || !cur || !window.MediaMetadata) return;
            var s = SHOWS[cur.show];
            navigator.mediaSession.metadata = new MediaMetadata({ title: cur.title, artist: s.name, album: "Krishnamurti Foundation Trust", artwork: [{ src: s.cover, sizes: "512x512" }] });
          } catch (err) {}
        }
        function positionState() {
          try {
            var d = audio.duration;
            if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState || !d || !isFinite(d)) return;
            navigator.mediaSession.setPositionState({ duration: d, playbackRate: audio.playbackRate || 1, position: Math.min(d, audio.currentTime || 0) });
          } catch (err) {}
        }
        // Next and previous follow the show's list order (newest first), so "next" is the next episode down the list
        function neighbour(step) {
          if (!cur) return null;
          var list = SHOWS[cur.show].eps;
          for (var i = 0; i < list.length; i++) if (list[i].id === cur.id) return list[i + step] || null;
          return null;
        }
        try {
          if ("mediaSession" in navigator) {
            var ms = navigator.mediaSession, h = function (a, f) { try { ms.setActionHandler(a, f); } catch (err) {} };
            h("play", function () { if (cur && audio.paused) toggle(); });
            h("pause", function () { if (cur && !audio.paused) toggle(); });
            h("stop", function () { if (cur && !audio.paused) toggle(); });
            h("seekbackward", function (d) { seekTo(curTime() - ((d && d.seekOffset) || 15)); });
            h("seekforward", function (d) { seekTo(curTime() + ((d && d.seekOffset) || 30)); });
            h("seekto", function (d) { if (d && typeof d.seekTime === "number") seekTo(d.seekTime); });
            h("nexttrack", function () { var n = neighbour(1); if (n) playEp(n.id); });
            h("previoustrack", function () {
              if (curTime() > 5) { seekTo(0); return; }
              var n = neighbour(-1); if (n) playEp(n.id); else seekTo(0);
            });
          }
        } catch (err) {}
        $("np-range").addEventListener("input", function () {
          dragging = true;
          $("np-cur").textContent = fmt((this.value / 1000) * dur());
        });
        $("np-range").addEventListener("change", function () {
          dragging = false;
          seekTo((this.value / 1000) * dur());
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
        // Every screen's bottom padding includes the mini player and tab bar as they are drawn now (text size,
        // safe area, player shown or not), so the last row is never under them
        (function () {
          var bottom = app.querySelector(".x-bottom");
          if (!bottom) return;
          var set = function () { app.style.setProperty("--bottom-h", Math.ceil(bottom.getBoundingClientRect().height) + "px"); };
          set();
          if (window.ResizeObserver) new ResizeObserver(set).observe(bottom);
          window.addEventListener("resize", function () { set(); fitTitles($("s-" + state.tab)); if (cur) fitTitle($("mini-title"), cur.title); });
        })();
        function switchTab(t) {
          closeDetail();
          closeSheets();
          state.tab = t;
          if (t === "listen") loadFullPodcasts();
          [].forEach.call(app.querySelectorAll(".x-screen"), function (s) { s.classList.toggle("is-active", s.id === "s-" + t); });
          fitTitles($("s-" + t));
          if (cur) fitTitle($("mini-title"), cur.title);
          [].forEach.call(app.querySelectorAll(".x-tab"), function (b) {
            var on = b.getAttribute("data-tab") === t;
            b.classList.toggle("is-on", on);
            if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
          });
        }
        // Focus moves into an opened sheet and back to what opened it on close
        var sheetTrigger = null;
        var FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
        function openSheet(el) {
          var already = !!app.querySelector(".x-sheet.is-open");
          if (!already) sheetTrigger = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
          closeSheets(true);
          $("scrim").classList.add("is-open");
          el.classList.add("is-open");
          el.setAttribute("aria-hidden", "false");
          el.setAttribute("aria-modal", "true");
          el.scrollTop = 0;
          var first = el.querySelector(FOCUSABLE);
          try { (first || el).focus({ preventScroll: true }); } catch (err) {}
        }
        function closeSheets(keepScrim) {
          [].forEach.call(app.querySelectorAll(".x-sheet.is-open"), function (s) { s.classList.remove("is-open"); s.setAttribute("aria-hidden", "true"); });
          if (keepScrim !== true) {
            $("scrim").classList.remove("is-open");
            var t = sheetTrigger;
            sheetTrigger = null;
            if (t && document.contains(t) && !t.closest(".x-sheet") && t.offsetParent !== null) { try { t.focus({ preventScroll: true }); } catch (err) {} }
            else if (app.contains(document.activeElement) && document.activeElement.closest(".x-sheet")) {
              var bar = $("mini").hidden ? null : $("mini-open");
              try { (bar || app.querySelector(".x-tab.is-on")).focus({ preventScroll: true }); } catch (err) {}
            }
          }
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
          if (!el) return;
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
            case "sres": openSearchResult(el.getAttribute("data-type"), el.getAttribute("data-id")); break;
            case "smore": state.searchMore = (state.searchMore || 20) + 20; runSearch($("search").value); break;
            case "xvid": openVideo(el.getAttribute("data-v")); break;
            case "xep": openEpisodeKey(el.getAttribute("data-ep"), +el.getAttribute("data-ci")); break;
            case "chap":
              var cid = el.getAttribute("data-ep"), ct = +el.getAttribute("data-t");
              if (!cur || cur.id !== cid || audio.paused) playEp(cid);
              seekTo(ct);
              break;
            case "vfull":
              var xv = getVid(el.getAttribute("data-v"));
              if (!xv || !/^[\w-]{6,20}$/.test(xv.full || "")) break;
              if (!VIDS[xv.full]) {
                // The full recording is not in the app's lists yet: name it from the extract's own description
                var src = (videoDesc(xv) || "").split(/\.\s|\n/)[0].replace(/^Extract from (the )?/i, "");
                VIDS[xv.full] = { id: xv.full, title: src ? src.charAt(0).toUpperCase() + src.slice(1) : "Full recording", date: "", thumb: "", ch: "YouTube", k: "off", kind: "full", iso: "" };
              }
              openVideo(xv.full, true);
              break;
            case "browse":
              e.preventDefault();
              openBrowser(el.getAttribute("href"), el.getAttribute("data-title"));
              break;
            case "br-reload":
              $("br-spin").hidden = false;
              var fr = $("br-frame"), u = fr.getAttribute("src");
              fr.src = "about:blank";
              setTimeout(function () { fr.src = u; }, 30);
              break;
            case "ext": e.preventDefault(); openExternal(el.getAttribute("href"), el.getAttribute("data-kind") || "link"); break;
            case "book": openBook(el.hasAttribute("data-i") ? +el.getAttribute("data-i") : undefined); break;
            case "bk-room":
              bk.room = el.getAttribute("data-k");
              if (room(bk.room).sleeps < 2) bk.guests = 1;
              renderBook();
              break;
            case "bk-guests": bk.guests = +el.getAttribute("data-n"); renderBook(); break;
            case "bk-go":
              var bu = bookUrl();
              if (bu) openExternal(bu, "booking"); else renderBookEst();
              break;
            case "retreat": openRetreat(+el.getAttribute("data-i")); break;
            case "save-quote": toggleSaveQuote(el.getAttribute("data-id")); break;
            case "share-quote": shareQuote(); break;
            case "programme":
              switchTab("visit");
              var pg = $("programme");
              if (pg) $("s-visit").scrollTop = pg.offsetTop - 8;
              break;
            case "dfav": toggleDailyFav(+el.getAttribute("data-day")); break;
            case "dshare": shareDaily(+el.getAttribute("data-day")); break;
            case "dday": if (el.getAttribute("data-day")) openDailyDay(+el.getAttribute("data-day")); break;
            case "dopen": openDailyDay(+el.getAttribute("data-day")); break;
            case "dflow": dailyView.flow = el.getAttribute("data-flow") || null; renderDaily(); refocus("s-daily", dailyView.flow ? '[data-act="dflow"][data-flow=""]' : '[data-act="dflow"]'); break;
            case "ddl": downloadDaily(); break;
            case "ddl-remove": removeDailyDownloads(); break;
            case "drestart":
              if (!state.restartAsk) { state.restartAsk = true; renderDaily(); refocus("s-daily", '[data-act="drestart"]'); break; }
              state.restartAsk = false;
              store("dailyStart", iso(startOfToday()));
              dailyView = { day: null, flow: null };
              renderDaily(); renderToday();
              $("s-daily").scrollTop = 0;
              toast("Your journey starts again at day 1");
              break;
            case "dl":
              var id = el.getAttribute("data-ep");
              if (dlBusy[id]) break;
              if (downloads[id]) removeDownload(id); else download(id);
              break;
            case "save-item":
              var sid = el.getAttribute("data-id"), sv = getVid(sid), se = sv ? null : getEp(sid);
              if (savedItems[sid]) { delete savedItems[sid]; store("savedItems", savedItems); tidyLibrary(); }
              else { savedItems[sid] = Date.now(); remember(sv || se, sv ? "video" : "ep"); store("savedItems", savedItems); }
              [].forEach.call(app.querySelectorAll('[data-act="save-item"][data-id="' + sid + '"]'), function (b) { b.outerHTML = saveBtn(sid); });
              var nb = $("detail-body").querySelector('[data-act="save-item"][data-id="' + sid + '"]');
              if (nb) nb.focus();
              toast(savedItems[sid] ? "Saved. Find it on Today." : "Removed from saved");
              renderSaved();
              break;
            case "mark-played":
              var pid = el.getAttribute("data-ep"), was = !!played[pid];
              if (!was && cur && cur.id === pid && !audio.paused) audio.pause();
              markPlayed(pid, !was);
              var pb = $("detail-body").querySelector('[data-act="mark-played"][data-ep="' + pid + '"]');
              if (pb) pb.focus();
              toast(was ? "Marked as unplayed" : "Marked as played");
              break;
            case "desc-more": state.descOpen = !state.descOpen; renderListen(); refocus("s-listen", '[data-act="desc-more"]'); break;
            case "series-clear": state.series = null; renderListen(); refocus("s-listen", '[data-act="lseg"][data-k="kc"]'); break;
            case "lseg": state.show = el.getAttribute("data-k"); state.series = null; renderListen(); refocus("s-listen", '[data-act="lseg"][data-k="' + state.show + '"]'); break;
            case "wseg": setWkind(el.getAttribute("data-k")); break;
            case "more":
              var mk = el.getAttribute("data-k"), before = state.more[mk];
              state.more[mk] += PAGE;
              if (mk === "uoc" || mk === "kc") { renderListen(); if (SHOWS[mk].eps.length <= state.more[mk]) loadFullPodcasts(); } else renderWatch();
              // Focus the first newly shown item
              var items = $(mk === "uoc" || mk === "kc" ? "s-listen" : "s-watch").querySelectorAll(mk === "uoc" || mk === "kc" ? ".x-row-main" : ".x-video");
              if (items[before]) items[before].focus();
              break;
            case "topic":
              var t = el.getAttribute("data-t");
              state.topic = state.topic === t ? null : t;
              renderWatch();
              refocus("s-watch", '[data-act="topic"][data-t="' + t + '"]');
              break;
            case "vfilter": state.vfilter = el.getAttribute("data-f"); renderRetreats(); break;
            case "skip":
              if (cur) seekTo(curTime() + +el.getAttribute("data-s"));
              break;
            case "speed":
              rate = +el.getAttribute("data-r");
              audio.playbackRate = rate;
              audio.defaultPlaybackRate = rate;
              [].forEach.call(el.parentNode.children, function (b) { b.classList.toggle("is-on", b === el); b.setAttribute("aria-pressed", b === el); });
              break;
            case "cal": addToCal(+el.getAttribute("data-i")); break;
          }
        });
        function setWkind(k) {
          state.wkind = k;
          store("wkind", k);
          renderWatch();
          refocus("s-watch", '[data-act="wseg"][data-k="' + k + '"]');
        }
        // Arrow keys move between Watch tabs (WAI-ARIA tabs pattern)
        app.addEventListener("keydown", function (e) {
          var t = e.target;
          if (!t || t.getAttribute("role") !== "tab" || t.getAttribute("data-act") !== "wseg") return;
          var tabs = [].slice.call(t.parentNode.querySelectorAll('[role="tab"]')), i = tabs.indexOf(t), j = -1;
          if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
          else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === "Home") j = 0;
          else if (e.key === "End") j = tabs.length - 1;
          if (j < 0) return;
          e.preventDefault();
          setWkind(tabs[j].getAttribute("data-k"));
        });
        // Re-renders replace the pressed button; put focus back on its new copy
        function refocus(screen, sel) {
          var b = $(screen).querySelector(sel);
          if (b) b.focus();
        }
        document.addEventListener("keydown", function (e) {
          if (e.key !== "Escape") return;
          if (app.querySelector(".x-sheet.is-open")) { e.preventDefault(); closeSheets(); }
          else closeDetail();
        });

        /* ---------- Live content: data/feed.json when hosted, built-in lists otherwise ---------- */
        function isHttp(u) { return typeof u === "string" && /^https?:\/\//i.test(u); }
        function txt(v) { return typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : ""; }
        // A missing or unparseable date is hidden, never shown as "Invalid Date"
        function fmtFeedDate(v) {
          var s = txt(v);
          if (!s) return "";
          var d;
          try { d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? parseISO(s) : new Date(s); } catch (err) { d = null; }
          // Any other form that still carries a calendar date ("Sat 2026-11-14 6:00 AM GMT") keeps its date
          if (!d || isNaN(d.getTime())) { var m = /(\d{4})-(\d{2})-(\d{2})/.exec(s); d = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)) : null; }
          return d && !isNaN(d.getTime()) ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
        }
        // Plain text from a feed description that may carry HTML; it is escaped again when shown
        function plainText(v) {
          return txt(v).replace(/<br\s*\/?>|<\/p>/gi, " ").replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
            .replace(/[ \t\u00a0]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
        }
        // Stable ids: the episode number from the title ("300 • …") or the audio file name ("305_…"), else a hash of the audio URL,
        // so saved positions and downloads keep matching the built-in episodes
        function epId(prefix, title, url) {
          var m = /^(\d+)\s*•/.exec(title) || /\/0*(\d+)_[^\/]*$/.exec(url.split("?")[0]);
          if (m) return prefix + m[1];
          var h = 0;
          for (var i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) | 0;
          return prefix + "x" + (h >>> 0).toString(36);
        }
        // "(1/1)" says nothing for a single-part Collection series; parts of longer series keep "(2/6)"
        function cleanEpTitle(t) { return t.replace(/\s*\(1\/1\)/, ""); }
        function feedEpisodes(src, show, prefix) {
          if (!src || typeof src !== "object" || !Array.isArray(src.episodes)) return null;
          var seen = {};
          var list = src.episodes.map(function (e, i) {
            if (!e || typeof e !== "object" || !isHttp(e.audioUrl) || !txt(e.title)) return null;
            var id = /^[uc]\d+$/.test(txt(e.key)) && txt(e.key).charAt(0) === prefix ? txt(e.key) : epId(prefix, txt(e.title), e.audioUrl);
            if (seen[id]) id += "-" + i;
            seen[id] = 1;
            var ds = Number(e.durationSec), secs = isFinite(ds) && ds > 0 ? ds : null;
            var desc = plainText(e.description);
            // The feed builder cuts descriptions at 600 characters; show that they continue
            if (desc && txt(e.description).length === 600) desc = desc.replace(/\s+\S*$/, "") + "…";
            var ep = { id: id, title: cleanEpTitle(txt(e.title)), date: fmtFeedDate(e.date), min: secs ? Math.max(1, Math.round(secs / 60)) : null, url: e.audioUrl, link: isHttp(e.link) ? e.link : "", desc: desc, show: show };
            if (txt(e.seriesId)) { ep.series = txt(e.seriesId); ep.part = Number(e.part) >= 1 ? Math.floor(e.part) : null; }
            if (Array.isArray(e.chapters)) ep.chapters = e.chapters.map(function (c) {
              return c && txt(c.title) ? { start: typeof c.start === "number" && c.start >= 0 ? c.start : null, title: txt(c.title), source: txt(c.source) } : null;
            }).filter(Boolean);
            // Keep the playing episode's object so the player is not reloaded
            return cur && cur.id === id && cur.url === ep.url ? cur : ep;
          }).filter(Boolean);
          return list.length ? list : null;
        }
        // One video object, from either feed.json or a compact channel index row
        function mkVideo(k, id, title, date, thumb, kind, isShort, full, sec) {
          var o = { id: id, title: title.replace(/\s*\|\s*(J\.\s*)?Krishnamurti\s*$/i, "") || title, date: fmtFeedDate(date), iso: isoKey(date), thumb: thumb || "", ch: VIDEOS[k].name, k: k, kind: videoKind(kind, isShort, k) };
          if (typeof full === "string" && /^[\w-]{6,20}$/.test(full)) o.full = full;
          if (typeof sec === "number" && sec > 0 && isFinite(sec)) o.sec = Math.round(sec);
          return o;
        }
        // Sortable date key (YYYY-MM-DD…) from any of the feed's date forms
        function isoKey(v) { var m = /(\d{4}-\d{2}-\d{2})/.exec(txt(v)); return m ? m[1] : ""; }
        function feedVideos(src, k) {
          if (!Array.isArray(src)) return null;
          var list = src.map(function (v) {
            if (!v || typeof v !== "object" || !/^[\w-]{6,20}$/.test(txt(v.id)) || !txt(v.title)) return null;
            // YouTube titles end with the channel's own tag ("… | Krishnamurti"); the app shows the channel separately
            return mkVideo(k, txt(v.id), txt(v.title), v.date, isHttp(v.thumbnail) ? v.thumbnail : "", v.kind, v.short === true, null, null);
          }).filter(Boolean);
          return list.length ? list : null;
        }
        function feedGenres(src) {
          if (!Array.isArray(src)) return null;
          var list = src.map(function (g) {
            if (!g || typeof g !== "object" || !txt(g.name)) return null;
            var n = typeof g.count === "number" && isFinite(g.count) ? g.count.toLocaleString("en-GB") : /^[\d,]+$/.test(txt(g.count)) ? txt(g.count) : "";
            return [txt(g.name), n];
          }).filter(Boolean);
          return list.length ? list : null;
        }
        // Coming back from Inn Style: put the scroll and retreat back once the live lists are in
        function finishReturn() {
          if (!returned) return;
          var sc = $("s-" + returned.tab);
          if (sc && returned.scroll > 0) sc.scrollTop = returned.scroll;
          if (returned.pendingRetreat && retreatBy(returned.pendingRetreat) && !app.querySelector(".x-sheet.is-open")) openRetreat(returned.pendingRetreat);
          returned = null;
        }
        function applyFeed(feed) {
          if (!feed || typeof feed !== "object") return;
          var changed = false;
          if (feed.files && typeof feed.files === "object") FILES = feed.files;
          if (feed.counts && typeof feed.counts === "object") feedCounts = feed.counts;
          if (feed.images && typeof feed.images === "object") {
            Object.keys(feed.images).forEach(function (k) { var v = feed.images[k]; if (typeof v === "string" && /^data\/img\/[\w.-]+\.(jpe?g|png|webp)$/i.test(v)) IMGMAP[k] = v; });
            if (IMGMAP[HERO_PHOTO]) changed = true;
            var sec = document.querySelector("#s-read .x-articles");
            if (sec) sec.innerHTML = ARTICLES.map(function (a) { return '<a class="x-article"' + BR(a[2], a[0]) + ' data-q="' + esc((a[0] + " " + a[1]).toLowerCase()) + '">' + articleArt(a) + "<div><h3>" + esc(a[0]) + '</h3><p class="x-clamp2">‘' + esc(a[1]) + "’</p></div></a>"; }).join("");
          }
          var pods = feed.podcasts && typeof feed.podcasts === "object" ? feed.podcasts : {};
          var vids = feed.videos && typeof feed.videos === "object" ? feed.videos : {};
          [["uoc", pods.urgencyOfChange, "u"], ["kc", pods.collection, "c"]].forEach(function (p) {
            var show = p[1] && typeof p[1] === "object" ? p[1] : null;
            if (show && isHttp(show.image)) { SHOWS[p[0]].cover = show.image; changed = true; }
            var list = feedEpisodes(show, p[0], p[2]);
            if (!list) return;
            SHOWS[p[0]].eps = list;
            list.forEach(function (ep) { EPS[ep.id] = ep; });
            changed = true;
          });
          var genres = feedGenres(feed.archiveGenres);
          if (genres) {
            GENRES = genres;
            var grid = document.querySelector("#s-read .x-grid"), q = $("search");
            if (grid) grid.innerHTML = genreTiles();
            if (q && q.value) q.dispatchEvent(new Event("input"));
          }
          [["kft", vids.kftChannel], ["off", vids.officialChannel]].forEach(function (p) {
            var list = feedVideos(p[1], p[0]);
            if (!list) return;
            VIDEOS[p[0]].list = list;
            list.forEach(function (v) { VIDS[v.id] = v; });
            changed = true;
          });
          var rts = toRetreats(feed.retreats);
          if (rts.length) {
            RETREATS = rts;
            changed = true;
            renderRetreats();
          }
          loadVideoIndexes();
          if (state.tab === "listen") loadFullPodcasts();
          if (!changed) { finishReturn(); return; }
          renderToday();
          renderListen();
          renderWatch();
          // Refresh the player's artwork and lock-screen artwork if a show's image changed
          if (cur) { setArt($("mini-art"), cur); setArt($("np-art"), cur); mediaSession(); }
          finishReturn();
        }
        // Rates, closures and contact details: data/centre.json, validated, with the built-in copy as fallback
        function money0(v) { return typeof v === "number" && isFinite(v) && v >= 0; }
        function applyCentre(c) {
          if (!c || typeof c !== "object") return;
          var next = {};
          var rooms = Array.isArray(c.rooms) ? c.rooms.filter(function (o) {
            return o && typeof o.id === "string" && /^[\w-]+$/.test(o.id) && txt(o.name) && money0(o.weekday) && money0(o.weekend) && money0(o.week);
          }).map(function (o) { return { id: o.id, name: txt(o.name), weekday: o.weekday, weekend: o.weekend, week: o.week, sleeps: o.sleeps > 1 ? Math.floor(o.sleeps) : 1 }; }) : [];
          if (rooms.length) next.rooms = rooms;
          if (c.reduced && money0(c.reduced.weekday)) next.reduced = { weekday: c.reduced.weekday, weekend: money0(c.reduced.weekend) ? c.reduced.weekend : 0, rooms: c.reduced.rooms > 0 ? Math.floor(c.reduced.rooms) : 0 };
          var dv = Array.isArray(c.dayVisits) ? c.dayVisits.filter(function (d) { return d && txt(d.label) && money0(d.price); }).map(function (d) { return { label: txt(d.label), price: d.price }; }) : [];
          if (dv.length) next.dayVisits = dv;
          if (money0(c.deposit)) next.deposit = c.deposit;
          var cl = Array.isArray(c.closures) ? c.closures.filter(function (x) { return x && isoToDate(x.from) && isoToDate(x.reopen) && isoToDate(x.reopen) > isoToDate(x.from); }).map(function (x) { return { from: x.from, reopen: x.reopen }; }) : null;
          if (cl) next.closures = cl;
          if (c.minNights >= 1 && c.maxNights >= c.minNights) { next.minNights = Math.floor(c.minNights); next.maxNights = Math.floor(c.maxNights); }
          if (typeof c.adultsOnly === "boolean") next.adultsOnly = c.adultsOnly;
          if (/^\d{1,2}:\d{2}$/.test(txt(c.checkIn)) && /^\d{1,2}:\d{2}$/.test(txt(c.checkOut))) { next.checkIn = txt(c.checkIn); next.checkOut = txt(c.checkOut); }
          if (c.phone && txt(c.phone.display) && /^\+?\d{6,15}$/.test(txt(c.phone.tel))) next.phone = { display: txt(c.phone.display), tel: txt(c.phone.tel) };
          if (/^[^@\s"<>]+@[^@\s"<>]+$/.test(txt(c.email))) next.email = txt(c.email);
          Object.keys(next).forEach(function (k) { CENTRE[k] = next[k]; });
          renderCentreInfo();
          if ($("book-sheet").classList.contains("is-open")) renderBook();
        }
        function loadCentre() {
          if (!window.fetch || IS_PREVIEW) return;
          try {
            fetch("data/centre.json", { cache: "no-cache" })
              .then(function (r) { if (!r.ok) throw new Error("centre " + r.status); return r.json(); })
              .then(applyCentre)
              .catch(function () {});
          } catch (err) {}
        }
        /* ---------- Feed v2: full lists in their own files, listed in feed.files with a version hash ---------- */
        var FILES = {};
        function dataUrl(path) {
          if (!/^[\w-]+(\/[\w-]+)*\.json$/.test(path)) return null;
          var f = FILES[path];
          return "data/" + path + (f && typeof f.v === "string" && /^[\w-]+$/.test(f.v) ? "?v=" + f.v : "");
        }
        function getJSON(path) {
          var u = dataUrl(path);
          if (!u || !window.fetch) return Promise.reject(new Error("no url"));
          return fetch(u).then(function (r) { if (!r.ok) throw new Error(path + " " + r.status); return r.json(); });
        }
        var CH_FILE = { kft: "kft", off: "official", other: "other" };
        function loadVideoIndexes() {
          Object.keys(CH_FILE).forEach(function (k) {
            var path = "videos/" + CH_FILE[k] + "/index.json";
            if (!FILES[path]) return;
            getJSON(path).then(function (x) {
              if (!x || !Array.isArray(x.rows)) return;
              if (!VIDEOS[k]) VIDEOS[k] = { name: "", list: [] };
              if (x.channel && txt(x.channel.name)) VIDEOS[k].name = txt(x.channel.name).replace(/^J\. Krishnamurti - /, "");
              var list = x.rows.map(function (r) {
                if (!r || !/^[\w-]{6,20}$/.test(txt(r.id)) || !txt(r.t)) return null;
                // kind is the Watch division from the pipeline (full|extract|short|unknown); d is null for archive-only videos, which carry r (recording date)
                var vv = mkVideo(k, txt(r.id), txt(r.t), r.d || r.r, "https://i.ytimg.com/vi/" + txt(r.id) + "/mqdefault.jpg", r.kind || r.k, r.sh === 1 || r.sh === true, r.f, r.s);
                if (!r.d && r.r) { vv.date = vv.date ? "Recorded " + vv.date : ""; vv.recorded = true; }
                if (typeof r.ar === "number") vv.ar = r.ar;
                // Format (k: "audio" = an audio-only upload, which YouTube shows with one repeated still), place and year
                if (txt(r.k)) vv.fmt = txt(r.k);
                if (txt(r.pl)) vv.place = txt(r.pl);
                var yr = Number(r.y) || Number(txt(r.r).slice(0, 4));
                if (yr > 1900 && yr < 2100) vv.year = yr;
                return vv;
              }).filter(Boolean);
              if (!list.length) return;
              VIDEOS[k].list = list;
              list.forEach(function (v) { VIDS[v.id] = v; });
              renderWatch();
            }).catch(function () {});
          });
        }
        var descs = {}, descLoading = {};
        function videoDesc(v) {
          var d = descs[v.k];
          if (!d) return FILES["videos/" + CH_FILE[v.k] + "/descriptions.json"] ? null : "";
          var t = typeof d[v.id] === "string" ? d[v.id] : "";
          return t.replace(/\s*Watch the full video at\s+\S+/i, "").replace(/\n\s*[–-]\s*https?:\/\/\S+/g, "").trim();
        }
        function loadDescriptions(k, cb) {
          var path = "videos/" + CH_FILE[k] + "/descriptions.json";
          if (descs[k] || descLoading[k] || !FILES[path]) return;
          descLoading[k] = 1;
          getJSON(path).then(function (x) {
            descs[k] = x && x.descriptions && typeof x.descriptions === "object" ? x.descriptions : {};
            cb();
          }).catch(function () { descs[k] = {}; cb(); });
        }
        var fullPods = 0;
        // Every episode (300+ per show, about 1.6 MB together): fetched when Listen needs more than feed.json carries
        function loadFullPodcasts() {
          if (fullPods || !FILES["podcasts/uoc.json"]) return;
          fullPods = 1;
          [["uoc", "podcasts/uoc.json", "u"], ["kc", "podcasts/collection.json", "c"]].forEach(function (p) {
            if (!FILES[p[1]]) return;
            getJSON(p[1]).then(function (x) {
              var list = feedEpisodes(x, p[0], p[2]);
              if (!list || list.length <= SHOWS[p[0]].eps.length) return;
              SHOWS[p[0]].eps = list;
              list.forEach(function (ep) { EPS[ep.id] = ep; });
              var y = $("s-listen").scrollTop;
              renderListen();
              $("s-listen").scrollTop = y;
            }).catch(function () { fullPods = 0; });
          });
        }
        function feedTotal(k) {
          var c = feedCounts[k === "uoc" ? "uoc" : "collection"];
          return typeof c === "number" && c > SHOWS[k].eps.length ? c : SHOWS[k].eps.length;
        }
        var feedCounts = {};
        function loadFeed() {
          if (!window.fetch || IS_PREVIEW) return;
          // Hark's preview storage has no data/feed.json; the built-in lists are used there
          try { if (/(^|\.)amazonaws\.com$|(^|\.)hark\.com$/i.test(location.hostname)) return; } catch (err) { return; }
          try {
            fetch("data/feed.json", { cache: "no-cache" })
              .then(function (r) { if (!r.ok) throw new Error("feed " + r.status); return r.json(); })
              .then(applyFeed)
              .catch(function () {});
          } catch (err) {}
        }

        // Continue listening from the last visit, without starting playback
        function restoreCur() {
          var s = load("cur", null);
          if (!s || typeof s !== "object" || typeof s.id !== "string" || !SHOWS[s.show] || !isHttp(s.url) || !txt(s.title)) return;
          var ep = getEp(s.id);
          if (!ep) {
            ep = { id: s.id, title: txt(s.title), date: txt(s.date), min: typeof s.min === "number" ? s.min : null, url: s.url, show: s.show };
            EPS[ep.id] = ep;
          }
          cur = ep;
          pendingSeek = positions[ep.id] || 0;
          setNow();
          syncPlay();
        }

        renderToday();
        renderDaily();
        renderListen();
        renderWatch();
        renderRead();
        renderVisit();
        restoreCur();
        switchTab("today");
        var returned = restoreReturnState();
        // Back to a page kept in memory (bfcache): the screen is intact, so drop the saved hand-off state
        window.addEventListener("pageshow", function (e) { if (e.persisted) { try { sessionStorage.removeItem(RETURN_KEY); } catch (err) {} } });
        loadCentre();
        loadFeed();
        loadDaily();
        loadInstagram();
      })();
