"use client";

import { motion } from "motion/react";
import { CalendarClock, MessagesSquare, MapPin } from "lucide-react";
import { EXT, ORG } from "@/lib/links";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { PrayerScreen, IqamaCards } from "@/components/prayer/prayer-modules";

export function PrayerTimesLive() {
  return (
    <div className="px-5 pb-24 pt-14 md:pt-20">
      <div className="mx-auto max-w-5xl">
        <PrayerScreen tall />

        <div className="mt-16">
          <SectionIntro
            eyebrow="Today at the masjid"
            title="Iqama, at a glance"
            lede="Please arrive before iqama. Timing changes are announced in the community WhatsApp group."
          />
          <div className="mt-10">
            <IqamaCards />
          </div>
        </div>

        <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
          <StaggerItem>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-white/60 p-6">
              <CalendarClock className="h-5 w-5 text-forest" aria-hidden />
              <p className="mt-4 font-medium text-ink">Jumu&apos;ah</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                1st Khutbah {ORG.jumua.first}
                <br />
                2nd Khutbah {ORG.jumua.second}
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <a
              href={EXT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-line bg-white/60 p-6 transition-colors hover:border-forest/30 hover:bg-white"
            >
              <MessagesSquare className="h-5 w-5 text-forest" aria-hidden />
              <p className="mt-4 font-medium text-ink">Iqama change alerts</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                Join the community WhatsApp group for timing updates, janazah announcements and events.
              </p>
            </a>
          </StaggerItem>
          <StaggerItem>
            <a
              href={ORG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-line bg-white/60 p-6 transition-colors hover:border-forest/30 hover:bg-white"
            >
              <MapPin className="h-5 w-5 text-forest" aria-hidden />
              <p className="mt-4 font-medium text-ink">Visit</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                {ORG.address}. Please don&apos;t park overnight without authorization.
              </p>
            </a>
          </StaggerItem>
        </Stagger>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-2xl bg-forest/[0.06] p-8 md:p-10"
        >
          <p lang="ar" dir="rtl" className="font-arabic text-xl leading-loose text-brass">
            الصلاة مفتاح الجنة
          </p>
          <p className="mt-4 font-display text-xl leading-relaxed tracking-tight text-ink md:text-2xl">
            &ldquo;Salat is the key to Paradise. Whoever performs wudu and does it well, then walks to the
            obligatory prayer and offers it with the congregation, or in the masjid — Allah will forgive his sins.&rdquo;
          </p>
          <p className="mt-3 text-sm text-ink/55">Sahih Muslim, Vol 1, No. 549</p>
        </motion.div>
      </div>
    </div>
  );
}
