document.addEventListener('DOMContentLoaded', function () {
  const popupClose = document.querySelector('.popup__close');

  $('.album__container').niceScroll({
    horizrailenabled: false
  });

  popupClose.addEventListener('click', function () {
    closePopup('popup_visible');
  })

  const params = {
    titleClass: 'album__title',
    containerClass: 'album__container',
    photoClass: 'album__photo',
    prevClass: 'album__nav_prev',
    nextClass: 'album__nav_next',
    popupClass: 'popup',
    popupActiveClass: 'popup_visible',
    closeButton: popupClose
  };
  
  const photoGallery = new Gallery(params);
  photoGallery.initialize();
});

// activePopup = класс активного попап окна
function closePopup(activePopup) {
  const popup = document.querySelector('.' + activePopup);
  popup.classList.remove(activePopup);
}