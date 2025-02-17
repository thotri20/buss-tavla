// utils/fetchNearestStopPlace.ts

export const fetchNearestStopPlace = async (latitude: number, longitude: number) => {
    try {
      const ENTUR_API = "https://api.entur.io/journey-planner/v3/graphql";
      
      const query = `
        query {
          nearestStopPlaces(latitude: ${latitude}, longitude: ${longitude}) {
            id
            name
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
  
      // Logg hele data-responsen for feilsøking
      console.log("Full API Response:", JSON.stringify(data, null, 2));
  
      // Håndter GraphQL-feil
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        console.error("GraphQL error:", data.errors);
        throw new Error(`API returnerte en GraphQL-feil: ${JSON.stringify(data.errors)}`);
      }
  
      // Sjekk om vi har hentet stoppestedet
      if (data.data && data.data.nearestStopPlaces && data.data.nearestStopPlaces.length > 0) {
        return data.data.nearestStopPlaces[0]; // Returner nærmeste stoppested
      }
  
      // Hvis ingen stoppesteder ble funnet
      throw new Error("Ingen stoppesteder funnet for de angitte koordinatene.");
  
    } catch (error) {
      console.error("Fetch error:", error);
      return null;  // Returner null i tilfelle feil
    }
  };
  