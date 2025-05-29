export type EstimatedCall = {
  expectedDepartureTime?: string; // ISO string like "2024-05-29T13:30:00+02:00"
  destinationDisplay?: {
    frontText?: string;
  };
  serviceJourney?: {
    line?: {
      id: string;
      publicCode: string;
      name: string;
    };
  };
};