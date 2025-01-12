// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Adam's Passion Project Blog";
export const SITE_DESCRIPTION =
  "During the coming weeks, I, Adam, a student at Devine, Kortrijk, will be working on a project know as my passion project. The idea is that I choose a topic that greatly interests me and research it in depth. On top of that, I will document all of my progress, findings and demos right here, on this blog.";

export const BASE = "/";

export const DEMO_KEY = "R2hbXuSkqLHPnzoC3EqIv0yYGieUHcqsAaEADIHd";

export const getNasaData = async () => {
  try {
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=2025-01-01&end_date=2025-01-07&api_key=${DEMO_KEY}`
    );

    const data = await response.json();
    return Object.values(data.near_earth_objects).flat();
  } catch {
    return [];
  }
};
