"""Build compositions/captions.html from assets/transcript.json.

Usage: python3 tools/make_captions.py <project_dir> [fixes.json]
fixes.json maps a transcribed word to a list of replacement words, e.g.
{"Basedi": ["VICE", "CITY"], "Yestos": ["Y", "estos"]}.
"""
import json, re, sys, os

proj = sys.argv[1]
fixes = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}
d = json.load(open(os.path.join(proj, "assets/transcript.json")))
raw = d if isinstance(d, list) else d["words"]

words = []
for x in raw:
    t = x["text"].strip()
    if t in fixes:
        parts = fixes[t]
        step = (x["end"] - x["start"]) / len(parts)
        for i, p in enumerate(parts):
            words.append(dict(text=p, start=x["start"] + i * step, end=x["start"] + (i + 1) * step))
    else:
        words.append(dict(text=t, start=x["start"], end=x["end"]))

ordinals = {"1.": "UNO", "2.": "DOS", "3.": "TRES", "4.": "CUATRO"}
groups, cur = [], []
for i, x in enumerate(words):
    cur.append(x)
    t = x["text"]
    nxt = words[i + 1] if i + 1 < len(words) else None
    gap = (nxt["start"] - x["end"]) if nxt else 1
    if len(cur) >= 3 or re.search(r"[.,!?:]$", t) or gap >= 0.15 or t in ordinals:
        groups.append(cur)
        cur = []
if cur:
    groups.append(cur)

hl = re.compile(r"^[\d,]+(th)?[.,!]?$|^PS5|^VI$|^V$|^\d")
html, js = [], []
for gi, g in enumerate(groups):
    s = max(0.12, g[0]["start"] - 0.05)
    e = g[-1]["end"] + 0.05
    if gi + 1 < len(groups):
        e = min(e + 0.25, groups[gi + 1][0]["start"] - 0.02)
    e = max(e, s + 0.3)
    spans = []
    for wi, x in enumerate(g):
        t = ordinals.get(x["text"]) or x["text"].rstrip(",.!:")
        is_hl = bool(hl.match(x["text"])) or x["text"] in ordinals
        wid = f"cw-{gi}-{wi}"
        spans.append(f'<span id="{wid}" class="w{" hl" if is_hl else ""}">{t.upper()}</span>')
        if is_hl:
            js.append(f'    tl.fromTo("#{wid}", {{ scale: 1 }}, {{ scale: 1.15, duration: 0.08, ease: "back.out(3)" }}, {x["start"]:.2f});')
        else:
            js.append(f'    tl.fromTo("#{wid}", {{ color: "#ffffff", scale: 1 }}, {{ color: "#22e4ff", scale: 1.08, duration: 0.06 }}, {x["start"]:.2f});')
    gid = f"cap-{gi}"
    html.append(f'      <div id="{gid}" class="cap clip" data-start="{s:.2f}" data-duration="{e - s:.2f}"><div class="cap-in">{" ".join(spans)}</div></div>')
    js.append(f'    tl.fromTo("#{gid} .cap-in", {{ scale: 0.6, y: 30, opacity: 0 }}, {{ scale: 1, y: 0, opacity: 1, duration: 0.14, ease: "back.out(2.8)" }}, {s:.2f});')
    js.append(f'    tl.to("#{gid} .cap-in", {{ opacity: 0, duration: 0.08 }}, {e - 0.09:.2f});')
    js.append(f'    tl.set("#{gid} .cap-in", {{ opacity: 0, visibility: "hidden" }}, {e:.2f});')

out = f"""<template>
  <style>
    #root {{ position: absolute; inset: 0; }}
    .cap {{ position: absolute; left: 0; width: 1080px; top: 1215px; text-align: center; overflow: visible; }}
    .cap-in {{ display: inline-block; font-family: "Archivo Black", sans-serif; font-size: 86px; line-height: 1.05; color: #ffffff;
      -webkit-text-stroke: 12px #07031a; paint-order: stroke fill; text-shadow: 0 8px 0 rgba(7,3,26,0.95); max-width: 920px; }}
    .cap-in .w {{ display: inline-block; margin: 0 0.13em; }}
    .cap-in .hl {{ color: #ffd166; }}
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
{chr(10).join(html)}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{chr(10).join(js)}
    window.__timelines["captions"] = tl;
  </script>
</template>
"""
open(os.path.join(proj, "compositions/captions.html"), "w").write(out)
print(len(groups), "groups:", [" ".join(x["text"] for x in g) for g in groups])
