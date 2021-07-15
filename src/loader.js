import { Album, Photo } from "./classes";

export default async function loadData() {
  let albums = await fetch("https://jsonplaceholder.typicode.com/photos")
    .then((res) => res.json())
    .then((photosData) =>
      fetch("https://jsonplaceholder.typicode.com/albums")
        .then((res) => res.json())
        .then((albumsData) => {
          let albums = [];
          for (let i = 0; i < albumsData.length; ++i) {
            let album = albumsData[i];

            let start = photosData.findIndex(
              (elem) => elem.albumId === album.id
            );

            if (start === -1) continue;

            let end = photosData.findIndex(
              (elem) => elem.albumId === album.id + 1
            );

            if (end === -1) end = photosData.length;

            let photos = [];
            for (let j = start; j < end; ++j) {
              let photo = photosData[j];
              photos.push(
                new Photo(photo.id, photo.title, photo.url, photo.thumbnailUrl)
              );
            }

            albums.push(new Album(album.id, album.title, photos.slice()));
          }
          return albums;
        })
    );
  return albums;
}
