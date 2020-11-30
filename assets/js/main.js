document.addEventListener('DOMContentLoaded', function () {
  const popupClose = document.querySelector('.popup__close');

  $('.album__container').niceScroll({
    horizrailenabled: false
  });

  popupClose.addEventListener('click', function () {
    closePopup('popup_visible');
  })
  
  const photoGallery = new Gallery();
});

// activePopup = класс активного попап окна
function closePopup(activePopup) {
  const popup = document.querySelector('.' + activePopup);
  popup.classList.remove(activePopup);
}