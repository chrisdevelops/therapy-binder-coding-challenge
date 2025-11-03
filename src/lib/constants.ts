const therapistId = import.meta.env.VITE_THERAPIST_ID as string;

if (!therapistId) {
  throw new Error(
    'Missing VITE_THERAPIST_ID environment variable. Please ensure it is set in your .env file.'
  );
}

export const THERAPIST_ID = therapistId;

