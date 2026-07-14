import Image from "next/image";
import type { AlbumInfo } from "@/lib/types";

interface AlbumCoverProps {
  album: AlbumInfo;
}

export default function AlbumCover({ album }: AlbumCoverProps) {
  return (
    <div className="relative aspect-square w-full overflow-hidden md:aspect-auto md:h-full">
      <Image
        src="/cover.jpg"
        alt={`${album.title} — album cover artwork`}
        fill
        priority
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
      {/* Wood-grain vignette so UI chrome elsewhere on the page relates
          back to the cover's own lighting */}
      <div className="absolute inset-0 bg-wood-grain" />
    </div>
  );
}
