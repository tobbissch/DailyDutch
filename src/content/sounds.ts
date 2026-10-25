export type SoundRule = {
  title: string
  text: string
  examples: { nl: string; en: string }[]
}

/** Dutch pronunciation rules, roughly from most to least surprising for English speakers. */
export const soundRules: SoundRule[] = [
  {
    title: 'g and ch — the throat sound',
    text: 'Both are a rough sound made at the back of the throat, like "ch" in Scottish "loch". Never like English "g" in "go". (In the south it sounds softer.)',
    examples: [
      { nl: 'goed', en: 'good' },
      { nl: 'dag', en: 'day' },
      { nl: 'acht', en: 'eight' },
      { nl: 'lachen', en: 'to laugh' },
      { nl: 'Goedemorgen!', en: 'Good morning!' },
    ],
  },
  {
    title: 'sch',
    text: 's + the throat sound: s-ch. At the end of a word -isch sounds like "ies".',
    examples: [
      { nl: 'school', en: 'school' },
      { nl: 'schoen', en: 'shoe' },
      { nl: 'logisch', en: 'logical' },
    ],
  },
  {
    title: 'ui',
    text: 'No English equivalent. Start from "ow" in "house", but round your lips and push the sound forward. Practise it — it is everywhere.',
    examples: [
      { nl: 'huis', en: 'house' },
      { nl: 'uit', en: 'out, from' },
      { nl: 'buik', en: 'belly' },
      { nl: 'Ik kom uit Spanje.', en: 'I come from Spain.' },
    ],
  },
  {
    title: 'ij and ei — the same sound',
    text: 'Two spellings, one sound: like "ay" in "day", with the mouth a bit more open. At the start of a sentence ij is capitalised as IJ.',
    examples: [
      { nl: 'mijn', en: 'my' },
      { nl: 'ijs', en: 'ice, ice cream' },
      { nl: 'klein', en: 'small' },
      { nl: 'trein', en: 'train' },
    ],
  },
  {
    title: 'eu',
    text: 'Like "e" in French "deux" or the "u" in "hurt" with rounded lips.',
    examples: [
      { nl: 'leuk', en: 'nice, fun' },
      { nl: 'neus', en: 'nose' },
      { nl: 'deur', en: 'door' },
    ],
  },
  {
    title: 'oe and ie',
    text: 'oe sounds like "oo" in "food". ie sounds like "ee" in "see". Not like English "toe" or "pie".',
    examples: [
      { nl: 'boek', en: 'book' },
      { nl: 'moeder', en: 'mother' },
      { nl: 'drie', en: 'three' },
      { nl: 'niet', en: 'not' },
    ],
  },
  {
    title: 'au and ou — the same sound',
    text: 'Like "ow" in "how". Two spellings, one sound.',
    examples: [
      { nl: 'oud', en: 'old' },
      { nl: 'koud', en: 'cold' },
      { nl: 'blauw', en: 'blue' },
      { nl: 'vrouw', en: 'woman' },
    ],
  },
  {
    title: 'Short and long vowels',
    text: 'One vowel in a closed syllable is short: man. A double vowel is long: maan. The meaning changes, so listen carefully.',
    examples: [
      { nl: 'man', en: 'man' },
      { nl: 'maan', en: 'moon' },
      { nl: 'pot', en: 'pot' },
      { nl: 'poot', en: 'paw' },
      { nl: 'zus', en: 'sister' },
      { nl: 'zuur', en: 'sour' },
    ],
  },
  {
    title: 'Why "manen" has only one a',
    text: 'A vowel at the end of a syllable is always long, so it is written once: maan → ma-nen, boom → bo-men. A short vowel needs a double consonant to stay short: man → man-nen.',
    examples: [
      { nl: 'manen', en: 'moons' },
      { nl: 'mannen', en: 'men' },
      { nl: 'bomen', en: 'trees' },
    ],
  },
  {
    title: 'The weak e (uh)',
    text: 'An unstressed e is a short, lazy "uh", like the "a" in "about". You hear it in de, je, me, te and in endings.',
    examples: [
      { nl: 'de', en: 'the' },
      { nl: 'lopen', en: 'to walk' },
      { nl: 'Ik heb een fiets.', en: 'I have a bike. (een = "un")' },
    ],
  },
  {
    title: '-en endings: the n often disappears',
    text: 'In normal speech the final n of -en is usually dropped: lopen sounds like "lope". Both are correct.',
    examples: [
      { nl: 'eten', en: 'to eat' },
      { nl: 'maken', en: 'to make' },
      { nl: 'Wij gaan morgen fietsen.', en: 'We are going cycling tomorrow.' },
    ],
  },
  {
    title: 'd and b at the end sound like t and p',
    text: 'At the end of a word, d is pronounced t and b is pronounced p: hond sounds like "hont". In the plural the d comes back: honden.',
    examples: [
      { nl: 'hond', en: 'dog' },
      { nl: 'honden', en: 'dogs' },
      { nl: 'goed', en: 'good' },
      { nl: 'web', en: 'web' },
    ],
  },
  {
    title: 'w and v',
    text: 'w is softer than English w: the bottom lip lightly touches the upper teeth. v is often almost an f, especially at the start of a word.',
    examples: [
      { nl: 'wat', en: 'what' },
      { nl: 'water', en: 'water' },
      { nl: 'vader', en: 'father' },
      { nl: 'veel', en: 'much, many' },
    ],
  },
  {
    title: 'j is English y',
    text: 'Dutch j sounds like the "y" in "yes". Never like English "j".',
    examples: [
      { nl: 'ja', en: 'yes' },
      { nl: 'jij', en: 'you' },
      { nl: 'jaar', en: 'year' },
    ],
  },
  {
    title: 'r',
    text: 'Rolled with the tongue or made in the throat — both are fine. At the end of a word many people say a soft, English-like r.',
    examples: [
      { nl: 'rood', en: 'red' },
      { nl: 'raam', en: 'window' },
      { nl: 'maar', en: 'but' },
    ],
  },
  {
    title: '-tje and -je',
    text: 'The diminutive -tje sounds like "tyuh"; -je sounds like "yuh". After s, -sje sounds like "shuh".',
    examples: [
      { nl: 'biertje', en: 'small beer' },
      { nl: 'kopje', en: 'cup' },
      { nl: 'meisje', en: 'girl' },
    ],
  },
  {
    title: 'Stress',
    text: 'Most words are stressed on the first syllable. The prefixes be-, ge-, ver-, her- and ont- are never stressed: the stress moves to the next syllable.',
    examples: [
      { nl: 'vader', en: 'father (VA-der)' },
      { nl: 'betalen', en: 'to pay (be-TA-len)' },
      { nl: 'vergeten', en: 'to forget (ver-GE-ten)' },
      { nl: 'gesprek', en: 'conversation (ge-SPREK)' },
    ],
  },
]
