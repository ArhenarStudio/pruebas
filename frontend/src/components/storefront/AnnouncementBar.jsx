import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { backgroundStyle } from "@/lib/appearance";

export const AnnouncementBar = ({ config, onDismiss, dismissed }) => {
  const [index, setIndex] = useState(0);
  const list = (config?.announcements && config.announcements.length ? config.announcements : []).filter((a) => a && a.text);
  const transition = config?.transition || "slide";

  useEffect(() => {
    if (!config?.enabled || dismissed) return;
    if (list.length <= 1 || transition === "marquee" || transition === "none") return;
    const t = setInterval(() => setIndex((i) => (i + 1) % list.length), config.interval || 4000);
    return () => clearInterval(t);
  }, [config, dismissed, list.length, transition]);

  useEffect(() => {
    if (index >= list.length) setIndex(0);
  }, [list.length, index]);

  if (!config?.enabled || dismissed || list.length === 0) return null;

  const bgStyle = backgroundStyle(config.background, "#0A0A0A");
  const pad = config.paddingY ?? 10;

  const renderItem = (a, i) => (
    <span key={i} className="inline-flex items-center gap-2 whitespace-nowrap">
      {a.text}
      {a.linkLabel ? (
        <a href={a.link || "#"} className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: config.textColor }} data-testid={`store-announcement-link-${i}`}>
          {a.linkLabel}
        </a>
      ) : null}
    </span>
  );

  return (
    <div data-testid="store-announcement-bar" className="relative w-full overflow-hidden" style={{ ...bgStyle, color: config.textColor }}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-center px-8 text-center text-xs sm:text-[13px] font-medium tracking-wide" style={{ paddingTop: pad, paddingBottom: pad }}>
        {transition === "marquee" ? (
          <div className="flex w-full overflow-hidden">
            <div className="flex shrink-0 gap-16 pr-16" style={{ animation: "marquee 22s linear infinite" }}>
              {list.map(renderItem)}
              {list.map((a, i) => renderItem(a, i + 100))}
            </div>
          </div>
        ) : (
          <div className="relative flex min-h-[18px] w-full items-center justify-center">
            {list.map((a, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                style={
                  transition === "fade"
                    ? { opacity: i === index ? 1 : 0 }
                    : { transform: `translateY(${(i - index) * 100}%)`, opacity: i === index ? 1 : 0 }
                }
              >
                {renderItem(a, i)}
              </div>
            ))}
            <span className="invisible">{renderItem(list[index] || list[0], -1)}</span>
          </div>
        )}
      </div>

      {list.length > 1 && transition !== "marquee" && (
        <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 sm:flex">
          {list.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className="h-1.5 w-1.5 rounded-full transition-opacity" style={{ backgroundColor: config.textColor, opacity: i === index ? 1 : 0.4 }} aria-label={`Announcement ${i + 1}`} />
          ))}
        </div>
      )}

      {config.dismissible && (
        <button onClick={onDismiss} data-testid="store-announcement-dismiss" className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity" style={{ color: config.textColor }} aria-label="Dismiss">
          <X size={15} />
        </button>
      )}
    </div>
  );
};
