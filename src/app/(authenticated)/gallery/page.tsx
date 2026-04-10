import { GalleryClientPage } from "@/features/gallery/components/gallery-client-page";
import { getGalleryData } from "@/lib/services/gallery";

export default async function GalleryPage() {
  const liveData = await getGalleryData();

  return (
    <GalleryClientPage
      initialGallery={liveData.appGallery}
      initialAlbums={liveData.albums}
    />
  );
}
