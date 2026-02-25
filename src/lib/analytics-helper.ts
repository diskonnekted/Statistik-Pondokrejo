
import { StandardStatData } from "./excel-helper";

export interface AgeGroup {
  label: string;
  total: number;
  male: number;
  female: number;
}

export interface DependencyRatio {
  youthDependency: number; // 0-14
  elderlyDependency: number; // 65+
  totalDependency: number;
  workingAgePopulation: number;
  youthPopulation: number;
  elderlyPopulation: number;
}

export interface SexRatio {
  total: number;
  male: number;
  female: number;
  ratio: number; // (Male / Female) * 100
}

/**
 * Calculates dependency ratio from age group data.
 * Assumes standard 5-year age group labels (e.g., "0-4", "5-9", ..., "75+").
 */
export function calculateDependencyRatio(data: StandardStatData[]): DependencyRatio {
  let youthPop = 0;
  let elderlyPop = 0;
  let workingPop = 0;

  data.forEach(item => {
    const label = item.label.replace(/\s+/g, ''); // Remove spaces
    
    // Parse range
    if (label.includes("-")) {
      const parts = label.split("-");
      const min = parseInt(parts[0]);
      // const max = parseInt(parts[1]); // Not strictly needed for bucketing if min is enough
      
      if (min < 15) {
        youthPop += item.total;
      } else if (min >= 65) {
        elderlyPop += item.total;
      } else {
        workingPop += item.total;
      }
    } else if (label.includes("+") || label.includes(">")) {
      // e.g., "75+"
      const min = parseInt(label.replace(/\D/g, ''));
      if (min >= 65) {
        elderlyPop += item.total;
      } else {
        workingPop += item.total; // Fallback, though unlikely for "X+" to be < 15
      }
    } else {
        // Try to parse single number or handle "Di atas X"
        const num = parseInt(label);
        if (!isNaN(num)) {
             if (num < 15) youthPop += item.total;
             else if (num >= 65) elderlyPop += item.total;
             else workingPop += item.total;
        }
    }
  });

  // Calculate ratios
  // Avoid division by zero
  const youthDep = workingPop > 0 ? (youthPop / workingPop) * 100 : 0;
  const elderlyDep = workingPop > 0 ? (elderlyPop / workingPop) * 100 : 0;
  const totalDep = workingPop > 0 ? ((youthPop + elderlyPop) / workingPop) * 100 : 0;

  return {
    youthDependency: parseFloat(youthDep.toFixed(2)),
    elderlyDependency: parseFloat(elderlyDep.toFixed(2)),
    totalDependency: parseFloat(totalDep.toFixed(2)),
    workingAgePopulation: workingPop,
    youthPopulation: youthPop,
    elderlyPopulation: elderlyPop
  };
}

/**
 * Calculates sex ratio from population data.
 */
export function calculateSexRatio(male: number, female: number): SexRatio {
  const ratio = female > 0 ? (male / female) * 100 : 0;
  return {
    total: male + female,
    male,
    female,
    ratio: parseFloat(ratio.toFixed(2))
  };
}

/**
 * Identify top and bottom SDGs goals
 */
export function analyzeSDGsGap(sdgsData: any[]) {
    // Filter out Goal 14 (Desa Peduli Lingkungan Laut) if score is 0, as it is irrelevant for non-coastal areas like Pondokrejo
    // Also filter out other goals with 0 score from the "Bottom" analysis to avoid showing "No Data" as "Priority for Improvement"
    // We want to show actual low scores that need improvement.
    const activeGoals = sdgsData.filter(item => {
        // Always exclude Goal 14 if 0
        if (item.goals === 14 && item.score === 0) return false;
        // Optional: Exclude all 0s from analysis? 
        // If we do that, we might miss "truly bad" performance, but usually 0 means not filled.
        // Let's keep other 0s but maybe sort them last?
        return true;
    });

    // Sort by score descending
    const sorted = [...activeGoals].sort((a, b) => b.score - a.score);
    
    const top3 = sorted.slice(0, 3);
    
    // For bottom 3, we prefer non-zero low scores over 0 scores if possible.
    // If we have enough non-zero scores, use them.
    const nonZeroes = sorted.filter(item => item.score > 0);
    
    let bottom3;
    if (nonZeroes.length >= 3) {
        // If we have at least 3 non-zero scores, show the lowest non-zero ones
        bottom3 = nonZeroes.slice(-3).reverse();
    } else {
        // Otherwise fall back to including zeroes (but Goal 14 is already gone)
        bottom3 = sorted.slice(-3).reverse();
    }
    
    // Calculate average based on relevant data
    const totalScore = activeGoals.reduce((acc, curr) => acc + curr.score, 0);
    const average = activeGoals.length > 0 ? totalScore / activeGoals.length : 0;

    return {
        top3,
        bottom3,
        average: parseFloat(average.toFixed(2))
    };
}
