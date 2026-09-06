import { EXT } from "@/lib/links";

/**
 * The WhatsApp link, styled as a WhatsApp button.
 *
 * It used to be a generic ghost button carrying the words "Ask in the
 * WhatsApp group ↗", which was both longer than the button on a phone and
 * indistinguishable from every other secondary action on the page. A brand
 * people recognise at a glance should look like itself: the glyph does the
 * explaining, so the label can be short enough to fit.
 *
 * Dark ink on the green rather than the white of WhatsApp's own lockup —
 * white on #25D366 measures about 2.1:1, which fails at this size, and dark
 * ink is the convention the rest of the site's filled buttons already use.
 */
export function WhatsAppButton({
  label = "WhatsApp group",
  size = "sm",
  className,
}: {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <a
      href={EXT.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={["da-wa-btn", size === "md" ? "da-wa-btn-md" : "", className].filter(Boolean).join(" ")}
    >
      <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden focusable="false">
        <path
          fill="currentColor"
          d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.2 5.07 4.48.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"
        />
        <path
          fill="currentColor"
          d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2.1 22l5.34-1.4a9.82 9.82 0 0 0 4.6 1.17h.01c5.43 0 9.85-4.42 9.85-9.86A9.8 9.8 0 0 0 19 4.88 9.78 9.78 0 0 0 12.04 2Zm0 17.98h-.01a8.19 8.19 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.13 8.13 0 0 1-1.25-4.34c0-4.52 3.68-8.2 8.2-8.2a8.15 8.15 0 0 1 8.19 8.2c0 4.52-3.68 8.18-8.19 8.18Z"
        />
      </svg>
      {label}
    </a>
  );
}
