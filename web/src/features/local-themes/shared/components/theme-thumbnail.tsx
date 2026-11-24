import Image from "next/image";
import { cn } from "@/lib/utils";

interface ThemeThumbnailProps {
  no: string;
  field: string;
  thumbnailUrl: string | null;
  /** 小さく出すとき。番号だけを大きく出し、分野名は省く */
  compact?: boolean;
  className?: string;
}

/**
 * テーマの右側に置く四角い画像。
 *
 * 写真（thumbnail_url）があれば写真を出し、無ければテーマ番号と分野名で
 * タイトル画像を描く。写真ファイルを用意しなくても見た目がそろうようにしている。
 */
export function ThemeThumbnail({
  no,
  field,
  thumbnailUrl,
  compact = false,
  className,
}: ThemeThumbnailProps) {
  if (thumbnailUrl) {
    return (
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-xl",
          className
        )}
      >
        <Image
          src={thumbnailUrl}
          alt=""
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex aspect-square flex-col overflow-hidden rounded-xl bg-mirai-gradient",
        compact ? "items-center justify-center" : "justify-between p-2.5",
        className
      )}
    >
      <span className="text-[28px] font-bold leading-none text-white">
        {no}
      </span>
      {!compact && (
        <span className="text-[11px] font-bold leading-[1.35] text-mirai-text">
          {field}
        </span>
      )}
    </div>
  );
}
