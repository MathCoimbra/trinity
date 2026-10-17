import Image from "next/image";
import { FacebookIcon, InstagramIcon, PinIcon, TikTokIcon } from "@/components/ui/icons";
import { TrinityLogo } from "@/components/ui/TrinityLogo";
import type { StoreInfo } from "@/lib/catalog/types";
import { formatBRL } from "@/lib/money";

const COVER_IMAGE =
  "https://assets.olaclick.app/companies/backgrounds/a42865d0-e76b-46cc-9661-eba09960c922.webp";

export function StoreHeader({ store }: { store: StoreInfo }) {
  const socialLinks = [
    { href: store.socials.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: store.socials.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: store.socials.facebook, label: "Facebook", Icon: FacebookIcon },
  ];

  const serviceChips = [
    store.services.delivery.enabled && "Delivery",
    store.services.pickup.enabled && "Retirada",
    store.services.dineIn.enabled && "No local",
  ].filter(Boolean);

  return (
    <header className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0">
        <Image src={COVER_IMAGE} alt="" fill preload sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-linear-to-b from-bg/40 via-bg/80 to-bg" />
        <div className="absolute inset-x-0 top-[38%] h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-6 pt-10 md:flex-row md:items-end md:justify-between md:px-8 md:pt-16">
        <div className="flex items-end gap-4">
          <div className="grid size-24 shrink-0 place-items-center rounded-2xl border border-line-strong bg-[#232327] p-3 shadow-2xl shadow-black/60 md:size-28">
            <TrinityLogo className="w-full text-[0.62rem]" />
          </div>
          <div className="min-w-0 pb-1">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-accent">Tabacaria · Headshop</p>
            <h1 className="font-display text-5xl leading-[0.9] tracking-wide md:text-7xl">
              Trinity <span className="text-transparent [-webkit-text-stroke:1px_var(--fg)]">Hookah</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <a
            href={store.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-2 text-xs leading-relaxed text-muted transition hover:text-fg md:text-right"
          >
            <PinIcon className="mt-0.5 shrink-0 text-sm text-accent" />
            {store.address}
          </a>
          <div className="flex flex-wrap items-center gap-2">
            {serviceChips.map((chip) => (
              <span
                key={chip as string}
                className="rounded-full border border-line-strong px-3 py-1 text-[0.7rem] uppercase tracking-wider text-fg/80"
              >
                {chip}
              </span>
            ))}
            <span className="text-[0.7rem] text-muted">
              Entrega {formatBRL(store.services.delivery.feeCents)} · mín. {formatBRL(store.services.delivery.minimumOrderCents)}
            </span>
          </div>
          <div className="flex gap-1">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-line text-lg text-fg/80 transition hover:border-accent hover:text-accent"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
