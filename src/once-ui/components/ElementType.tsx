import Link from "next/link";
import React, { ReactNode, forwardRef } from "react";

interface ElementTypeProps {
  href?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const isExternalLink = (url: string) => /^https?:\/\//.test(url);
const isStaticAssetLink = (url: string) =>
  /^\/[^?#]+\.[a-z0-9]+(?:[?#].*)?$/i.test(url);

const ElementType = forwardRef<HTMLElement, ElementTypeProps>(
  ({ href, children, className, style, ...props }, ref) => {
    if (href) {
      const isAnchorTag = isExternalLink(href) || isStaticAssetLink(href);

      if (isAnchorTag) {
        return (
          <a
            href={href}
            target={isExternalLink(href) ? "_blank" : props.target}
            rel={isExternalLink(href) ? "noreferrer" : props.rel}
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={className}
            style={style}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={className}
          style={style}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={className}
        style={style}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  },
);

ElementType.displayName = "ElementType";
export { ElementType };
