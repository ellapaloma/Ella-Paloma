/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Graduate, SurveyNotificationState, EmailLogEntry, CurriculumEnhancementReport } from '../types';

export async function fetchAlumni(): Promise<Graduate[]> {
  const response = await fetch('/api/alumni');
  if (!response.ok) {
    throw new Error('Failed to retrieve alumni database');
  }
  return response.json();
}

export async function createAlumni(graduate: Omit<Graduate, 'id'>): Promise<Graduate> {
  const response = await fetch('/api/alumni', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graduate)
  });
  if (!response.ok) {
    throw new Error('Failed to create graduate profile');
  }
  return response.json();
}

export async function updateAlumni(id: string, graduate: Partial<Graduate>): Promise<Graduate> {
  const response = await fetch(`/api/alumni/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graduate)
  });
  if (!response.ok) {
    throw new Error('Failed to update graduate profile');
  }
  return response.json();
}

export async function deleteAlumni(id: string): Promise<Graduate> {
  const response = await fetch(`/api/alumni/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete graduate profile');
  }
  return response.json();
}

export async function resetDatabase(): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/reset', {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Failed to reset dataset');
  }
  return response.json();
}

export async function analyzeAlignment(id: string): Promise<Graduate> {
  const response = await fetch(`/api/alumni/${id}/analyze`, {
    method: 'POST'
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to complete core verticality analysis');
  }
  return response.json();
}

export async function generateCurriculumReport(): Promise<CurriculumEnhancementReport> {
  const response = await fetch('/api/decision-support/generate', {
    method: 'POST'
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to synthesis feedback for curriculum enhancements');
  }
  return response.json();
}

export async function fetchSurveyConfig(): Promise<SurveyNotificationState> {
  const response = await fetch('/api/survey/config');
  if (!response.ok) {
    throw new Error('Failed to fetch survey configurations');
  }
  return response.json();
}

export async function saveSurveyConfig(config: Partial<SurveyNotificationState>): Promise<SurveyNotificationState> {
  const response = await fetch('/api/survey/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!response.ok) {
    throw new Error('Failed to save survey configurations');
  }
  return response.json();
}

export async function fetchSurveyLogs(): Promise<EmailLogEntry[]> {
  const response = await fetch('/api/survey/logs');
  if (!response.ok) {
    throw new Error('Failed to retrieve email logs');
  }
  return response.json();
}

export async function sendSurveyBatch(recipientIds: string[]): Promise<{ success: boolean; sentCount: number; logs: EmailLogEntry[] }> {
  const response = await fetch('/api/survey/send-batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipientIds })
  });
  if (!response.ok) {
    throw new Error('Failed to send survey notifications');
  }
  return response.json();
}

export async function simulateAlumniResponse(payload: {
  id: string;
  usefulSkills: string;
  obsoleteSkills: string;
  curriculumGaps: string;
  relevanceRating: number;
}): Promise<Graduate> {
  const response = await fetch('/api/survey/submit-simulation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('Failed to submit simulated survey response');
  }
  return response.json();
}
