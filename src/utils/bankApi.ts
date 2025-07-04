export async function fetchPrimeRate(): Promise<number | null> {
  try {
    const response = await fetch('https://www.bankofcanada.ca/valet/observations/V80691311/json?recent=1');
    if (!response.ok) {
      console.error('Failed to fetch prime rate: HTTP status', response.status);
      return null;
    }
    const data = await response.json();
    if (data.observations && data.observations.length > 0) {
      const rateStr = data.observations[0].V80691311?.v;
      if (rateStr) {
        return parseFloat(rateStr);
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching prime rate:', error);
    return null;
  }
}