class Gallery {
  constructor(params) {
    // имя класса тайтла галлереи
    this.title = document.querySelector('.' + params.titleClass);
    // имя класса контейнера для фото
    this.container = document.querySelector('.' + params.containerClass);
    // имя класса фото
    this.photo = params.photoClass;
    // имя класса кнопки переключения к предыдущему альбому
    this.prev = document.querySelector('.' + params.prevClass);
    // имя класса кнопки переключения к следующему альбому
    this.next = document.querySelector('.' + params.nextClass);
    // имя класса попап окна для полноразмерных фото
    this.popup = document.querySelector('.' + params.popupClass);
    // имя класса активного попап окна
    this.popupActive = params.popupActiveClass;
    // кнопка, закрывающая попап
    this.closeButton = params.closeButton;
    // url ресурса
    this.url = 'https://jsonplaceholder.typicode.com';
    // путь к альбомам
    this.pathToAlbum = '/albums';
    // путь к фото
    this.pathToPhoto = '/photos';
    // дефолтный альбом = 1
    // текущий альбом
    this.album = params.currentAlbum ? params.currentAlbum : 1;
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
  }

  renderTitle(text) {
    this.title.textContent = text;
  }

  renderPhoto(src, url, title) {
    const self = this;
    let img = this.createImage(src, this.photo, title);

    img.addEventListener('click', function () {
      self.showImage(url);
    })
    
    this.container.appendChild(img);
  }

  showImage(src) {
    let img = this.createImage(src, 'test');

    this.clearHtml(this.popup);
    this.popup.appendChild(this.closeButton);
    this.popup.appendChild(img);
    this.popup.classList.add(this.popupActive);
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
    return this.albums.includes(this.album);
  }

  // next = следующий true || fasle предыдущий
  changeAlbum(next) {
    next ? this.album++ : this.album--;

    if (next && !this.checkAlbum()) {
      this.album = this.albums[0];
    } else if (!next && !this.checkAlbum()) {
      this.album = this.albums[this.albums.length - 1];
    }

    this.clearHtml(this.container);
    this.renderAlbum();
  }

  initButtons() {
    const prev = false;
    const next = true;
    const self = this;

    this.prev.addEventListener('click', function () {
      self.changeAlbum(prev);
    })

    this.next.addEventListener('click', function () {
      self.changeAlbum(next);
    })
  }

  clearHtml(target) {
    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }
  }

  async initialize() {
    const albums = await this.getData(this.pathToAlbum);

    albums.forEach(el => {
      this.albums.push(el.id);
    });
    
    this.album = this.albums.includes(this.album) ? this.album : this.albums[0];

    this.renderAlbum();
    this.initButtons();
  }
}