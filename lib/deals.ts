export type DealType = "flight" | "cruise";

export type SourceType = "companhia-aerea" | "agencia-iata" | "operadora-cruzeiro";

export type Currency = "BRL" | "USD";

export interface DealCheck {
  id: string;
  label: string;
  status: "passed" | "warning" | "failed";
  detail: string;
}

export interface DealValidation {
  status: "valid" | "review";
  checks: DealCheck[];
}

export interface Deal {
  id: string;
  type: DealType;
  title: string;
  route: string;
  originalPrice: number;
  price: number;
  currency: Currency;
  source: string;
  sourceType: SourceType;
  sourceUrl: string;
  expiresAt?: string;
  badge?: string;
  notes?: string;
  lastCheckedAt: string;
  discount: number;
  validation: DealValidation;
}

export interface DealsSummary {
  total: number;
  valid: number;
  failing: number;
  avgDiscount: number;
}

export interface DealSnapshot {
  deals: Deal[];
  refreshedAt: string;
  summary: DealsSummary;
}

interface SeedDeal {
  id: string;
  type: DealType;
  title: string;
  route: string;
  originalPrice: number;
  price: number;
  currency: Currency;
  source: string;
  sourceType: SourceType;
  sourceUrl: string;
  expiresInHours?: number;
  badge?: string;
  notes?: string;
  lastCheckedMinutesAgo: number;
}

const seedDeals: SeedDeal[] = [
  {
    id: "flight-rio-lisbon",
    type: "flight",
    title: "Rio de Janeiro para Lisboa (ida e volta)",
    route: "GIG - LIS",
    originalPrice: 4120,
    price: 1790,
    currency: "BRL",
    source: "TAP Air Portugal - site oficial",
    sourceType: "companhia-aerea",
    sourceUrl: "https://www.flytap.com/",
    expiresInHours: 42,
    badge: "Bagagem incluida e remarcacao",
    notes: "Compra direta com a TAP, tarifa flexivel.",
    lastCheckedMinutesAgo: 18,
  },
  {
    id: "flight-sao-nyc",
    type: "flight",
    title: "Sao Paulo para Nova York (ida e volta)",
    route: "GRU - JFK",
    originalPrice: 5280,
    price: 2480,
    currency: "BRL",
    source: "United - site oficial",
    sourceType: "companhia-aerea",
    sourceUrl: "https://www.united.com/",
    expiresInHours: 30,
    badge: "2 malas de cabine + despacho",
    notes: "Validacao com token da companhia aerea.",
    lastCheckedMinutesAgo: 32,
  },
  {
    id: "flight-bsb-mia",
    type: "flight",
    title: "Brasilia para Miami (ida e volta)",
    route: "BSB - MIA",
    originalPrice: 4870,
    price: 2290,
    currency: "BRL",
    source: "Agencia IATA autorizada",
    sourceType: "agencia-iata",
    sourceUrl: "https://www.cvc.com.br/",
    expiresInHours: 22,
    badge: "Tarifa light, emissao imediata",
    notes: "Emissao por agencia com tarifa consolidada.",
    lastCheckedMinutesAgo: 8,
  },
  {
    id: "cruise-mediterraneo",
    type: "cruise",
    title: "Mediterraneo - 7 noites",
    route: "Barcelona - Roma - Marselha",
    originalPrice: 7890,
    price: 3190,
    currency: "BRL",
    source: "MSC - agente oficial",
    sourceType: "operadora-cruzeiro",
    sourceUrl: "https://www.msccruzeiros.com.br/",
    expiresInHours: 52,
    badge: "Cabine externa + taxas portuarias",
    notes: "Inventario validado direto no sistema MSC.",
    lastCheckedMinutesAgo: 20,
  },
  {
    id: "cruise-caribe",
    type: "cruise",
    title: "Caribe - 5 noites",
    route: "Miami - Nassau - Cozumel",
    originalPrice: 5120,
    price: 2140,
    currency: "BRL",
    source: "Royal Caribbean - site oficial",
    sourceType: "operadora-cruzeiro",
    sourceUrl: "https://www.royalcaribbean.com/",
    expiresInHours: 18,
    badge: "Cabine interna, taxas incluidas",
    notes: "Preco conferido direto no motor oficial.",
    lastCheckedMinutesAgo: 11,
  },
  {
    id: "flight-porto-orlando",
    type: "flight",
    title: "Porto Alegre para Orlando (ida e volta)",
    route: "POA - MCO",
    originalPrice: 4650,
    price: 2130,
    currency: "BRL",
    source: "Delta - site oficial",
    sourceType: "companhia-aerea",
    sourceUrl: "https://www.delta.com/",
    expiresInHours: 27,
    badge: "Tarifa economica com bagagem",
    notes: "Validacao feita com PNR de teste.",
    lastCheckedMinutesAgo: 16,
  },
];

