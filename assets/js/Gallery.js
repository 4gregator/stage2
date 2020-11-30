class Gallery {
  constructor(params) {
    // дефолтные значения
    const byDefault = {
      // объект тайтла галлереи
      title: document.querySelector('.album__title'),
      // объект контейнера для фото
      container: document.querySelector('.album__container'),
      // имя класса фото
      photoClass: 'album__photo',
      // объект кнопки переключения к предыдущему альбому
      prev: document.querySelector('.album__nav_prev'),
      // объект кнопки переключения к следующему альбому
      next: document.querySelector('.album__nav_next'),
      // объект попап окна для полноразмерных фото
      popup: document.querySelector('.popup'),
      // имя класса активного попап окна
      popupActiveClass: 'popup_visible',
      // кнопка, закрывающая попап
      closeButton: document.querySelector('.popup__close'),
      // url ресурса
      url: 'https://jsonplaceholder.typicode.com',
      // путь к альбомам
      pathToAlbum: '/albums',
      // путь к фото
      pathToPhoto: '/photos',
      // текущий альбом
      album: 1
    };

    this.params = Object.assign(byDefault, params);

    // массив всех альбомов
    this.albums = [];

    this.initialize();
  }
  
  async getData(urlData) {
    let data;

    await fetch(this.params.url + urlData)
      .then(response => response.json())
      .then(json => {
        data = json;
      });
    
    return data;
  }

  async renderAlbum() {
    const album = await this.getData(this.params.pathToAlbum + '/' + this.params.album);
    const photos = await this.getData(this.params.pathToAlbum + '/' + this.params.album + this.params.pathToPhoto);
    
    this.renderTitle(album.title + ' (' + album.id + ')');

    photos.forEach(el => {
      this.renderPhoto(el.thumbnailUrl, el.url, el.title);
    });
  }

  renderTitle(text) {
    this.params.title.textContent = text;
  }

  renderPhoto(src, url, title) {
    const self = this;
    let img = this.createImage(src, this.params.photoClass, title);

    img.addEventListener('click', function () {
      self.showImage(url);
    })
    
    this.params.container.appendChild(img);
  }

  showImage(src) {
    let img = this.createImage(src, 'test');

    this.clearHtml(this.params.popup);
    this.params.popup.appendChild(this.params.closeButton);
    this.params.popup.appendChild(img);
    this.params.popup.classList.add(this.params.popupActiveClass);
  }

  createImage(src, className, title) {
    let img = document.createElement('img');

    img.classList.add(className);
    img.src = src;
    img.alt = 'image';
    if (title) img.setAttribute('title', title);

    return img;
  }
  
  checkAlbum() {
    return this.albums.includes(this.params.album);
  }

  // next = следующий true || fasle предыдущий
  changeAlbum(next) {
    next ? this.params.album++ : this.params.album--;

    if (next && !this.checkAlbum()) {
      this.params.album = this.albums[0];
    } else if (!next && !this.checkAlbum()) {
      this.params.album = this.albums[this.albums.length - 1];
    }

    this.clearHtml(this.params.container);
    this.renderAlbum();
  }

  initButtons() {
    const prev = false;
    const next = true;
    const self = this;

    this.params.prev.addEventListener('click', function () {
      self.changeAlbum(prev);
    })

    this.params.next.addEventListener('click', function () {
      self.changeAlbum(next);
    })
  }

  clearHtml(target) {
    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }
  }

  async initialize() {
    const albums = await this.getData(this.params.pathToAlbum);

    albums.forEach(el => {
      this.albums.push(el.id);
    });
    
    this.params.album = this.albums.includes(this.params.album) ? this.params.album : this.albums[0];

    this.renderAlbum();
    this.initButtons();
  }
}