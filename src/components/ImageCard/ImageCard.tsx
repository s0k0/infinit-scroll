import React from "react";
import "./ImageCard.scss";

export interface ImageCardProps {
  title: string;
  id: string;
  farm: number;
  secret: string;
  server: string;
  favourites: string[];
  onClick: (id: string) => void;
}

const ImageCard = ({
  title,
  id,
  farm,
  secret,
  server,
  favourites,
  onClick,
}: ImageCardProps) => {
  const isFavourite = favourites.indexOf(id) > -1;

  const url = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
  return (
    <div className="image-card">
      <img className={isFavourite ? "active thumbnail" : "thumbnail"} key={id} src={url} alt={title} />
      <div className="overlay">
        <button className="favourite" onClick={() => onClick(id)}>
            <div className={isFavourite ? "active" : "inactive"} id="heart" />
        </button>
        <div className="title">{title}</div>
        </div>
    </div>
  );
};

export { ImageCard };
