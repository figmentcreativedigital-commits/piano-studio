"""Browser audit: parse every exercise with abcjs, report warnings, and compare
playback pitches with the authored pitch names for chord-based exercises.
Also renders a contact sheet of every exercise for a visual check."""
import json, os, sys
from playwright.sync_api import sync_playwright

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.load(open(os.path.join(root, "tests/.audit/abc.json")))
abcjs = os.path.join(root, "node_modules/abcjs/dist/abcjs-basic-min.js")
html = "<html><body style='width:900px;font-family:sans-serif'><div id=out></div></body></html>"
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 920, "height": 800})
    pg.set_content(html)
    pg.add_script_tag(path=abcjs)
    res = pg.evaluate("""(data) => {
      const out = [];
      const host = document.getElementById('out');
      for (const d of data) {
        const h = document.createElement('div'); h.style.margin='18px 0'; h.innerHTML = '<b>'+d.id+'</b>'; const s = document.createElement('div'); h.appendChild(s); host.appendChild(h);
        const v = ABCJS.renderAbc(s, d.abc, {add_classes:true, staffwidth: 860})[0];
        const au = v.setUpAudio({chordsOff:true});
        const notes = [];
        au.tracks.forEach((tr,vi)=>tr.forEach(n=>{ if(n.cmd==='note') notes.push({v:vi,start:n.start,pitch:n.pitch}); }));
        // group by start time (single voice chords)
        const groups = {};
        notes.filter(n=>n.v===0).forEach(n=>{ (groups[n.start] = groups[n.start]||[]).push(n.pitch); });
        const seq = Object.keys(groups).map(Number).sort((a,b)=>a-b).map(k=>groups[k].sort((a,b)=>a-b));
        out.push({id:d.id, warnings: v.warnings || [], seq, expected: d.expected, total: au.totalDuration});
      }
      return out;
    }""", data)
    bad = 0
    for r in res:
        if r["warnings"]:
            bad += 1; print("WARN", r["id"], r["warnings"])
        if r["expected"] is not None:
            exp = [sorted(c) for c in r["expected"]]
            if exp != r["seq"]:
                bad += 1; print("PITCH MISMATCH", r["id"], "\n expected", exp, "\n got     ", r["seq"])
            else:
                print("ok pitches", r["id"], len(exp), "chords")
    pg.screenshot(path=os.path.join(root, "tests/.audit/contact-sheet.png"), full_page=True)
    b.close()
print("problems:", bad)
sys.exit(1 if bad else 0)
