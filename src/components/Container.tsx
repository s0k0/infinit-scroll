import * as config from "../config.json";
import React, { useState, useEffect, useRef, useCallback } from "react";
import logo from "../assets/Flickr_logo.png";
import "./Container.scss";
import { ImageCard } from "./ImageCard/ImageCard";
import { getFavourites, saveFavourites } from "./helpers";

export interface ImageProps {
  id: string;
  farm: number;
  secret: string;
  title: string;
  server: string;
  ownername: string;
}

function Container() {
  const query = "Gustav Klimt";
  const [images, setImages] = useState<ImageProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);

  const getImages = useCallback(() => {
    setLoading(true);
    fetch(
      `https://api.flickr.com/services/rest/?method=flickr.photos.search&text=${query}&media=photos&api_key=${config.apiKey}&per_page=${config.pageSize}&page=${page}&extras=owner_name&format=json&nojsoncallback=true`
    )
      .then((response) => response.json())
      .then((data) => {
        setImages(images.concat(data.photos.photo));
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }, [page]);

  const observer = useRef<IntersectionObserver>();
  const lastImageElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < config.pageLimit) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, page]
  );

  const handleClick = (id: string) => {
    const updateFavourites =
      favourites.indexOf(id) > -1
        ? favourites.filter((fav) => fav !== id)
        : [...favourites, id];
    saveFavourites(updateFavourites);
    setFavourites(updateFavourites);
  };

  useEffect(() => {
    getImages();
    const updateFavourites = getFavourites();
    setFavourites(updateFavourites);
  }, [getImages]);

  return (
    <div className="container">
      <div className="headline">
        <img className="logo" src={logo} alt="flickr-logo" />
        <h1> {query}</h1>
      </div>
      <div className="image-list">
        {loading && images.length === 0 ? (
          <h3> Loading ... </h3>
        ) : (
          images.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              ref={index + 1 === images.length ? lastImageElementRef : null}
            >
              <ImageCard
                title={image.title}
                id={image.id}
                farm={image.farm}
                secret={image.secret}
                server={image.server}
                owner={image.ownername}
                favourites={favourites}
                onClick={() => handleClick(image.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export { Container };
