import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// v3.0 L10 (SPRINT-08): /help route that links to the User Guide PDF and
// the support contact so field staff can self-serve.
export default function HelpPage() {
  const { t } = useI18n();
  const guideUrl = "https://drive.google.com/file/d/1G3TxI6wYJVKBxxTVyrLKPBpDFsTiISZv/view";
  const supportEmail = "support@lrmb.com";

  return (
    <AppShell title={t("Help")}>
      <div className="p-4 space-y-4 max-w-2xl">
        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">{t("User Guide")}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Complete guide covering roles, dashboards, work orders, and mobile use.")}
            </p>
            <Button asChild variant="default" className="w-full sm:w-auto">
              <a href={guideUrl} target="_blank" rel="noopener noreferrer">
                {t("Open User Guide (PDF)")} <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">{t("Support")}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Report a bug or ask for help by email.")}
            </p>
            <Button asChild variant="outline">
              <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="text-base font-semibold mb-2">{t("Quick reference")}</h2>
            <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-5">
              <li>{t("Field staff: your Next Up task is always at the top of My Work Orders.")}</li>
              <li>{t("Supervisor: Today's Brief has arrivals, verification queue, and vendor delays.")}</li>
              <li>{t("Manager: Command Center shows Operational Health Score and live exceptions.")}</li>
              <li>{t("Photos are required on every housekeeping task before verification.")}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
