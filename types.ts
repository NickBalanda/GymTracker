export enum MeasurementUnit {
  KG = 'kg',
  LBS = 'lbs'
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  unit: MeasurementUnit;
  tutorialUrl?: string; // Image, Video, or Link
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  createdAt: number;
}

export interface WeightEntry {
  id: string;
  date: number; // timestamp
  weight: number;
  unit: MeasurementUnit;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CREATE_PLAN = 'CREATE_PLAN',
  EDIT_PLAN = 'EDIT_PLAN',
  VIEW_PLAN = 'VIEW_PLAN',
  WEIGHT_TRACKER = 'WEIGHT_TRACKER'
}
