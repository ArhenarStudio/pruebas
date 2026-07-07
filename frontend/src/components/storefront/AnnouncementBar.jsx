import React from "react";
import { X } from "lucide-react";

export const AnnouncementBar = ({ config, onDismiss, dismissed }) => {
  if (!config?.enabled || dismissed) return null;
  return (
    <div
      data-testid="store-announcement-bar"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      <div className="mx-auto max-w-[1400px] px-4 py-2.5 flex items-center justify-center gap-3 text-center">
        <p className="text-xs sm:text-[13px] tracking-wide font-medium">
          {config.text}
          {config.linkLabel ? (
            <a
              href={config.link || "#"}
              className="ml-2 underline underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: config.textColor }}
              data-testid="store-announcement-link"
            >
              {config.linkLabel}
            </a>
          ) : null}
        </p>
      </div>
      {config.dismissible && (
        <button
          onClick={onDismiss}
          data-testid="store-announcement-dismiss"
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: config.textColor, position: "absolute" }}
          aria-label="Dismiss"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};
