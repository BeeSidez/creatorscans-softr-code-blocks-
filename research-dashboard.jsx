import { useState } from "react";
import { useCurrentUser } from "@/lib/user";
import { useRecord, useLinkedRecords, q } from "@/lib/datasource";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  TrendingUp,
  MessageSquareQuote,
  Target,
  Lightbulb,
  Brain,
  Zap,
  BarChart3,
  Users,
  ShieldAlert,
  Heart,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

// ─── Field mappings ───────────────────────────────────────────────
// Products table (zJPuKZNjMXTqUU)
const productFields = q.select({
  product_title: "AHF5Y",
  views_display: "Cfn4N",
  product_image_url: "E4EKm",
  product_link: "4DQmQ",
  shop_logo_url: "tC9ZL",
  units_sold: "zNJ57",
  average_price: "v3IfP",
  product_gmv: "RiiGL",
  videos: "FFSGd",
  categories: "XTQgx",
  date_captured: "cfgWC",
});

// Research table (sbnawqOfGV4E1t)
const researchFields = q.select({
  product_type: "u8sss",
  review_count: "LLfso",
  review_sources: "lmWoN",
  pain_points: "lxKKo",
  trigger_moments: "V4GsI",
  objections: "Edrdt",
  transformations: "Sq47t",
  failed_solutions: "nzgNd",
  desire_drivers: "hvJJL",
  identity_signals: "4QcRY",
  emotional_payoffs: "I7KOi",
  lifestyle_associations: "W1e2j",
  upgrade_language: "7SctS",
  standout_quotes: "91Zlg",
  audience_segments: "jKXO1",
  quick_win_hooks: "NK4Kd",
  raw_review_database: "Ey7oM",
});

// Strategy table (ZS2TbGIKX1iKZm)
const strategyFields = q.select({
  organising_principle: "SM0zZ",
  principle_reasoning: "Bq5vc",
  pain_points_mapped: "QOaZ5",
  desire_drivers_mapped: "wwoT1",
  audience_segments_mapped: "C9M5x",
  pain_audience_matrix: "vv7xU",
  desire_audience_matrix: "BSyuI",
  messaging_angles: "koB5Z",
  motivators: "gdL6A",
  concepts: "KhNCR",
  pivot_mechanics: "eOTlz",
  oddly_specific_data: "OVtdR",
});

// Brands table (DqAtvmhge23QvA)
const brandFields = q.select({
  brand_name: "eLXLv",
  brand_context: "tRjSk",
  brand_voice: "WauKx",
  positioning: "fnKei",
});

// ─── Helper components ────────────────────────────────────────────

function Section({ icon: Icon, title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-left">{title}</h3>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="px-4 pb-4 pt-0">{children}</div>}
    </div>
  );
}

