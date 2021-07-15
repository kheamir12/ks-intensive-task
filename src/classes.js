export class Album {
  constructor(id, name, images) {
    this.id = id;
    this.name = name;
    this.thumb = images[images.length - 1].img;
    this.images = images;
    this.visible = true;
  }
}

export class Photo {
  constructor(id, name, img, thumb) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.thumb = thumb;
    this.visible = true;
  }
}
