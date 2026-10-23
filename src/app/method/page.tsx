import type { Metadata } from "next";
import { METHOD, METHOD_INTRO, METHOD_TITLE, plain } from "@/content/method";
import { NarratorAudition } from "@/components/ReadAloud";
import { NARRATOR_SAMPLE } from "@/lib/narration";
import { readable } from "@/lib/speech-text";
import { Gloss } from "@/components/Gloss";

export const metadata: Metadata = { title: "Method", description: "How Woodshed teaches, where its material comes from, and what happens to your data." };

const SOURCES = [
  { label: "Google Cloud Text-to-Speech, Chirp 3 HD voices (the studio narrator)", href: "https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd" },
  { label: "Barry Harris in class: 'Introducing the sixth diminished scale' (The Hague)", href: "https://www.youtube.com/watch?v=-jO-sIrjTqg" },
  { label: "barryharrismethod.com: Barry's teaching in his own words, each point linked to the moment in his class recordings (independent archive)", href: "https://barryharrismethod.com/" },
  { label: "Howard Rees on Harris's voicings (Keyboard, November 1998)", href: "https://jazzschoolonline.com/evolutionary-voicings-part-ii/" },
  { label: "The Barry Harris Workshop Video and workbook (Howard Rees, Jazz Workshops)", href: "https://jazzworkshops.com/the-barry-harris-workshop-video/" },
  { label: "Robbie Barnby, 'Barry Harris 6th Diminished Scale FULLY EXPLAINED' (2021), used as a secondary source", href: "https://www.youtube.com/watch?v=7reOAaveCi0" },
  { label: "J.S. Bach, Inventions and Sinfonias, BWV 772–801 (IMSLP)", href: "https://imslp.org/wiki/Inventions_and_Sinfonias,_BWV_772-801_(Bach,_Johann_Sebastian)" },
  { label: "Jazz Giant (Bud Powell): session details", href: "https://en.wikipedia.org/wiki/Jazz_Giant" },
  { label: "Sonny Clark Trio (Blue Note BLP 1579): session details", href: "https://en.wikipedia.org/wiki/Sonny_Clark_Trio" },
  { label: "Horace Silver and the Jazz Messengers: session details", href: "https://en.wikipedia.org/wiki/Horace_Silver_and_the_Jazz_Messengers" },
  { label: "Lester Young and 'Oh! Lady be Good' (1936)", href: "https://gwallter.com/music/lester-young-and-oh-lady-be-good.html" },
  { label: "abcjs, the notation engine", href: "https://www.abcjs.net/" },
];

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : p.startsWith("*") ? (
          <em key={i}>{p.slice(1, -1)}</em>
        ) : (
          <Gloss key={i} text={p} />
        ),
      )}
    </>
  );
}

export default function MethodPage() {
  return (
    <>
      <div className="wrap page-head">
        <h1 {...readable(METHOD_TITLE)}>{METHOD_TITLE}</h1>
        <p {...readable(METHOD_INTRO)}>{METHOD_INTRO}</p>
      </div>
      <div className="wrap prose" style={{ paddingBottom: 56 }}>
        {METHOD.map((m) => (
          <section key={m.heading}>
            <h2 className="section-head" {...readable(m.heading)}>
              {m.heading}
            </h2>
            {m.paragraphs.map((t) => (
              <p key={t} {...readable(plain(t))}>
                <Inline text={t} />
              </p>
            ))}
            {m.list && (
              <ul>
                {m.list.map((i) => (
                  <li key={i.term} {...readable(`${i.term}: ${i.text}`)}>
                    <strong>{i.term}:</strong> {i.text}
                  </li>
                ))}
              </ul>
            )}
            {(m.after ?? []).map((t) => (
              <p key={t} {...readable(plain(t))}>
                <Inline text={t} />
              </p>
            ))}
            {m.heading === "Accessibility" && (
              <div className="narrator-box">
                <NarratorAudition sample={NARRATOR_SAMPLE} />
              </div>
            )}
          </section>
        ))}

        <h2 className="section-head">Sources</h2>
        <ul>
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
