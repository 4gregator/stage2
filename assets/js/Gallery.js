class Gallery {
  constructor(titleClass, containerClass, photoClass, prevClass, nextClass, currentAlbum = 1) {
    // имя класса тайтла галлереи
    this.title = $('.' + titleClass);
    // имя класса контейнера для фото
    this.container = $('.' + containerClass);
    // имя класса фото
    this.photo = photoClass;
    // имя класса кнопки переключения к предыдущему альбому
    this.prev = $('.' + prevClass);
    // имя класса кнопки переключения к следующему альбому
    this.next = $('.' + nextClass);
    // url ресурса
    this.url = 'https://jsonplaceholder.typicode.com';
    // путь к альбомам
    this.pathToAlbum = '/albums';
    // путь к фото
    this.pathToPhoto = '/photos';
    // текущий альбом
    this.album = currentAlbum;
    // массив всех альбомов
    this.albums = [];
  }
  
  async getData(urlData) {
    let data;

    await fetch(this.url + urlData)
      .then(response => response.json())
      .then(json => {
        data = json;
      });
    
    return data;
  }

  async renderAlbum() {
    const album = await this.getData(this.pathToAlbum + '/' + this.album);
    const photos = await this.getData(this.pathToAlbum + '/' + this.album + this.pathToPhoto);
    
    this.renderTitle(album.title + ' (' + album.id + ')');

    photos.forEach(el => {
      this.renderPhoto(el.thumbnailUrl, el.url, el.title);
    });

    this.renderButtons();
  }

  renderTitle(text) {
    this.title.text(text);
  }

  renderPhoto(src, url, title) {
    let img = document.createElement('img');
    img = $(img);

    img.addClass(this.photo)
      .attr({
        'src'  : src,
        'alt'  : 'image',
        'title': title
      });
    
    img.on('click', function () {
      $.fancybox.open({
        src : url,
        type: 'image',
        opts: {
          smallBtn: true,
          animationEffect: 'zoom-in-out'
        }
      });
    });
    
    this.container.append(img);
  }

  renderButtons() {
    const prev = false;
    const next = true;
    const self = this;

    this.prev.on('click', function () {
      self.changeAlbum(prev);
    });

    this.next.on('click', function () {
      self.changeAlbum(next);
    });
  }
  
  checkAlbum() {
    return this.albums.includes(this.album);
  }

  // next = следующий true || fasle
  changeAlbum(next) {
    next ? this.album++ : this.album--;

    if (next && !this.checkAlbum()) {
      this.album = this.albums[0];
    } else if (!next && !this.checkAlbum()) {
      this.album = this.albums[this.albums.length - 1];
    }

    this.clear();
    this.renderAlbum();
  }

  clear() {
    this.container.html('');
    this.prev.off('click');
    this.next.off('click');
  }

  async initialize() {
    const albums = await this.getData(this.pathToAlbum);

    albums.forEach(el => {
      this.albums.push(el.id);
    });
    
    this.album = this.albums.includes(this.album) ? this.album : this.albums[0];

    this.renderAlbum();
  }
}