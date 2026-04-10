import { getCurrentProfile } from "@/lib/auth";
import { GalleryClientPage } from "@/features/gallery/components/gallery-client-page";
import { getGalleryData } from "@/lib/services/gallery";

export default async function GalleryPage() {
  const [liveData, profile] = await Promise.all([getGalleryData(), getCurrentProfile()]);

  return (
    <GalleryClientPage
      initialGallery={liveData.appGallery}
      initialAlbums={liveData.albums}
      currentUserId={profile?.id}
    />
  );
}