function DataBlock({ label, content, highlight = false }) {
  if (!content || content.trim() === "") return null;

  return (
    <div
      className={`rounded-lg p-3 ${highlight ? "bg-yellow-50 border border-yellow-200" : "bg-muted/30"}`}
    >
      <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
        {label}
      </p>
      <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
        {content}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function QuoteCard({ text }) {
  return (
    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 flex gap-2">
      <MessageSquareQuote className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
      <p className="text-sm text-foreground italic leading-relaxed">{text}</p>
    </div>
  );
}

// ─── Helper to extract field values ───────────────────────────────

function val(record, fieldName) {
  if (!record?.fields) return "";
  const field = record.fields[fieldName];
  if (field === null || field === undefined) return "";
  if (typeof field === "object" && field.value !== undefined) return String(field.value);
  if (Array.isArray(field)) return field.map((f) => f.name || f.label || f).join(", ");
  return String(field);
}

// ─── Main component ───────────────────────────────────────────────

export default function Block() {
  const user = useCurrentUser();

  // Fetch linked records from the current product page
  const { data: researchData } = useLinkedRecords({
    select: researchFields,
    field: "Research",
    count: 1,
  });

  const { data: strategyData } = useLinkedRecords({
    select: strategyFields,
    field: "Strategy",
    count: 1,
  });

  const { data: brandData } = useLinkedRecords({
    select: brandFields,
    field: "Shop_name",
    count: 1,
  });

  // Extract first record from each linked set
  const research = researchData?.pages?.flatMap((p) => p.items)?.[0];
  const strategy = strategyData?.pages?.flatMap((p) => p.items)?.[0];
  const brand = brandData?.pages?.flatMap((p) => p.items)?.[0];

  const isLoading = !research && !strategy;

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading research data...</p>
      </div>
    );
  }

  // Parse standout quotes into individual items
  const standoutQuotes = val(research, "standout_quotes")
    .split("\n")
    .map((q) => q.trim())
    .filter((q) => q.length > 0)
    .slice(0, 10);

  const productType = val(research, "product_type");
  const isDesire = productType === "Desire-led" || productType === "Both";
  const isPain = productType === "Pain-led" || productType === "Both";

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-4">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold text-foreground">Research Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Everything our research found about this product. Use this to prepare before generating your script.
          </p>
        </div>
        {productType && (
          <Badge
            className={`text-xs ${
              productType === "Pain-led"
                ? "bg-red-100 text-red-700 border-red-200"
                : productType === "Desire-led"
                  ? "bg-purple-100 text-purple-700 border-purple-200"
                  : "bg-blue-100 text-blue-700 border-blue-200"
            }`}
          >
            {productType}
          </Badge>
        )}
      </div>

      {/* ─── Quick Stats ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Reviews Analysed"
          value={val(research, "review_count")}
          icon={BarChart3}
        />
        <StatCard
          label="Review Sources"
          value={val(research, "review_sources")}
          icon={Star}
        />
        <StatCard
          label="Strategy"
          value={val(strategy, "organising_principle")}
          icon={Target}
        />
        <StatCard
          label="Audience Segments"
          value={
            val(strategy, "audience_segments_mapped")
              .split("\n")
              .filter((l) => l.trim()).length || "N/A"
          }
          icon={Users}
        />
      </div>

      {/* ─── Standout Quotes (THE GOLD — show first) ─── */}
      {standoutQuotes.length > 0 && (
        <Section
          icon={MessageSquareQuote}
          title="Standout Quotes"
          badge={`${standoutQuotes.length} quotes`}
          defaultOpen={true}
        >
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2">
              The most vivid, hookable language from real buyers. These are the words that stop the scroll.
            </p>
            {standoutQuotes.map((quote, i) => (
              <QuoteCard key={i} text={quote} />
            ))}
          </div>
        </Section>
      )}

      {/* ─── What Buyers Are Saying (Pain Categories) ─── */}
      {isPain && (
        <Section icon={ShieldAlert} title="What Buyers Are Saying" defaultOpen={true}>
          <div className="space-y-3">
            <DataBlock label="Pain Points" content={val(research, "pain_points")} />
            <DataBlock label="Trigger Moments" content={val(research, "trigger_moments")} />
            <DataBlock label="Objections Before Buying" content={val(research, "objections")} />
            <DataBlock
              label="Transformations (Before/After)"
              content={val(research, "transformations")}
            />
            <DataBlock
              label="Failed Solutions (What Didn't Work)"
              content={val(research, "failed_solutions")}
            />
          </div>
        </Section>
      )}

      {/* ─── Desire Signals (only for Desire-led or Both) ─── */}
      {isDesire && (
        <Section icon={Heart} title="What Buyers Want to Feel" defaultOpen={true}>
          <div className="space-y-3">
            <DataBlock label="Desire Drivers" content={val(research, "desire_drivers")} />
            <DataBlock label="Identity Signals" content={val(research, "identity_signals")} />
            <DataBlock label="Emotional Payoffs" content={val(research, "emotional_payoffs")} />
            <DataBlock
              label="Lifestyle Associations"
              content={val(research, "lifestyle_associations")}
            />
            <DataBlock label="Upgrade Language" content={val(research, "upgrade_language")} />
          </div>
        </Section>
      )}

      {/* ─── Audience Segments ─── */}
      <Section icon={Users} title="Who's Buying This">
        <DataBlock
          label="Audience Segments (from reviews)"
          content={val(research, "audience_segments")}
        />
      </Section>

      {/* ─── Strategic Foundation ─── */}
      <Section icon={Target} title="Strategic Foundation">
        <div className="space-y-3">
          <DataBlock
            label="Organising Principle"
            content={`${val(strategy, "organising_principle")}\n\n${val(strategy, "principle_reasoning")}`}
          />
          {val(strategy, "pain_audience_matrix") && (
            <DataBlock
              label="Pain/Audience Matrix"
              content={val(strategy, "pain_audience_matrix")}
            />
          )}
          {val(strategy, "desire_audience_matrix") && (
            <DataBlock
              label="Desire/Audience Matrix"
              content={val(strategy, "desire_audience_matrix")}
            />
          )}
        </div>
      </Section>

      {/* ─── Messaging Angles ─── */}
      <Section
        icon={Lightbulb}
        title="Messaging Angles"
        badge="90+"
      >
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            These are the different ways to talk about this product. When you generate your script, the AI will pick the angle that best matches your life and perspective.
          </p>
          <DataBlock label="All Angles" content={val(strategy, "messaging_angles")} />
        </div>
      </Section>

      {/* ─── Motivators ─── */}
      <Section icon={Brain} title="Why People Buy This">
        <DataBlock
          label="Psychological Buy Triggers"
          content={val(strategy, "motivators")}
        />
      </Section>

      {/* ─── Video Concepts ─── */}
      <Section icon={Sparkles} title="Video Concepts">
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Overarching ideas for videos about this product. Your script will be built around one of these.
          </p>
          <DataBlock label="Concepts" content={val(strategy, "concepts")} />
        </div>
      </Section>

      {/* ─── Oddly Specific Data ─── */}
      {val(strategy, "oddly_specific_data") && (
        <Section icon={Zap} title="Oddly Specific Data" defaultOpen={true}>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Real numbers and details from reviews that make scripts feel credible. The AI will weave these into your script.
            </p>
            <DataBlock
              label="Key Data Points"
              content={val(strategy, "oddly_specific_data")}
              highlight={true}
            />
          </div>
        </Section>
      )}

      {/* ─── Quick-Win Hooks ─── */}
      <Section icon={ArrowUpRight} title="Quick-Win Hooks">
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Ready-to-use hook ideas mapped to awareness stages. These were extracted directly from buyer language.
          </p>
          <DataBlock label="Hooks by Stage" content={val(research, "quick_win_hooks")} />
        </div>
      </Section>

      {/* ─── Generate CTA ─── */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center space-y-3">
        <h3 className="text-lg font-bold text-foreground">
          Ready to create your video?
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Tell us about yourself and how you'd use this product. The AI will combine your perspective with everything above to write a personalised script and storyboard.
        </p>
        <Button size="lg" className="mt-2">
          Generate Script & Storyboard
        </Button>
      </div>
    </div>
  );
}
