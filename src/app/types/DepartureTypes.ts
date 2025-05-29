export type Departure = {
  expectedDepartureTime: string;
  serviceJourney: {
    line: {
      publicCode: string;
      name: string;
      id: string;
    };
  };
};
