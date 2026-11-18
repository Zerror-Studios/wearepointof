// Sidebar / slide structure for the Universe page. `ready: false` slides are listed
// in the nav (they are part of the 11-slide system) but have no section yet.
export const universeIntro = [
  { id: "cover", n: "01", label: "Cover", ready: true },
  { id: "manifesto", n: "02", label: "Manifesto", ready: true },
  { id: "what-is-a-brand", n: "03", label: "What Is A Brand", ready: true },
  { id: "immersions", n: "04", label: "Immersions", ready: true },
];

export const universeGroups = [
  {
    title: "Brand Strategy",
    items: [
      { id: "universe-and-core", n: "05", label: "Universe & Core", ready: true },
      { id: "positioning-and-audience", n: "06", label: "Positioning & Audience", ready: true },
      { id: "personality-and-voice", n: "07", label: "Personality & Voice", ready: true },
    ],
  },
  {
    title: "Brand Identity",
    items: [
      { id: "identity-design", n: "08", label: "Identity Design", ready: true },
      { id: "colour-and-typography", n: "09", label: "Colour & Typography", ready: true },
      { id: "visual-language", n: "10", label: "Visual Language", ready: true },
      { id: "deliverables", n: "11", label: "Deliverables", ready: true },
    ],
  },
];

export const universeSlides = [
  ...universeIntro,
  ...universeGroups.flatMap((g) => g.items),
];

export const immersions = [
  "Curated Questionnaire",
  "Brand Kickoff & Audit",
  "Target Audience",
  "Mission, Vision & Values",
  "USP & Story",
  "Positioning",
  "Brand Persona",
  "Tone Of Voice",
  "Look & Feel",
];
