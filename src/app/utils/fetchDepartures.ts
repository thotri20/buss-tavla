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
            }
          }
        }
      `;
  
      const response = await fetch(ENTUR_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ET-Client-Name": "my-entur-tavle",
        },
        body: JSON.stringify({ query }),
      });
  
      if (!response.ok) {
        throw new Error("Feil ved API-kall");
      }
  
      const data = await response.json();
      return data.data.stopPlace || { estimatedCalls: [] };
    } catch (error) {
      console.error("Fetch error:", error);
      return { estimatedCalls: [] };
    }
  };
  