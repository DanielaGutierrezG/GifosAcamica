"use strict";

import API_KEY from "../config/index.js";

class apiGipgy {
  constructor() {
    this.API_KEY = API_KEY.API_KEY;
    this.API_URL_SEARCH = "https://api.giphy.com/v1/gifs/search?";
    this.API_URL_TRENDING = "https://api.giphy.com/v1/gifs/trending?";
    this.API_URL_TAGS = "https://api.giphy.com/v1/gifs/search/tags?";
    this.API_URL_TAGS_RELATED = "https://api.giphy.com/v1/tags/related/"
    this.API_URL_SEARCH_ID = "https://api.giphy.com/v1/gifs/";
    this.API_URL_TRENDING_SEARCHES =
      "https://api.giphy.com/v1/trending/searches?";
      this.API_URL_UPLOAD = "https://upload.giphy.com/v1/gifs?"
    this.localStorageFavorites =
      JSON.parse(localStorage.getItem("listFavorites")) || [];
    this.localStorageTrending =
      JSON.parse(localStorage.getItem("listTrending")) || [];
    this.localStorageSearch =
      JSON.parse(localStorage.getItem("listSearch")) || [];
    this.localStorageMisGifos =
      JSON.parse(localStorage.getItem("listMisGifos")) || [];
  }

  
  async getResultsCategory(keywords) {
    try {
      return await fetch(
        `${this.API_URL_SEARCH}q=${keywords.toLowerCase()}&api_key=${
          this.API_KEY
        }&limit=12&lang=es`,
        { cache: "force-cache" }
      );
    } catch (error) {
      console.error(error);
    }
  }


  async getSuggestionsListCategory(keywords) {
    try {
      return await fetch(
        `${this.API_URL_TAGS}q=${keywords.toLowerCase()}&api_key=${
          this.API_KEY
        }&lang=es`,
        { cache: "force-cache" }
      );
    } catch (error) {
      console.error(error);
    }
  }

  async getSuggestionsListTags(keywords){
    try {
      return await fetch(`${this.API_URL_TAGS_RELATED}${keywords.toLowerCase()}?api_key=${this.API_KEY}&lang=es`)
    } catch (error) {
      console.error(error)
    }
  }

  
  async getTrendingGifs(limit, offset) {
    try {
      return await fetch(
        `${this.API_URL_TRENDING}api_key=${this.API_KEY}&limit=${limit}&offset=${offset}&lang=es`,
        { cache: "force-cache" }
      );
    } catch (error) {
      console.error(error);
    }
  }

  
  async getListTrendingSearch() {
    try {
      return await fetch(
        `${this.API_URL_TRENDING_SEARCHES}api_key=${this.API_KEY}`
      );
    } catch (error) {
      console.error(error);
    }
  }

  
  async getSeeMoreGifos(keywords, offset, limit) {
    try {
      return await fetch(
        `${this.API_URL_SEARCH}q=${keywords.toLowerCase()}&api_key=${
          this.API_KEY
        }&limit=${limit}&offset=${offset}&lang=es`,
        { cache: "force-cache" }
      );
    } catch (error) {
      console.error(error);
    }
  }


  async getGifoId(idGifo) {
    try {
      return await fetch(
        `${this.API_URL_SEARCH_ID}${idGifo}?api_key=${this.API_KEY}`,
        { cache: "force-cache" }
      );
    } catch (error) {
      console.error(error);
    }
  }
}

export default new apiGipgy();
