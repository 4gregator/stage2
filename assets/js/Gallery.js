class Gallery {
  constructor(titleClass, containerClass, photoClass, prevClass, nextClass, popupClass, popupActiveClass, closeButton, currentAlbum = 1) {
    // имя класса тайтла галлереи
    this.title = document.querySelector('.' + titleClass);
    // имя класса контейнера для фото
    this.container = document.querySelector('.' + containerClass);
    // имя класса фото
    this.photo = photoClass;
    // имя класса кнопки переключения к предыдущему альбому
    this.prev = document.querySelector('.' + prevClass);
    // имя класса кнопки переключения к следующему альбому
    this.next = document.querySelector('.' + nextClass);
    // имя класса попап окна для полноразмерных фото
    this.popup = document.querySelector('.' + popupClass);
    // имя класса активного попап окна
    this.popupActive = popupActiveClass;
    // кнопка, закрывающая попап
    this.closeButton = closeButton;
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
  }

  renderTitle(text) {
    this.title.textContent = text;
  }

  renderPhoto(src, url, title) {
    const self = this;
    let img = this.createImage(src, this.photo, title);
    console.log(img);

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
    
    img.src = src;
    img.alt = 'image';
    if (title) img.setAttribute('title', title);
    img.setAttribute('class', className);

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