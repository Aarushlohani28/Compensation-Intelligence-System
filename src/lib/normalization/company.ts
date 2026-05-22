export function normalizeCompanyName(company: string): string {
  if (!company) return "";
  
  let normalized = company.toLowerCase().trim();
  
  const suffixes = [
    " inc", " inc.", " incorporated",
    " corp", " corp.", " corporation",
    " llc", " ltd", " pvt", " pvt.", " private", " limited"
  ];
  
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of suffixes) {
      if (normalized.endsWith(suffix)) {
        normalized = normalized.slice(0, -suffix.length).trim();
        changed = true;
      }
    }
  }

  // Normalize multiple spaces to single space
  normalized = normalized.replace(/\s+/g, ' ');

  return normalized;
}
