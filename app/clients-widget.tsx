"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Lang = "ar" | "en";
type ClientItem = { id?: string; name: string; logo?: string };
type ClientsConfig = {
  enabled: boolean;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  items: ClientItem[];
};

const defaultClients: ClientsConfig = {
  enabled: true,
  titleAr: "نفخر بثقة عملائنا",
  titleEn: "Trusted by Our Clients",
  descriptionAr:
    "نفخر بدعم شركات تعمل في قطاعات الإنشاءات والمشتريات والتطوير العقاري والطلاء والصناعة.",
  descriptionEn:
    "Proud to support organizations across construction, procurement, real estate, coating, and industrial sectors.",
  items: [
    { id: "cfp-coating", name: "CFP COATING", logo: "" },
    { id: "creet", name: "CREET", logo: "" },
    { id: "sama-city", name: "SAMA CITY", logo: "" },
    { id: "sdc", name: "SDC", logo: "" },
    { id: "clc", name: "CLC", logo: "" },
  ],
};

function normalizeClients(value: unknown): ClientsConfig {
  const input =
    value && typeof value === "object"
      ? (value as Partial<ClientsConfig>)
      : {};
  const sourceItems = Array.isArray(input.items)
    ? input.items
    : defaultClients.items;
  return {
    ...defaultClients,
    ...input,
    enabled:
      typeof input.enabled === "boolean" ? input.enabled : defaultClients.enabled,
    items: sourceItems.map((item, index) => ({
      id: String(item?.id || `client-${index + 1}`),
      name: String(item?.name || "").trim(),
      logo: String(item?.logo || "").trim(),
    })),
  };
}

function makeClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ClientMark({ item }: { item: ClientItem }) {
  const [failed, setFailed] = useState(false);
  if (item.logo && !failed)
    return (
      <img
        src={item.logo}
        alt={item.name}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  return <span>{item.name}</span>;
}

function ClientsSection({ clients, lang }: { clients: ClientsConfig; lang: Lang }) {
  const visibleItems = clients.items.filter((item) => item.name);
  const items = visibleItems.length ? visibleItems : defaultClients.items;
  if (!clients.enabled) return null;
  const title = lang === "ar" ? clients.titleAr : clients.titleEn;
  const description = lang === "ar" ? clients.descriptionAr : clients.descriptionEn;
  const group = (suffix: string) => (
    <div className="clients-marquee-group" aria-hidden={suffix !== "a"}>
      {items.map((item, index) => (
        <div className="client-mark" key={`${item.id || item.name}-${suffix}-${index}`}>
          <ClientMark item={item} />
        </div>
      ))}
    </div>
  );
  return (
    <section className="clients-section reveal in-view" aria-labelledby="clients-title">
      <div className="clients-heading">
        <p className="kicker">{lang === "ar" ? "عملاؤنا" : "Key Clients"}</p>
        <h2 id="clients-title">{title}</h2>
        <p>{description}</p>
      </div>
      <div className="clients-marquee" aria-label={title}>
        <div className="clients-marquee-track">
          {group("a")}
          {group("b")}
        </div>
      </div>
    </section>
  );
}

function ClientsAdmin({
  clients,
  onChange,
}: {
  clients: ClientsConfig;
  onChange: (clients: ClientsConfig) => void;
}) {
  const update = (patch: Partial<ClientsConfig>) =>
    onChange(normalizeClients({ ...clients, ...patch }));
  const updateItem = (
    index: number,
    key: "name" | "logo",
    value: string,
  ) => {
    const items = [...clients.items];
    items[index] = { ...items[index], [key]: value };
    update({ items });
  };
  return (
    <div className="clients-admin-panel">
      <label className="admin-check">
        <input
          type="checkbox"
          checked={clients.enabled}
          onChange={(event) => update({ enabled: event.target.checked })}
        />
        <span>إظهار قسم العملاء</span>
      </label>
      <div className="clients-admin-grid">
        <label>
          العنوان بالعربية
          <input
            value={clients.titleAr}
            onChange={(event) => update({ titleAr: event.target.value })}
          />
        </label>
        <label>
          العنوان بالإنجليزية
          <input
            value={clients.titleEn}
            onChange={(event) => update({ titleEn: event.target.value })}
          />
        </label>
        <label>
          الوصف بالعربية
          <textarea
            rows={3}
            value={clients.descriptionAr}
            onChange={(event) => update({ descriptionAr: event.target.value })}
          />
        </label>
        <label>
          الوصف بالإنجليزية
          <textarea
            rows={3}
            value={clients.descriptionEn}
            onChange={(event) => update({ descriptionEn: event.target.value })}
          />
        </label>
      </div>
      <div className="clients-admin-list">
        {clients.items.map((item, index) => (
          <div className="client-admin-row" key={item.id || index}>
            <label>
              اسم الشركة
              <input
                value={item.name}
                onChange={(event) => updateItem(index, "name", event.target.value)}
              />
            </label>
            <label>
              رابط أو مسار الشعار
              <input
                value={item.logo || ""}
                placeholder="/images/client-logo.webp"
                onChange={(event) => updateItem(index, "logo", event.target.value)}
              />
            </label>
            {item.logo ? <img src={item.logo} alt={item.name} /> : <span />}
            <button
              type="button"
              className="admin-danger"
              onClick={() =>
                update({
                  items: clients.items.filter((_, itemIndex) => itemIndex !== index),
                })
              }
            >
              حذف
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="admin-secondary"
        onClick={() =>
          update({
            items: [
              ...clients.items,
              { id: makeClientId(), name: "", logo: "" },
            ],
          })
        }
      >
        إضافة عميل
      </button>
    </div>
  );
}

export default function ClientsWidget() {
  const [clients, setClients] = useState<ClientsConfig>(defaultClients);
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAvailable, setAdminAvailable] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [adminNavTarget, setAdminNavTarget] = useState<HTMLElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const normalizedClients = useMemo(() => normalizeClients(clients), [clients]);

  useEffect(() => {
    const syncLang = () => {
      const page = document.querySelector(".cx-page");
      setLang(page?.classList.contains("ar") ? "ar" : "en");
      setAdminAvailable(Boolean(document.querySelector(".admin-panel")));
      const adminAside = document.querySelector<HTMLElement>(".admin-panel aside");
      setAdminNavTarget(adminAside);
      const hero = document.querySelector(".cx-hero");
      if (hero) {
        let target = document.getElementById("masar-clients-portal");
        if (!target) {
          target = document.createElement("div");
          target.id = "masar-clients-portal";
          hero.insertAdjacentElement("afterend", target);
        }
        setPortalTarget(target);
      }
    };
    syncLang();
    const observer = new MutationObserver(syncLang);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "dir"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/site-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        const nextConfig = result?.config || {};
        setConfig(nextConfig);
        setClients(normalizeClients(nextConfig.clients));
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    const nextConfig = { ...(config || {}), clients: normalizedClients };
    try {
      const response = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: nextConfig }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "تعذر الحفظ");
      setConfig(nextConfig);
      setMessage("تم حفظ قسم العملاء");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {portalTarget &&
        createPortal(
          <ClientsSection clients={normalizedClients} lang={lang} />,
          portalTarget,
        )}
      {adminAvailable &&
        adminNavTarget &&
        createPortal(
          <button
            type="button"
            className={`clients-admin-trigger ${adminOpen ? "active" : ""}`}
            onClick={() => setAdminOpen(true)}
          >
            العملاء
          </button>,
          adminNavTarget,
        )}
      {adminOpen && (
        <div className="clients-admin-overlay" role="dialog" aria-modal="true">
          <div className="admin-card clients-admin-modal">
            <button
              type="button"
              className="clients-admin-close"
              onClick={() => setAdminOpen(false)}
            >
              ×
            </button>
            <span className="admin-eyebrow">MASAR CONTROL CENTER</span>
            <h2>إدارة العملاء</h2>
            <ClientsAdmin clients={normalizedClients} onChange={setClients} />
            {message && <div className="admin-save-note">{message}</div>}
            <button
              type="button"
              className="admin-primary"
              disabled={saving}
              onClick={save}
            >
              {saving ? "جارٍ الحفظ..." : "حفظ ونشر التغييرات"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
