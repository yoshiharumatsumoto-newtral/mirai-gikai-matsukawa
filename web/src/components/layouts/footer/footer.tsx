"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { MUNICIPALITY, SITE_NAME } from "@/config/local-site";
import { isInterviewPage } from "@/lib/page-layout-utils";
import { routes } from "@/lib/routes";
import {
  MODIFIED_AT,
  OPERATOR_NAME,
  policyLinks,
  primaryLinks,
} from "./footer.config";

export function Footer() {
  const pathname = usePathname();

  if (isInterviewPage(pathname)) {
    return null;
  }

  return (
    <footer className="bg-mirai-light-gradient text-slate-900">
      <div className="mx-auto flex w-full max-w-[500px] flex-col items-center px-6 py-14 pb-20 text-center">
        <FooterLogoSection />
        <FooterPrimaryLinks />
        <FooterPolicies />
        <FooterCredits />
        <FooterCopyright />
      </div>
    </footer>
  );
}

function FooterLogoSection() {
  return (
    <div className="flex flex-col items-center text-center mb-9">
      <Link href={routes.home()} aria-label={`${SITE_NAME} トップページ`}>
        <Image
          src="/img/logo.svg"
          alt={SITE_NAME}
          width={150}
          height={128}
          className="h-auto"
        />
      </Link>
    </div>
  );
}

function FooterPrimaryLinks() {
  return (
    <nav aria-label="主要リンク" className="w-full mb-5">
      <ul
        className="
      flex flex-col items-center gap-3 text-[14px] font-semibold text-slate-800
      md:flex-row md:justify-center md:gap-5
      "
      >
        {primaryLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href as Route}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="transition-colors hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterPolicies() {
  return (
    <div className="flex flex-col items-center text-[12px] font-semibold text-slate-800 mb-5">
      <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1">
        {policyLinks.map((policy, index) => (
          <li key={policy.label} className="flex items-center gap-2">
            <Link
              href={policy.href as Route}
              target={policy.external ? "_blank" : undefined}
              rel={policy.external ? "noreferrer" : undefined}
              className="transition-colors hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {policy.label}
            </Link>
            {index < policyLinks.length - 1 ? <span>｜</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 元にしたチームみらいの「みらい議会」への感謝と、Fork ガイドラインで必要な表示
 * （免責文言・本家と元のソースコードへのリンク・この版のソースコードへのリンク・改変の明示）をまとめる。
 */
function FooterCredits() {
  return (
    <section
      aria-label="このサイトについて"
      className="w-full mb-8 rounded-2xl bg-white/70 px-5 py-6 text-left text-[13px] leading-[1.8] text-slate-800"
    >
      <h2 className="mb-3 text-center text-[14px] font-bold">
        チームみらいの皆さんへ、ありがとう
      </h2>
      <p className="mb-3">
        このサイトは、チームみらいがオープンソースとして公開している「みらい議会」の仕組みを使わせていただき、
        {OPERATOR_NAME}が{MUNICIPALITY.name}向けに改変（{MODIFIED_AT}
        ）して運営しています。
        誰もが使えるかたちで公開してくださったことに、心から感謝します。
      </p>
      <p className="mb-4 font-bold">
        これは政党チームみらいが運営しているものではありません
      </p>
      <ul className="flex flex-col gap-1.5 font-semibold">
        <li>
          <CreditLink href={EXTERNAL_LINKS.ORIGINAL_SERVICE}>
            本家「みらい議会」（チームみらい）
          </CreditLink>
        </li>
        <li>
          <CreditLink href={EXTERNAL_LINKS.ORIGINAL_REPO}>
            元のソースコード（AGPL-3.0）
          </CreditLink>
        </li>
        <li>
          {EXTERNAL_LINKS.GITHUB_REPO ? (
            <CreditLink href={EXTERNAL_LINKS.GITHUB_REPO}>
              このサイトのソースコード
            </CreditLink>
          ) : (
            <span>このサイトのソースコード（公開準備中）</span>
          )}
        </li>
      </ul>
    </section>
  );
}

function CreditLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary-accent underline underline-offset-2 transition-opacity hover:opacity-70"
    >
      {children}
    </a>
  );
}

function FooterCopyright() {
  return (
    <div className="flex flex-col gap-1 text-center text-sm font-medium text-slate-800">
      <span>© 2026 {OPERATOR_NAME}</span>
      <span className="text-[12px]">Original work © 2025 Team Mirai</span>
    </div>
  );
}
