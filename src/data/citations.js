// Shared citation URLs — kept in one place so Science.svelte's hand-written
// prose links and AboutModel.svelte's auto-linked source strings can never
// point at different URLs for the same paper.

export const CITATION_URLS = {
  sarcopeniaWikipedia: 'https://en.wikipedia.org/wiki/Sarcopenia',
  icd10M6284: 'https://www.icd10data.com/ICD10CM/Codes/M60-M63/M60-M63/M62-/M62.84',
  cruzJentoft2019: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6322506/',
  mitchell2012: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3429036/',
  goodpaster2006: 'https://academic.oup.com/biomedgerontology/article/61/10/1059/600461',
  janssen2000: 'https://pubmed.ncbi.nlm.nih.gov/10904038/',
  silva2023: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10791914/',
  baumgartner1998: 'https://academic.oup.com/aje/article-abstract/147/8/755/88959',
  cawthon2014: 'https://academic.oup.com/biomedgerontology/article/69/5/567/672754',
  fnihProject: 'https://academic.oup.com/biomedgerontology/article/69/5/547/672497',
  walker2023: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10650965/',
  piasecki2019: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6719569/',
  wroblewski2011:
    'https://www.researchgate.net/publication/51748759_Chronic_Exercise_Preserves_Lean_Muscle_Mass_in_Masters_Athletes',
  refalo2025: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11869894/',
};

// Matches the "Author et al. YYYY" style used in the data files' plain-text
// `source` fields (no comma before the year, unlike the "Author et al.,
// YYYY" style used in Science.svelte's own prose) and wraps each hit in a
// link, so every citation surfaced in the "About the model" panel is
// clickable without hand-authoring HTML inside the data/model files.
const CITATION_PATTERNS = [
  ['Mitchell et al. 2012', CITATION_URLS.mitchell2012],
  ['Goodpaster et al. 2006', CITATION_URLS.goodpaster2006],
  ['Janssen et al. 2000', CITATION_URLS.janssen2000],
  ['Silva et al. 2023', CITATION_URLS.silva2023],
  ['EWGSOP2', CITATION_URLS.cruzJentoft2019],
  ['Cruz-Jentoft et al. 2019', CITATION_URLS.cruzJentoft2019],
  ['Baumgartner et al. 1998', CITATION_URLS.baumgartner1998],
  ['FNIH', CITATION_URLS.fnihProject],
  ['Cawthon et al. 2014', CITATION_URLS.cawthon2014],
  ['Walker et al. 2023', CITATION_URLS.walker2023],
  ['Piasecki et al. 2019', CITATION_URLS.piasecki2019],
  ['Wroblewski et al. 2011', CITATION_URLS.wroblewski2011],
  ['Refalo et al. 2025', CITATION_URLS.refalo2025],
];

export function linkifyCitations(text) {
  if (!text) return text;
  return CITATION_PATTERNS.reduce(
    (result, [phrase, url]) =>
      result.split(phrase).join(`<a href="${url}" target="_blank" rel="noopener noreferrer">${phrase}</a>`),
    text
  );
}
