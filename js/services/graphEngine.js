// DoseAlert - Deterministic Knowledge Graph Query & Reasoning Engine
// Evaluates Pairwise Drug-Drug Interactions, Drug-Food Interactions, and Duplicate Therapies

import { DRUG_INTERACTIONS, DRUG_FOOD_INTERACTIONS, SEVERITY_LEVELS } from '../data/knowledgeGraph.js';

export function runInteractionCheck(confirmedMedicines = []) {
  const result = {
    medicines: confirmedMedicines,
    drugDrugFindings: [],
    foodFindings: [],
    duplicateFindings: [],
    notCheckedItems: [],
    summary: {
      totalMeds: confirmedMedicines.length,
      contraindicatedCount: 0,
      majorCount: 0,
      moderateCount: 0,
      minorCount: 0,
      totalFindings: 0
    }
  };

  // Identify unrecognised or not-checked items
  const validDrugs = [];
  for (const med of confirmedMedicines) {
    if (!med.generic_code || med.status === "unrecognised") {
      result.notCheckedItems.push({
        raw_text: med.raw_text || med.brand,
        reason: "Unrecognised brand or generic code"
      });
    } else {
      validDrugs.push(med);
    }
  }

  // 1. Pairwise Drug-Drug Interaction queries
  const processedPairs = new Set();
  for (let i = 0; i < validDrugs.length; i++) {
    for (let j = i + 1; j < validDrugs.length; j++) {
      const medA = validDrugs[i];
      const medB = validDrugs[j];
      const codeA = medA.generic_code;
      const codeB = medB.generic_code;

      const pairKey = [codeA, codeB].sort().join("___");
      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);

      // Check duplicates first (same generic active ingredient)
      if (codeA === codeB) {
        result.duplicateFindings.push({
          id: `dup_${codeA}`,
          type: "duplicate",
          severity: "major",
          medA,
          medB,
          generic: medA.generic,
          headline: `Duplicate Active Ingredient: ${medA.generic}`,
          detail: `Both "${medA.brand}" and "${medB.brand}" contain ${medA.generic}. Taking both causes accidental double-dosing.`
        });
        result.summary.majorCount++;
        continue;
      }

      // Query Knowledge Graph pairwise interactions
      const interaction = DRUG_INTERACTIONS.find(ddi => {
        return (ddi.drugs[0] === codeA && ddi.drugs[1] === codeB) ||
               (ddi.drugs[0] === codeB && ddi.drugs[1] === codeA);
      });

      if (interaction) {
        const severityMeta = SEVERITY_LEVELS[interaction.severity.toUpperCase()] || SEVERITY_LEVELS.MINOR;
        
        result.drugDrugFindings.push({
          ...interaction,
          medA,
          medB,
          severityMeta,
          drugsInvolved: [medA.id, medB.id]
        });

        if (interaction.severity === "contraindicated") result.summary.contraindicatedCount++;
        else if (interaction.severity === "major") result.summary.majorCount++;
        else if (interaction.severity === "moderate") result.summary.moderateCount++;
        else if (interaction.severity === "minor") result.summary.minorCount++;
      }
    }
  }

  // Sort Drug-Drug findings strictly by priority (Contraindicated -> Major -> Moderate -> Minor)
  result.drugDrugFindings.sort((a, b) => {
    return a.severityMeta.priority - b.severityMeta.priority;
  });

  // 2. Drug-Food Interaction queries
  const distinctGenericCodes = new Set(validDrugs.map(m => m.generic_code));
  for (const foodEdge of DRUG_FOOD_INTERACTIONS) {
    if (distinctGenericCodes.has(foodEdge.generic_code)) {
      const relatedMed = validDrugs.find(m => m.generic_code === foodEdge.generic_code);
      result.foodFindings.push({
        ...foodEdge,
        relatedMed,
        severityMeta: SEVERITY_LEVELS[foodEdge.severity.toUpperCase()] || SEVERITY_LEVELS.MODERATE
      });
    }
  }

  result.summary.totalFindings = result.drugDrugFindings.length + result.duplicateFindings.length;
  return result;
}
