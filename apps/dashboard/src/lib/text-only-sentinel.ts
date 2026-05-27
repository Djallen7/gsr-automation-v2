// Sentinel value written into graphics.current_image_url for text-only
// imports. The column is NOT NULL today; rows with this value should render
// "no image" placeholders in the UI.
export const TEXT_ONLY_IMAGE_SENTINEL = '__text_only__'

export function isTextOnly(imageUrl: string | null | undefined): boolean {
  return imageUrl === TEXT_ONLY_IMAGE_SENTINEL
}
