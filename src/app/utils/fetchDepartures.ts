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
              line {
                publicCode
              }
              from {
                stopPlace {
                  name
                }
              }
              to {
                stopPlace {
                  name
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

    // Logg hele API-responsen for å se hva som returneres
    console.log("Full API Response:", JSON.stringify(data, null, 2));

    // Håndter GraphQL-feil
    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      throw new Error(`API returnerte en GraphQL-feil: ${JSON.stringify(data.errors)}`);
    }

    return data.data?.stopPlace ?? { estimatedCalls: [] };
  } catch (error) {
    console.error("Fetch error:", error);
    return { estimatedCalls: [] };
  }
};
