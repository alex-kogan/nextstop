/**
 * Swiss transit line color lookup.
 * Matches by operator name first, then falls back to category defaults.
 */
export function getLineColor(operator: string, category: string, lineNumber: string): string {
  const op = operator ?? "";
  const cat = category ?? "";
  const num = parseInt(lineNumber, 10);

  // ── ZVV / VBZ (Zurich) ────────────────────────────────────────────────────
  if (/VBZ|ZVV|ZSG|Limmattal/i.test(op)) {
    if (cat === "T") {
      const c: Record<number, string> = {
        2: "#00569b", 3: "#6cb33f", 4: "#c4007a", 5: "#9b6300",
        6: "#6f2282", 7: "#00694f", 8: "#003c8f", 9: "#00a9c7",
        10: "#008b7a", 11: "#6cb33f", 13: "#e4007e", 14: "#e84e0f",
        15: "#0075b0", 17: "#8a7200",
      };
      return c[num] ?? "#0070b4";
    }
    if (cat === "B") return "#f07d00";
    if (cat === "S") return "#169b62";
  }

  // ── BVB / BLT (Basel) ─────────────────────────────────────────────────────
  if (/BVB|BLT|Basel/i.test(op)) {
    if (cat === "T") {
      const c: Record<number, string> = {
        1: "#e2001a", 2: "#f9b000", 3: "#009640", 6: "#0069b4",
        8: "#e2001a", 10: "#a7006e", 11: "#009fe3", 14: "#e2001a",
        15: "#009640", 16: "#f9b000",
      };
      return c[num] ?? "#e2001a";
    }
    if (cat === "B") return "#f39200";
    if (cat === "S") return "#e2001a";
    return "#e2001a";
  }

  // ── Bernmobil / RBS (Bern) ────────────────────────────────────────────────
  if (/Bernmobil|RBS|BERNMOBIL|Bern/i.test(op)) {
    if (cat === "T") {
      const c: Record<number, string> = {
        6: "#e2001a", 7: "#f9b000", 8: "#009640", 9: "#0069b4",
      };
      return c[num] ?? "#e2001a";
    }
    if (cat === "B") return "#f39200";
    if (cat === "S") return "#009640";
    return "#e2001a";
  }

  // ── TPG (Geneva) ──────────────────────────────────────────────────────────
  if (/TPG|Geneva|Gen[eè]ve|Genf/i.test(op)) {
    if (cat === "T") {
      const c: Record<number, string> = {
        12: "#e2001a", 14: "#009640", 15: "#f9b000", 17: "#0069b4", 18: "#a7006e",
      };
      return c[num] ?? "#e2001a";
    }
    if (cat === "B") return "#f39200";
    return "#e2001a";
  }

  // ── TL / VMCV (Lausanne) ──────────────────────────────────────────────────
  if (/\bTL\b|VMCV|Lausanne|LEB/i.test(op)) {
    if (lineNumber === "m1") return "#e2001a";
    if (lineNumber === "m2") return "#009640";
    if (cat === "B") return "#f39200";
    return "#e2001a";
  }

  // ── TPF (Fribourg) ────────────────────────────────────────────────────────
  if (/TPF|Fribourg|Freiburg/i.test(op)) return "#e2001a";

  // ── RVBW / Aarau ──────────────────────────────────────────────────────────
  if (/RVBW|Aarau|\bAAR\b/i.test(op)) {
    if (cat === "B") return "#f39200";
    return "#e2001a";
  }

  // ── SBB / nationwide intercity ────────────────────────────────────────────
  if (cat === "IR" || cat === "IC" || cat === "RE") return "#eb0000";
  if (cat === "S") return "#169b62";

  // ── Category fallbacks ────────────────────────────────────────────────────
  if (cat === "T") return "#0069b4";
  if (cat === "B") return "#f39200";
  return "#888888";
}
