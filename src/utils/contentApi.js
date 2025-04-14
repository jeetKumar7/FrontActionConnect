import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCalendar, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

// API Keys and Base URLs
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";
const NEWS_BASE_URL = "https://newsapi.org/v2/everything";
const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const TED_TALKS_BASE_URL = "https://tedtalksapi.herokuapp.com/api";

export const fetchYouTubeVideos = async (searchQuery, maxResults = 10) => {
  try {
    const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
      params: {
        part: "snippet",
        maxResults,
        q: searchQuery,
        type: "video",
        key: YOUTUBE_API_KEY,
        relevanceLanguage: "en",
        videoEmbeddable: true,
      },
    });

    return response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      type: "youtube",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};

export const fetchNewsArticles = async (searchQuery = "environment", pageSize = 10) => {
  try {
    // Get date for 'from' parameter (30 days ago)
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const fromDateString = fromDate.toISOString().split("T")[0];

    const response = await axios.get(`${NEWS_BASE_URL}`, {
      params: {
        q: searchQuery,
        from: fromDateString,
        language: "en",
        sortBy: "relevancy",
        pageSize,
        apiKey: NEWS_API_KEY,
      },
    });

    return response.data.articles.map((article) => ({
      id: article.url,
      title: article.title,
      description: article.description || "No description available",
      url: article.url,
      thumbnail: article.urlToImage || "https://via.placeholder.com/300x200?text=No+Image",
      publishedAt: article.publishedAt,
      source: article.source.name,
      author: article.author || "Unknown Author",
      type: "article",
    }));
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return [];
  }
};

export const fetchBooks = async (query, maxResults = 10) => {
  try {
    const response = await axios.get(GOOGLE_BOOKS_BASE_URL, {
      params: {
        q: query,
        maxResults,
        key: GOOGLE_BOOKS_API_KEY,
      },
    });

    return response.data.items.map((book) => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || ["Unknown Author"],
      description: book.volumeInfo.description || "No description available",
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x192?text=No+Cover",
      previewLink: book.volumeInfo.previewLink,
      publishedDate: book.volumeInfo.publishedDate,
      infoLink: book.volumeInfo.infoLink,
      type: "book",
    }));
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

// Add or replace the fetchTedTalks function

export const fetchTedTalks = async (query) => {
  try {
    // Use YouTube API to fetch TED talks
    const searchQuery = query ? `TED Talk ${query}` : "TED Talk social impact";

    // Add a timestamp or random parameter to avoid caching issues
    const cacheBuster = Date.now();

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&type=video&maxResults=10&key=${YOUTUBE_API_KEY}&_=${cacheBuster}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("YouTube API request failed");
    }

    const data = await response.json();

    return data.items.map((item) => ({
      id: `ted-${item.id.videoId}`, // Prefix to distinguish from regular videos
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      type: "talks",
      source: "TED Talks",
    }));
  } catch (error) {
    console.error("Error fetching TED talks:", error);
    // Return empty array on error
    return [];
  }
};

export const fetchMixedContent = async (topic, limit = 6) => {
  try {
    const [videos, articles, books, talks] = await Promise.allSettled([
      fetchYouTubeVideos(`${topic} documentary`, Math.floor(limit / 4)),
      fetchNewsArticles(topic, Math.floor(limit / 4)),
      fetchBooks(topic, Math.floor(limit / 4)),
      fetchTedTalks(Math.floor(limit / 4)),
    ]);

    const results = [
      ...(videos.status === "fulfilled" ? videos.value : []),
      ...(articles.status === "fulfilled" ? articles.value : []),
      ...(books.status === "fulfilled" ? books.value : []),
      ...(talks.status === "fulfilled" ? talks.value : []),
    ];

    return results.sort(() => Math.random() - 0.5).slice(0, limit);
  } catch (error) {
    console.error("Error fetching mixed content:", error);
    return [];
  }
};

export const getTrendingTopics = async () => {
  return [
    "Climate Change",
    "Social Justice",
    "Education",
    "Public Health",
    "Poverty Reduction",
    "Equality",
    "Conservation",
    "Sustainable Development",
  ];
};
