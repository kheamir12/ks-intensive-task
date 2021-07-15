import loadData from "./loader";
import React from "react";
import Modal from "./Modal.js";
import "./App.css";
import blank from "./assets/blank.jpg";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      selectedPhoto: null,
    };

    this.handler = this.handler.bind(this);
  }

  albums = [];
  header = (<></>);
  grid = [];
  gridClass = "grid-albums";
  selectedPhoto = null;

  handler(photo) {
    this.selectedPhoto = null;
    this.setState({ selectedPhoto: photo });
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    this.albums = await loadData();
    this.showAlbums();
  }

  updateHeader(page, album = null) {
    let buttons = null;
    let label = "";
    let backButton = <></>;
    switch (page) {
      case "albums":
        label = "Альбомы";
        buttons = (
          <>
            <div className="button">Общие</div>
            {this.albums.findIndex((album) => !album.visible) > -1 ? (
              <div className="active-button" onClick={() => this.showAlbums(false)}>
                Скрытые
              </div>
            ) : (
              <></>
            )}
          </>
        );
        break;

      case "hidden albums":
        label = "Альбомы";
        buttons = (
          <>
            {this.albums.findIndex((album) => album.visible) > -1 ? (
              <div className="active-button" onClick={() => this.showAlbums(true)}>
                Общие
              </div>
            ) : (
              <></>
            )}
            <div className="button">Скрытые</div>
          </>
        );
        break;

      case "photos":
        label = album.name;

        backButton = (
          <div className="back-button" onClick={() => this.backToAlbums()}>
            <i className="left-arrow"></i>К альбомам
          </div>
        );

        buttons = (
          <>
            <div className="button">Общие</div>
            {album.images.findIndex((img) => !img.visible) > -1 ? (
              <div className="active-button" onClick={() => this.showPhotos(album, false)}>
                Скрытые
              </div>
            ) : (
              <></>
            )}
          </>
        );
        break;

      case "hidden photos":
        label = album.name;

        backButton = (
          <div className="back-button" onClick={() => this.backToAlbums()}>
            <i className="left-arrow"></i>К альбомам
          </div>
        );

        buttons = (
          <>
            {album.images.findIndex((img) => img.visible) > -1 ? (
              <div className="active-button" onClick={() => this.showPhotos(album, true)}>
                Общие
              </div>
            ) : (
              <></>
            )}
            <div className="button">Скрытые</div>
          </>
        );
        break;

      default:
        label = "Ошибка";
        buttons = <div>Неверный тип страницы</div>;
    }

    this.header = (
      <div className="header">
        {backButton}
        <div className="label">{label}</div>
        <div className="header-buttons">{buttons}</div>
      </div>
    );
  }

  showAlbums(visible = true) {
    let selectedAlbums = [];
    let hideButtonText = "Скрыть";
    if (visible === true) {
      this.updateHeader("albums");
      selectedAlbums = this.albums.filter((album) => album.visible);
    } else {
      this.updateHeader("hidden albums");
      selectedAlbums = this.albums.filter((album) => !album.visible);
      hideButtonText = "В общие";
    }

    this.grid = selectedAlbums.map((album, index) => (
      <div className="cell" key={album.id}>
        <img src={album.thumb} alt="" onClick={() => this.toPhotos(album)}></img>
        <div className="album-photos-quantity">{album.images.length + " фото"}</div>
        <div className="hide-button" onClick={() => this.hideAlbum(album, visible)}>
          {hideButtonText}
        </div>
        <div className="album-name" onClick={() => this.toPhotos(album)}>
          {album.name}
        </div>
      </div>
    ));

    this.gridClass = "grid albums";
    this.setState({ grid: [...this.grid] });
  }

  showPhotos(album, visible = true) {
    let selectedPhotos = [];
    let hideButtonText = "Скрыть";
    if (visible === true) {
      this.updateHeader("photos", album);
      selectedPhotos = album.images.filter((img) => img.visible);
    } else {
      this.updateHeader("hidden photos", album);
      selectedPhotos = album.images.filter((img) => !img.visible);
      hideButtonText = "В общие";
    }

    this.grid = selectedPhotos.map((photo, index) => (
      <div className="cell" key={photo.id}>
        <img src={photo.thumb} alt="" onClick={() => this.selectPhoto(photo)}></img>
        <div className="hide-button" onClick={() => this.hidePhoto(album, photo, visible)}>
          {hideButtonText}
        </div>
        <div className="photo-name">{photo.name}</div>
      </div>
    ));

    this.gridClass = "grid photos";
    this.setState({ grid: [...this.grid] });
  }

  hideAlbum(album, visible) {
    album.visible = !visible;
    if (this.albums.findIndex((album) => album.visible === visible) > -1) this.showAlbums(visible);
    else this.showAlbums(!visible);
  }

  hidePhoto(album, photo, visible) {
    photo.visible = !visible;
    let newThumb = blank;
    for (let i = album.images.length - 1; i >= 0; --i) {
      if (album.images[i].visible) {
        newThumb = album.images[i].img;
        break;
      }
    }
    album.thumb = newThumb;

    this.toPhotos(album, visible);
  }

  toPhotos(album, visible = true) {
    if (album.images.findIndex((img) => img.visible === visible) > -1) this.showPhotos(album, visible);
    else this.showPhotos(album, !visible);
  }

  backToAlbums() {
    if (this.albums.findIndex((album) => album.visible) > -1) this.showAlbums(true);
    else this.showAlbums(false);
  }

  selectPhoto(photo) {
    this.selectedPhoto = photo;
    this.setState({ selectedPhoto: photo });
  }

  render() {
    return (
      <div className="App">
        {this.header}
        <div className={this.gridClass}>{this.grid}</div>
        <Modal handler={this.handler} photo={this.selectedPhoto} />
      </div>
    );
  }
}

export default App;
