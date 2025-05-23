"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';

export default function AnimePage({ params }) {
  const anime = params.name;
  const [data, setData] = useState(null);

 useEffect(() => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  fetch(`${apiUrl}/anime/info/${anime}`)
    .then((res) => res.json())
    .then((data) => {
      // Check if episodesList is available and is an array
      const episodesList = Array.isArray(data.data.episodesList) ? data.data.episodesList : [];

      // Transform API data
      const transformedData = {
        id: data.data.id.toString(),
        title: data.data.title.userPreferred || data.data.title.english,
        image: data.data.coverImage.large,
        status: data.data.status,
        type: data.data.format,
        genres: data.data.genres,
        description: data.data.description,
        totalEpisodes: data.data.episodes,
        episodes: episodesList.map((ep) => ({
          id: ep.id.split('?')[0],  // Extract the part before the '?'
          number: ep.number,
          param: ep.episodeId,
        })),
      };
      setData(transformedData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}, [anime]);


  if (!data) {
    return null;
  }

  return (
    <div id="animeInfo">
      <div id="i1">
        <div id="image">
          <img width={250} height={350} alt={data.title} src={data.image} />
        </div>
        <div id="info">
          <h2>{data.title}</h2>
          <h2>
            {data.status} | {data.type} | {data.genres.join(", ")}
          </h2>
          <div id="descriptionContainer" style={{ maxHeight: "200px", overflowY: "auto" }}>
            <h2
              dangerouslySetInnerHTML={{
                __html: data.description || "No description available",
              }}
            ></h2>
          </div>
        </div>
      </div>
      <div id="episodes">
        <h2>Episodes ({data.totalEpisodes})</h2>
        <div className="episodelist-container">
          <div id="episodelist" className="scroll-x">
            {data.episodes.map((ep) => (
              <div className="episode-box" key={ep.id}>
                <Link href={`/watch/${anime}/${ep.id}/${ep.param}`} rel="noopener noreferrer">
                  <h2 className="episode-title">{ep.number}</h2>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