export function getDealsSnapshot(now: number = Date.now()): DealSnapshot {
  const deals = seedDeals.map((deal, index) => materializeDeal(deal, index, now));

  return {
    deals,
    refreshedAt: new Date(now).toISOString(),
    summary: summarizeDeals(deals),
  };
}

export function summarizeDeals(deals: Deal[]): DealsSummary {
  const total = deals.length;
  const valid = deals.filter((deal) => deal.validation.status === "valid").length;
  const failing = total - valid;
  const avgDiscount =
    total === 0
      ? 0
      : Math.round(
          deals.reduce((sum, deal) => sum + deal.discount, 0) / total
        );

  return { total, valid, failing, avgDiscount };
}

export function formatCurrency(value: number, currency: Currency): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function materializeDeal(seed: SeedDeal, index: number, now: number): Deal {
  const drift = Math.sin(now / 90000 + index) * 0.08;
  const priceFloor = seed.price * 0.9;
  const adjustedPrice = Math.max(priceFloor, seed.price * (1 + drift));
  const discount = calculateDiscount(seed.originalPrice, adjustedPrice);
  const lastCheckedAt = isoMinutesAgo(seed.lastCheckedMinutesAgo, now);
  const expiresAt = seed.expiresInHours
    ? isoHoursFromNow(seed.expiresInHours, now)
    : undefined;

  const validation = validateDeal({
    price: adjustedPrice,
    discount,
    sourceUrl: seed.sourceUrl,
    originalPrice: seed.originalPrice,
    lastCheckedAt,
    sourceType: seed.sourceType,
    currency: seed.currency,
    now,
  });

  return {
    ...seed,
    price: roundTo(adjustedPrice, 2),
    discount,
    lastCheckedAt,
    expiresAt,
    validation,
  };
}

function validateDeal(input: {
  price: number;
  discount: number;
  sourceUrl: string;
  originalPrice: number;
  lastCheckedAt: string;
  sourceType: SourceType;
  currency: Currency;
  now: number;
}): DealValidation {
  const checks: DealCheck[] = [
    {
      id: "source",
      label: "Fonte oficial ou autorizada",
      status:
        input.sourceType === "companhia-aerea" ||
        input.sourceType === "operadora-cruzeiro" ||
        input.sourceType === "agencia-iata"
          ? "passed"
          : "failed",
      detail: input.sourceType,
    },
    {
      id: "discount",
      label: "Desconto entre 45% e 90%",
      status:
        input.discount >= 45 && input.discount <= 90
          ? "passed"
          : input.discount >= 30
            ? "warning"
            : "failed",
      detail: `${input.discount}% abaixo do tarifario`,
    },
    {
      id: "price",
      label: "Preco menor que o original",
      status: input.price < input.originalPrice ? "passed" : "failed",
      detail: `De ${formatCurrency(input.originalPrice, input.currency)} por ${formatCurrency(input.price, input.currency)}`,
    },
    {
      id: "https",
      label: "Link seguro (https)",
      status: input.sourceUrl.startsWith("https://") ? "passed" : "failed",
      detail: input.sourceUrl,
    },
    {
      id: "freshness",
      label: "Checado nas ultimas 6h",
      status: isFresh(input.lastCheckedAt, 6, input.now) ? "passed" : "warning",
      detail: formatIsoToHour(input.lastCheckedAt),
    },
  ];

  const status: DealValidation["status"] = checks.every(
    (check) => check.status === "passed"
  )
    ? "valid"
    : "review";

  return { status, checks };
}

function calculateDiscount(original: number, current: number) {
  return Math.round(((original - current) / original) * 100);
}

function roundTo(value: number, digits: number) {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

function isoMinutesAgo(minutes: number, now: number) {
  return new Date(now - minutes * 60 * 1000).toISOString();
}

function isoHoursFromNow(hours: number, now: number) {
  return new Date(now + hours * 60 * 1000).toISOString();
}

function isFresh(iso: string, maxHours: number, now: number) {
  const diffHours = (now - new Date(iso).getTime()) / (1000 * 60 * 60);
  return diffHours <= maxHours;
}

function formatIsoToHour(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
