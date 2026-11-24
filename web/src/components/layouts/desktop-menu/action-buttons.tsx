import { LinkButton } from "@/components/top/link-button";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { SHOW_NATIONAL_DIET_FEATURES } from "@/config/local-site";

/**
 * デスクトップメニュー: アクションボタン（サイドバー内）
 */
export function DesktopMenuActionButtons() {
  // 本家の「みらい議会とは」（チームみらいの note）と寄附への導線。町村版では出さない
  if (!SHOW_NATIONAL_DIET_FEATURES) return null;

  return (
    <div className="flex flex-col gap-3">
      <LinkButton
        href={EXTERNAL_LINKS.ABOUT_NOTE}
        icon={{
          src: "/icons/note-icon.png",
          alt: "note",
          width: 20,
          height: 20,
        }}
      >
        みらい議会とは
      </LinkButton>

      <LinkButton
        href={EXTERNAL_LINKS.DONATION}
        icon={{
          src: "/icons/heart-icon.svg",
          alt: "寄附",
          width: 20,
          height: 20,
        }}
      >
        寄附で応援する
      </LinkButton>
    </div>
  );
}
