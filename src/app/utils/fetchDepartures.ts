// fetchDepartures.ts
export const fetchDepartures = async (stopPlaceId: string) => {
  try {
    const ENTUR_API = "https://api.entur.io/journey-planner/v3/graphql";

    const query = `
      query {
        stopPlace(id: "NSR:StopPlace:${stopPlaceId}") {
          name
          estimatedCalls(numberOfDepartures: 5) {
            expectedDepartureTime
            destinationDisplay {
              frontText
            }
            serviceJourney {
              journeyPattern {
                line {
                  publicCode
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(ENTUR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "ET-Client-Name": "my-entur-tavle",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Feil ved API-kall: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Logg hele API-responsen for debugging
    console.log("Data received from API:", data);

    // Sjekk om GraphQL har feilmeldinger
    if (data.errors) {
      console.error("GraphQL error:", data.errors);
      throw new Error("API returnerte en GraphQL-feil");
    }

    // Håndter tomme svar eller feilaktige data
    if (!data.data || !data.data.stopPlace) {
      throw new Error("Ingen data ble hentet for stoppestedet.");
    }

    return data.data.stopPlace; // Returnerer stoppestedet med avganger
  } catch (error) {
    console.error("Fetch error:", error);
    return { estimatedCalls: [] }; // Returner tom liste for avganger ved feil
  }
};
