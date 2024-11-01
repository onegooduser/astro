import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

const unsplash = createApi({
  accessKey: import.meta.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch as unknown as typeof fetch,
});

export async function searchPhotos(query: string, page = 1, perPage = 10) {
  try {
    const result = await unsplash.search.getPhotos({
      query,
      page,
      perPage,
    });

    if (result.errors) {
      throw new Error(result.errors[0]);
    }

    return result.response;
  } catch (error) {
    console.error('Error searching Unsplash photos:', error);
    throw error;
  }
}

export async function getRandomPhoto(query?: string) {
  try {
    const result = await unsplash.photos.getRandom({
      query,
      count: 1,
    });

    if (result.errors) {
      throw new Error(result.errors[0]);
    }

    return Array.isArray(result.response) 
      ? result.response[0] 
      : result.response;
  } catch (error) {
    console.error('Error getting random Unsplash photo:', error);
    throw error;
  }
}

export async function getPhotoById(photoId: string) {
  try {
    const result = await unsplash.photos.get({ photoId });

    if (result.errors) {
      throw new Error(result.errors[0]);
    }

    return result.response;
  } catch (error) {
    console.error('Error getting Unsplash photo by ID:', error);
    throw error;
  }
}
