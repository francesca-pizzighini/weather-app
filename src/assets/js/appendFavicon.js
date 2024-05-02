function appendFavicon(img) {
  const faviconImage = document.createElement("link");
  faviconImage.rel = "icon";
  faviconImage.type = "image/x-icon";
  faviconImage.href = img;
  return faviconImage;
}

export default appendFavicon;
