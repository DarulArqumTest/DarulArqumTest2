"use client";

/**
 * Self-hosted replica of the original "The Newsletter - Dec. 2020" edition,
 * which used to live at shoutout.wix.com/so/71NOH4zSW. That Wix page is being
 * retired, so the full content (text, photos, PDFs) has been pulled down and
 * is served from this site instead — no Wix dependency, no Wix branding.
 */

import * as React from "react";
import Link from "next/link";
import { ORG, EXT, R } from "@/lib/links";

const A = "/assets/newsletter-archive";

const dotGrid: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(246,243,234,0.05) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 11.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#c9a227",
  fontWeight: 700,
  marginBottom: 10,
};

const headingStyle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond',serif",
  fontWeight: 600,
  fontSize: "clamp(24px,3.2vw,30px)",
  color: "#f6f3ea",
  margin: "0 0 16px 0",
};

const bodyStyle: React.CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.75,
  color: "rgba(246,243,234,0.78)",
  margin: "0 0 14px 0",
};

const sectionStyle: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(201,162,39,0.22)",
  background: "rgba(246,243,234,0.035)",
  padding: "30px 28px",
  marginBottom: 24,
};

const imgStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(246,243,234,0.15)",
  marginBottom: 16,
  display: "block",
};

const pdfLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  marginTop: 4,
  padding: "10px 20px",
  borderRadius: 999,
  background: "rgba(201,162,39,0.16)",
  border: "1px solid rgba(201,162,39,0.4)",
  color: "#e3c56a",
  fontSize: 13.5,
  fontWeight: 600,
  textDecoration: "none",
};

function Divider() {
  return <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.35), transparent)", margin: "8px 0 32px" }} />;
}

