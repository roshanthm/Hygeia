
export enum AuthenticityStatus {
  AUTHENTIC = 'AUTHENTIC',
  COUNTERFEIT = 'COUNTERFEIT',
  SUSPICIOUS = 'SUSPICIOUS',
  UNKNOWN = 'UNKNOWN'
}

export type Page = 'home' | 'fake-detection' | 'safety-check';

export interface DrugIngredient {
  name: string;
  dosage: string;
}

export interface DrugAnalysis {
  name: string;
  manufacturer: string;
  activeIngredients: DrugIngredient[];
  drugFamily: string;
  authenticityStatus: AuthenticityStatus;
  confidenceScore: number;
  authenticityReasoning: string;
  sideEffects: {
    effect: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
}

export interface SafetyCheckResult {
  status: 'SAFE' | 'CAUTION' | 'RISK';
  warnings: string[];
  explanation: string;
  drugDetails?: {
    name: string;
    ingredients: string[];
    family: string;
  };
}
