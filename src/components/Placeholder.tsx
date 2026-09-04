import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";

/**
 * Skeleton-stage page stub. Every route in the spec's section 4 exists as a real
 * file so navigation and layouts can be built out; the screen content is filled in
 * per feature.
 */
export function Placeholder({
  title,
  description,
  scope = "mvp",
  children,
}: {
  title: string;
  description?: string;
  scope?: "mvp" | "post-mvp";
  children?: ReactNode;
}) {
  const t = useTranslations("placeholder");
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Badge tone={scope === "mvp" ? "accent" : "neutral"}>
          {scope === "mvp" ? "MVP" : "post-MVP"}
        </Badge>
      </div>
      {description ? (
        <p className="max-w-prose text-sm text-text-muted">{description}</p>
      ) : null}
      {children ?? (
        <Card>
          <CardBody className="text-sm text-text-muted">{t("notBuilt")}</CardBody>
        </Card>
      )}
    </div>
  );
}
