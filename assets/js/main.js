$(function () {
  const photoGallery = new Gallery('album__title', 'album__container', 'album__photo', 'album__nav_prev', 'album__nav_next');

  $('.album__container').niceScroll({
    horizrailenabled: false
  });

  $('.album__photo').on('click', function () {
    console.log(true);
    const self = $(this);
    console.log(self);
    self.fancybox({
      href : self.data('url'),
      title: self.attr('title')
    });
  });

  photoGallery.initialize();
});