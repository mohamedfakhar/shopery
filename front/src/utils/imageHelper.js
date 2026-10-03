export const DEFAULT_PRODUCT_IMAGE = "/images/products/img-01.png";
export const DEFAULT_AVATAR = "/images/user/img-01.png";

export const getImageUrl = (path, fallback = DEFAULT_PRODUCT_IMAGE) => {
  if (!path) return fallback;
  
  // If it's an old netlify link, translate it to local /images/
  if (typeof path === "string" && path.includes("shopery.netlify.app/main/src/images/")) {
    return path.replace(/https:\/\/shopery\.netlify\.app\/main\/src\/images\//, "/images/");
  }

  return path;
};

export const handleImageError = (fallback = DEFAULT_PRODUCT_IMAGE) => (e) => {
  if (e?.currentTarget && e.currentTarget.src !== fallback && !e.currentTarget.src.endsWith(fallback)) {
    e.currentTarget.src = fallback;
  }
};