export function NewsletterArchivePage() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      <div className="da-drift-gold pointer-events-none fixed z-0 rounded-full blur-[8px]" style={{ width: 460, height: 460, top: "-12%", right: "-10%", background: "radial-gradient(circle, rgba(201,162,39,0.16), transparent 70%)" }} aria-hidden />
      <div className="da-drift-green pointer-events-none fixed z-0 rounded-full blur-[8px]" style={{ width: 400, height: 400, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(60,140,100,0.14), transparent 72%)" }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50" style={dotGrid} aria-hidden />

      {/* HERO */}
      <div style={{ position: "relative", width: "100%", padding: "56px 24px 40px", overflow: "hidden", background: "linear-gradient(180deg, #16302280, #0e2419)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 100% at 50% 0%, rgba(201,162,39,0.16), transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(246,243,234,0.75)", fontWeight: 500, marginBottom: 26 }}>
            ← Back to Darul Arqum
          </Link>
          <div style={eyebrowStyle}>Newsletter archive · First release</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(34px,5.5vw,50px)", lineHeight: 1.1, color: "#f6f3ea", margin: "0 0 10px 0" }}>
            The Newsletter
          </h1>
          <p style={{ fontSize: 14.5, color: "rgba(246,243,234,0.65)", margin: 0 }}>December 2020 / Rabi-at-thani 1442 AH</p>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto", padding: "36px 24px 72px" }}>
        {/* THE REMINDER */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>The Reminder</div>
          <h2 style={headingStyle}>Al-Fatiha</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/al-fatiha.jpg`} alt="Al-Fatiha, the opening chapter of the Qur'an, in Arabic calligraphy" style={imgStyle} />
          <p dir="rtl" lang="ar" style={{ ...bodyStyle, textAlign: "center", fontStyle: "italic" }}>
            With the name of Allah, the All-Merciful, the very Merciful. Praise belong to Allah the Lord of all worlds. the All-Merciful the very
            Merciful. the Master of the day of Requital. You alone do we worship and, and from You alone do we seek help. Take us on the straight
            path. the path of those on whom You have bestowed Your Grace, not of those who have incurred Your wrath, nor of those who have gone
            astray.
          </p>
          <p style={{ ...bodyStyle, fontSize: 12.5, color: "rgba(246,243,234,0.5)" }}>(Translation by Mufti Taqi Uthmani)</p>

          <Divider />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/forty-hadith.jpg`} alt="Forty Hadith of Imam al-Nawawi, book cover" style={{ ...imgStyle, maxWidth: 260, margin: "0 auto 16px" }} />
          <p style={bodyStyle}>
            Imam al-Nawawi&apos;s 40 Ahadith have come to be known as one of the most comprehensive, important and holistic, compilation/collection of
            hadith of the Prophet Muhammad (saw) that convey the essence of Islam we have today. For our reminder we will include one hadith every
            newsletter from this collection.
          </p>
          <a href={`${A}/hadith-1.pdf`} target="_blank" rel="noopener noreferrer" style={pdfLinkStyle}>
            Hadith-1 · Heirs Of The Prophets →
          </a>
        </section>

        {/* SHEIKH MESSAGE */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>A message from Sheikh Saood Hasan, DarulArqum Ottawa</div>
          <h2 style={headingStyle}>The Excellence of the Remembrance of Allah</h2>
          <p style={bodyStyle}>Allah, the Exalted, says in the glorious Qur&apos;an:</p>
          <p style={{ ...bodyStyle, fontStyle: "italic", color: "#e3c56a" }}>
            &quot;Who have believed, and whose hearts find solace in the remembrance of Allah, Verily, in the remembrance of Allah do hearts find
            solace.&quot; (13:28)
          </p>
          <p style={{ ...bodyStyle, fontStyle: "italic", color: "#e3c56a" }}>&quot;And the remembering of Allah is greater indeed.&quot; (29:45)</p>
          <p style={{ ...bodyStyle, fontStyle: "italic", color: "#e3c56a" }}>&quot;Therefore remember Me. I will remember you.&quot; (2:152)</p>
          <p style={{ ...bodyStyle, fontStyle: "italic", color: "#e3c56a" }}>
            &quot;And remember your Lord by your tongue and within yourself, humbly and with fear and without loudness in words, in the mornings and in
            the afternoons, and be not of those who are neglectful.&quot; (7:205)
          </p>
          <p style={{ ...bodyStyle, fontStyle: "italic", color: "#e3c56a" }}>&quot;And remember Allah much, that you may be successful.&quot; (62:10)</p>
          <p style={{ ...bodyStyle, fontStyle: "italic", color: "#e3c56a" }}>
            &quot;Verily, the Muslim men and women... (up to)... and the men and the women who remember Allah much, Allah has prepared for them
            forgiveness and a great reward.&quot; (33:35)
          </p>
          <p style={{ ...bodyStyle, fontStyle: "italic", color: "#e3c56a" }}>
            &quot;O you who believe! Remember Allah with much remembrance. And glorify His praises morning and afternoon.&quot; (33:41,42)
          </p>
        </section>

        {/* THE STORY */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>Darul Arqum · The story</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/story.jpg`} alt="The Darul Arqum property sign on Limebank Road" style={imgStyle} />
          <p style={bodyStyle}>
            DarulArqum is a non-profit charitable organization, based in Gloucester South, aiming to seek pleasure of Allah Subhanahu wa Ta&apos;Ala
            serving the needs of muslim community in Ottawa and Canada at large. Our first project is to establish a Masjid/ islamic place of
            worship and reformation in Gloucester South, close vicinity of Riverside South, Findlay Creek, and small towns in further south, with
            an islamic institution of learning and a center for community services. We encourage you to sign-up the DarulArqum membership and join
            in this service.
          </p>
          <a href={`${A}/full-story.pdf`} target="_blank" rel="noopener noreferrer" style={pdfLinkStyle}>
            Read Full Story →
          </a>
        </section>

        {/* THE COUNCILOR */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>The Councilor</div>
          <h2 style={headingStyle}>Ms. Meehan, Carol Anne</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/councillor.jpg`} alt="Carol Anne Meehan, City Councillor for Gloucester South-Nepean" style={{ ...imgStyle, maxWidth: 220, margin: "0 auto 16px" }} />
          <p style={{ ...bodyStyle, fontStyle: "italic" }}>
            Congratulations on acquiring a beautiful property on Limebank Road. It just so happens I was driving by last week and saw your new sign
            being erected on the property.
          </p>
          <p style={{ ...bodyStyle, fontStyle: "italic" }}>
            I was pleased that your community decided to do whatever necessary to establish a place of worship. For those who may not know it was
            me who suggested it. I realize you are facing challenges, and there is much work to do with the city, but I have no doubt your
            community is up to the task. If you require assistance please don&apos;t hesitate to contact me. Again, welcome. All the best in the new
            year!
          </p>
          <p style={{ ...bodyStyle, marginBottom: 0, fontWeight: 600, color: "#f6f3ea" }}>Carol Anne Meehan</p>
          <p style={{ ...bodyStyle, fontSize: 13, color: "rgba(246,243,234,0.55)" }}>Councillor, Gloucester South-Nepean</p>
          <a
            href="https://ottawa.ca/en/city-hall/mayor-and-city-councillors/carol-anne-meehan"
            target="_blank"
            rel="noopener noreferrer"
            style={pdfLinkStyle}
          >
            City of Ottawa Profile Page →
          </a>
        </section>

        {/* THE PRESIDENT */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>The President, DarulArqum · Sadrul Alim</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/president.jpg`} alt="Community gathering at a Darul Arqum event" style={imgStyle} />
          <p style={bodyStyle}>
            We thank Allah Subhanahu wa Ta&apos;Ala for his mercy and blessings upon us. We also thank everyone who has been contributing.
            Alhamdulillah, now we have a place to meet and build the community bonded together in submission to Allah SWT. This comes with a great
            responsibility and we have to commit ourselves only for Allah&apos;s pleasure. Insha&apos;Allah the present of our families &amp; the future of
            our generations is bright. May Allah help &amp; guide us and make the journey easy. (Amen)
          </p>
        </section>

        {/* THE NEIGHBOUR */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>The Neighbour</div>
          <h2 style={headingStyle}>St. Francis Xavier High School, 3740 Spratt Rd.</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/sign-photo.jpg`} alt="The Darul Arqum property, near St. Francis Xavier High School" style={imgStyle} />
          <p style={{ ...bodyStyle, fontStyle: "italic" }}>
            &hellip; I am very happy for your organization that you were able to secure this property for your community worship. We have spent a
            great deal of time alone on this side of the road, so it will be great to have a neighbour shortly! &hellip;
          </p>
          <p style={{ ...bodyStyle, fontStyle: "italic" }}>
            I am looking forward to establishing a strong relationship with you and your community. As you know, we have a very large population of
            Muslim students at St. Francis Xavier High School, and I see it as an absolute blessing to the culture of our school. &hellip;
          </p>
          <p style={{ ...bodyStyle, marginBottom: 0, fontWeight: 600, color: "#f6f3ea" }}>Mr. Sean Kelly, Principal</p>
        </section>

        {/* VIDEO */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>Watch</div>
          <h2 style={headingStyle}>DarulArqum — Let&apos;s Build A Masjid</h2>
          <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(246,243,234,0.15)" }}>
            <iframe
              src="https://www.youtube.com/embed/UDvh63xHVa0"
              title="DarulArqum - Let's Build A Masjid"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </section>

        {/* ACTIVITIES */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>The Activities</div>
          <p style={bodyStyle}>
            Masjid of Rasulullah (Prophet of Allah) Sallallahu alaihi wasallam was always populated with the following a&apos;maal/ activities:
          </p>
          <ul style={{ ...bodyStyle, paddingLeft: 20 }}>
            <li>Da&apos;wat ilallah (Invitation to recognize Allah SWT)</li>
            <li>Ta&apos;leem wa Ta&apos;allum (Learning and Teaching)</li>
            <li>Zikr wa iba&apos;dat (Remembrance and worship of Allah)</li>
            <li>Khidma (Helping others i.e. Community services)</li>
          </ul>
          <p style={bodyStyle}>
            Insha&apos;Allah (Allah willing) we have the intention to populate the masjid with all these a&apos;maal and activities.
          </p>
          <p style={bodyStyle}>Alhamdulillah, all praise to Allah, following activities have been commenced:</p>
          <ol style={{ ...bodyStyle, paddingLeft: 20 }}>
            <li>Five time daily salat (prayers)</li>
            <li>
              Halaqas with Sheikh Saood Hasan:
              <ul style={{ marginTop: 6 }}>
                <li>Qasas-un-Nabiyyeen, Lessons on book by Sh. Abul hasan Ali Nadvi RA — every Wednesday after isha salat at 8:30 PM (Online on Zoom)</li>
                <li>Dars-e-Quran, from Tafseer Ma&apos;riful Quran by Mufti Shafi RA — every Thursday after isha salat at 8:30 PM (Online on Zoom)</li>
              </ul>
            </li>
            <li>Short taleem (teaching) of Hadith of Rasulullah SAW — everyday after isha salat</li>
            <li>Visiting muslims in the neighbourhood</li>
          </ol>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/volunteers-cleaning.jpg`} alt="Brothers volunteering for property maintenance and cleaning" style={imgStyle} />
          <p style={{ ...bodyStyle, marginBottom: 0 }}>5. Brothers volunteering for property maintenance and cleaning.</p>
          <p style={bodyStyle}>We are working to start more activities for different community groups. We welcome volunteers and encourage your participation.</p>
          <a href={`${A}/prayer-time-table.pdf`} target="_blank" rel="noopener noreferrer" style={pdfLinkStyle}>
            Prayer Time Table for December →
          </a>
          <p style={{ ...bodyStyle, fontSize: 12.5, color: "rgba(246,243,234,0.5)", marginTop: 12 }}>
            NOTE: Due to the pandemic physical attendance has been made limited, and strict following of guidelines from city and public health is
            required mandatorily at visits.
          </p>
        </section>

        {/* YOUTH */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>The Youth</div>
          <h2 style={headingStyle}>The Importance of Civic Engagement and Responsibility</h2>
          <p style={{ ...bodyStyle, fontSize: 12.5, color: "rgba(246,243,234,0.55)" }}>Ibrahim Ghani, Grade 10, Colonel By Public School</p>
          <p style={bodyStyle}>
            The way we regard our social responsibility is a substantial part of where we are and stand as a community. As a democratic nation, we
            have equal representation and should have commitment toward our community projects, initiatives and efforts. Civic engagement should be
            widely encouraged and looked up to. It should be regarded and built in as a core value. The society needs active citizens to operate.
            Businesses, local stores, religious institutions are among some of the many organizations that require help from the civilians.
          </p>
          <p style={bodyStyle}>There are many ways an individual can engage in society and voice their opinions.</p>
          <p style={bodyStyle}>
            Supporting projects that really hold importance to you is a great example of being an active member of the community. As an individual,
            I really value the sites where members of the community gather to worship and bond as a society. I like to volunteer and devote my time
            and effort into projects at Darul Arqum in Riverside-South, as it is my community mosque. Dedicating time and effort may not be
            regularly possible for many people, but even actions that may seem insignificant, can make a difference. There are so many
            possibilities like joining community-building activities, social projects and tuning in on virtual events.
          </p>
          <a href={EXT.youtubeChannel} target="_blank" rel="noopener noreferrer" style={pdfLinkStyle}>
            Darul Arqum YouTube Channel — view all recordings →
          </a>
        </section>

        {/* COMMUNITY / FARM CO-OP */}
        <section style={sectionStyle}>
          <div style={eyebrowStyle}>The Community</div>
          <h2 style={headingStyle}>Sustainable Farm Co-op</h2>
          <p style={{ ...bodyStyle, fontSize: 12.5, color: "rgba(246,243,234,0.55)" }}>
            shared values and shared ownership — Dr. Shehzad Ghani (sghani@uottawa.ca, 613-600-6916)
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/farm-flyer.jpg`} alt="Sustainable Farm Co-op flyer" style={imgStyle} />
          <p style={bodyStyle}>
            Having lived in Ottawa for just over a decade and being involved with various organizations, I have spoken with various Muslim families
            about opportunities for community recreation. After I moved to Ottawa South and became one of the pioneer members of Darul Arqum
            volunteers&apos; team, the drive of providing this avenue to Muslim families grew stronger. The vision of Sustainable Farm Co-op will enable
            us to come together to explore nature and allow families to bond.
          </p>
          <p style={bodyStyle}>
            Also important is the need of certain families to get affordable and authentic organic food and &lsquo;home-grown&rsquo; halal meat. We
            hear different stories about our friends and neighbors still looking for reliable sources of organic meat with animals who have been
            treated in a compassionate manner. Being a lifelong proponent of social enterprise &amp; sustainability, made me bring this idea to
            realization with the help of early members and a core group of brothers and sisters. We are now actively working towards creating this
            co-op insha&apos;Allah.
          </p>
          <p style={bodyStyle}>
            The basic tenets of this coop are based on the principles of a cooperative where each member is an equal owner translating into
            &lsquo;One Member, One Vote.&rsquo; We also want to keep the initial contribution to become a member to a relatively affordable $6,000 to
            $10,000. Sustainable Farm Co-op is being built on a vision to work collectively as a community to get its members organic fruits,
            vegetables, eggs and halal meat. It will enable like-minded families to come together to collectively invest in land just outside
            Ottawa suburbs. Our aim is to 1) build community; 2) provide avenues for recreation for families; 3) conduct business collectively; 4)
            benefit from and learn about the source of our organic food.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/donate-flyer.jpg`} alt="Donate to build the masjid flyer" style={imgStyle} />
        </section>

        {/* CLOSING HADITH */}
        <section style={{ ...sectionStyle, textAlign: "center" }}>
          <p dir="rtl" lang="ar" style={{ fontFamily: "'Amiri',serif", fontWeight: 700, fontSize: "clamp(16px,2.2vw,20px)", lineHeight: 1.9, margin: "0 0 14px 0", color: "#e3c56a" }}>
            عَنْ عُثْمَانَ بْنِ عَفَّانَ قَالَ قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ مَنْ بَنَى مَسْجِدًا لِلَّهِ بَنَى اللَّهُ لَهُ فِي الْجَنَّةِ مِثْلَهُ
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: "italic", lineHeight: 1.6, color: "#f6f3ea", margin: "0 auto 10px", maxWidth: 480 }}>
            &quot;Whoever builds a mosque for Allah, Allah will build for him a house like it in Paradise.&quot;
          </p>
          <p style={{ fontSize: 11.5, color: "rgba(246,243,234,0.5)", margin: "0 0 24px" }}>
            Uthman ibn Affan RA · Sahih al-Bukhari · Sahih Muslim
          </p>
          <p dir="rtl" lang="ar" style={{ fontFamily: "'Amiri',serif", fontWeight: 700, fontSize: "clamp(15px,2vw,18px)", lineHeight: 1.8, margin: "0 0 10px 0", color: "#e3c56a" }}>
            خَيْرُ البِقَاعِ المَسَاجِدُ وشَرُّهَا الأَسْوَاقُ
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16.5, fontStyle: "italic", lineHeight: 1.6, color: "#f6f3ea", margin: "0 auto 10px", maxWidth: 480 }}>
            &quot;The best patches [of earth] are the masājid and the worst are the markets.&quot;
          </p>
          <p style={{ fontSize: 11.5, color: "rgba(246,243,234,0.5)", margin: 0 }}>Reported by Ibn Hibbân</p>
        </section>

        {/* CONTACT / MEMBERSHIP */}
        <section style={{ ...sectionStyle, textAlign: "center" }}>
          <div style={eyebrowStyle}>Darul Arqum · Gloucester South, Ottawa</div>
          <h2 style={headingStyle}>Join the DarulArqum Team today</h2>
          <p style={bodyStyle}>Monthly Membership Fee: CAD 20</p>
          <Link
            href={R.community}
            style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "linear-gradient(135deg,#e3c56a,#c9a227)", color: "#0e2419", fontWeight: 700, fontSize: 14.5, padding: "13px 26px", borderRadius: 999, textDecoration: "none", marginBottom: 28 }}
          >
            Sign up →
          </Link>
          <p style={{ ...bodyStyle, fontSize: 12.5, color: "rgba(246,243,234,0.5)" }}>
            {ORG.address} · {ORG.phone}
          </p>
        </section>

        <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(246,243,234,0.45)", textAlign: "center", margin: "0 12px" }}>
          Disclaimer: DarulArqum has neither association with nor has any recommendation to any content other than of DarulArqum itself.
        </p>
      </div>
    </div>
  );
}
