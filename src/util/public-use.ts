export default function getAssetsFile(url: string) {
  return new URL(`/src/assets/${url}`, import.meta.url).href;
}
