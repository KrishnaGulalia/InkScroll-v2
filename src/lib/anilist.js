const ANILIST_URL = 'https://graphql.anilist.co';

const MEDIA_LIST_QUERY = `
query ($page: Int, $perPage: Int, $sort: [MediaSort], $genre: String, $country: CountryCode, $search: String, $status: MediaStatus, $averageScore_greater: Int, $popularity_lesser: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { hasNextPage currentPage }
    media(
      type: MANGA
      sort: $sort
      genre: $genre
      countryOfOrigin: $country
      search: $search
      status: $status
      averageScore_greater: $averageScore_greater
      popularity_lesser: $popularity_lesser
      isAdult: false
    ) {
      id
      title { english romaji }
      coverImage { large extraLarge color }
      bannerImage
      averageScore
      popularity
      genres
      countryOfOrigin
      status
      chapters
      startDate { year }
    }
  }
}
`;

const MEDIA_DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    id
    title { english romaji native }
    coverImage { extraLarge color }
    bannerImage
    description(asHtml: false)
    averageScore
    popularity
    genres
    tags { name rank isMediaSpoiler }
    status
    chapters
    startDate { year month day }
    countryOfOrigin
    characters(sort: ROLE, perPage: 8) {
      nodes {
        name { full }
        image { medium }
      }
    }
    staff(perPage: 4) {
      nodes {
        name { full }
        primaryOccupations
        image { medium }
      }
    }
    relations {
      nodes {
        id
        title { english romaji }
        coverImage { medium }
        type
        format
      }
    }
    externalLinks { site url icon color }
  }
}
`;

async function anilistFetch(query, variables = {}) {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`AniList error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || 'AniList query failed');
  return json.data;
}

export async function fetchMediaList(variables = {}) {
  const data = await anilistFetch(MEDIA_LIST_QUERY, variables);
  return data.Page;
}

export async function fetchMediaDetail(id) {
  const data = await anilistFetch(MEDIA_DETAIL_QUERY, { id: parseInt(id) });
  return data.Media;
}
