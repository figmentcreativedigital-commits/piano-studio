/*
 * Plain-language glossary. Any of these terms in lesson text gets a
 * tap-to-see definition. Definitions are written for a 7th-grade piano
 * student: one or two short sentences, everyday words.
 * `match` lists the spellings to find in text; the first is the main one.
 */

export interface GlossaryEntry {
  term: string;
  match: string[];
  def: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  { term: "sixth-diminished scale", match: ["sixth-diminished scale", "sixth-diminished", "sixth diminished"], def: "Barry Harris's 8-note scale. It's a major scale with one extra note, so the chord notes land on the beats." },
  { term: "sixth chord", match: ["sixth chord", "sixth chords"], def: "A major chord plus the 6th note of its scale. C6 is C E G A." },
  { term: "diminished chord", match: ["diminished chord", "diminished chords"], def: "A chord built from stacked small 3rds, like B D F A♭. It sounds tense and wants to move." },
  { term: "movement", match: ["chord movement", "movement"], def: "Barry Harris's word for sliding chords up and down the scale, every finger stepping to the next note." },
  { term: "guide tones", match: ["guide tones", "guide tone"], def: "The 3rd and 7th of a chord. These two notes tell your ear what kind of chord it is." },
  { term: "chord tones", match: ["chord tones", "chord tone"], def: "The notes that belong to the chord of the moment." },
  { term: "blues", match: ["12-bar blues"], def: "A 12-bar song form built on three main chords. Jazz players use it more than any other." },
  { term: "minor blues", match: ["minor blues"], def: "A 12-bar blues in a minor key. It sounds darker." },
  { term: "Rhythm changes", match: ["Rhythm changes", "rhythm changes"], def: "The chords of Gershwin's “I Got Rhythm”. Hundreds of jazz tunes use them." },
  { term: "changes", match: ["the changes"], def: "A jazz word for a song's chords." },
  { term: "form", match: ["the form", "blues form"], def: "The map of a song: how many bars, and which parts repeat." },
  { term: "chorus", match: ["chorus", "choruses"], def: "One time through the whole form of a song." },
  { term: "bridge", match: ["bridge"], def: "The middle part of a song, with different chords. It's the B in AABA." },
  { term: "head", match: ["the head"], def: "The written melody of a jazz tune. It's played at the start and the end." },
  { term: "riff", match: ["riff"], def: "A short, catchy phrase that repeats." },
  { term: "swing", match: ["swing", "swung"], def: "Playing pairs of eighth notes long-short, so the music bounces." },
  { term: "click on 2 and 4", match: ["click on 2 and 4", "2 and 4"], def: "The metronome clicks only on beats 2 and 4, like a jazz drummer's hi-hat. You feel 1 and 3 yourself." },
  { term: "comping", match: ["comping"], def: "Playing chords behind a melody or a solo, in short, well-placed hits." },
  { term: "voicing", match: ["voicings", "voicing"], def: "Which notes of a chord you play, and how you stack them." },
  { term: "dominant seventh", match: ["dominant seventh", "dominant sevenths", "dominants"], def: "A major chord with a lowered 7th on top, like F A C E♭. It leans toward the next chord." },
  { term: "ii–V", match: ["ii–V", "ii-V"], def: "Two chords that lead home, like Gm7 to C7 in the key of F." },
  { term: "invention", match: ["Invention", "invention"], def: "A short Bach piece where each hand plays its own melody." },
  { term: "subject", match: ["the subject"], def: "The short tune that opens a Bach invention. It gets passed between the hands." },
  { term: "tempo", match: ["tempo"], def: "How fast the beat goes. ♩ = 60 means 60 beats a minute." },
  { term: "octave", match: ["octave", "octaves"], def: "From one note to the next note with the same name, like C4 up to C5." },
  { term: "middle C", match: ["middle C"], def: "The C near the middle of the piano. It's called C4. C5 is the next C up." },
  { term: "fingering", match: ["fingering"], def: "Which finger plays each note. 1 is the thumb and 5 is the little finger." },
  { term: "key", match: ["key of"], def: "The home note and scale a piece uses, like F or B♭." },
  { term: "transfer", match: ["transfer"], def: "Playing the same idea in a new key." },
  { term: "by ear", match: ["by ear"], def: "Finding notes by listening, without written music." },
  { term: "transcription", match: ["transcription", "transcribing", "transcribe"], def: "Notes written down from a recording." },
  { term: "bebop", match: ["bebop"], def: "Fast, exciting jazz from the 1940s. Charlie Parker and Bud Powell led the way." },
  { term: "arm weight", match: ["arm-weight", "arm weight"], def: "Letting your relaxed arm's weight press the key, instead of pushing with your finger." },
  { term: "baseline", match: ["baseline"], def: "A first-day check of what your hands can already do. The lessons start from there." },
  { term: "check-in", match: ["check-in", "check in"], def: "A one-minute note after practice about how it went. It shapes the next lesson." },
  { term: "essential version", match: ["essential version", "20-minute version", "15-minute version"], def: "A short version of the lesson for busy days. It replaces the full session." },
  { term: "metronome", match: ["metronome"], def: "A steady clicking beat that helps you keep time." },
  { term: "bass clef", match: ["bass clef"], def: "The staff for lower notes, usually the left hand." },
  { term: "treble clef", match: ["treble clef"], def: "The staff for higher notes, usually the right hand." },
  { term: "measure", match: ["measure", "measures"], def: "A small box of beats in written music. In 4/4, each bar has 4 beats." },
  { term: "contrafact", match: ["contrafact"], def: "A new melody written over an older song's chords." },
  { term: "MIDI", match: ["MIDI"], def: "The language a digital piano uses to tell a computer which keys you press." },
];
