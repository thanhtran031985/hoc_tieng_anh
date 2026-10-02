"use client";

import { useRef, useState } from "react";
import { AdultButtonLink, AdultCard, AdultEmpty } from "@/components/adult";
import { Icon, type IconName } from "@/components/ui";
import { AppearancePanel } from "./AppearancePanel";
import { ProfilesPanel } from "./ProfilesPanel";
import { SecurityPanel } from "./SecurityPanel";
import { TimePanel } from "./TimePanel";
import type { SettingsData } from "./settings-types";
import styles from "./settings.module.css";

type Tab = "time" | "ui" | "profiles" | "security";

const TABS: readonly { key: Tab; label: string; icon: IconName }[] = [
  { key: "time", label: "Thời gian học", icon: "clock" },
  { key: "ui", label: "Giao diện & âm thanh", icon: "eye" },
  { key: "profiles", label: "Hồ sơ của con", icon: "users" },
  { key: "security", label: "Mật khẩu & mã PIN", icon: "key" },
];

/** Cài đặt khu bố mẹ (Adult07): 4 nhóm ở cột trái (↑/↓ để chuyển), mỗi nhóm một biểu mẫu riêng. */
export function SettingsView({ data }: { data: SettingsData }) {
  const { selected, kids, levels, family } = data;
  const [tab, setTab] = useState<Tab>(selected ? "time" : "profiles");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function move(index: number, step: number) {
    const next = (index + step + TABS.length) % TABS.length;
    setTab(TABS[next].key);
    refs.current[next]?.focus();
  }

  const needsKid = (tab === "time" || tab === "ui") && !selected;

  return (
    <div className={styles.set}>
      <div className={styles.tabs} role="tablist" aria-orientation="vertical" aria-label="Nhóm cài đặt">
        {TABS.map((t, index) => (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.key}`}
            aria-controls="settings-panel"
            aria-selected={tab === t.key}
            tabIndex={tab === t.key ? 0 : -1}
            className={styles.tab}
            onClick={() => setTab(t.key)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                move(index, 1);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                move(index, -1);
              }
            }}
          >
            <Icon name={t.icon} size={18} />
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="settings-panel" aria-labelledby={`tab-${tab}`} className={styles.panel}>
        {needsKid ? (
          <AdultCard>
            <AdultEmpty
              title="Chưa có hồ sơ con nào"
              text="Thời gian học, giao diện và giọng đọc được đặt riêng cho từng con. Hãy thêm hồ sơ đầu tiên."
              expr="chao"
              action={<AdultButtonLink href="/profiles/new" label="Thêm hồ sơ con" icon="plus" />}
            />
          </AdultCard>
        ) : tab === "time" && selected ? (
          <TimePanel key={`${selected.id}-${selected.limitMinutes}-${selected.window?.from}-${selected.window?.to}`} kid={selected} />
        ) : tab === "ui" && selected ? (
          <AppearancePanel key={`${selected.id}-${selected.uiTheme}-${selected.accent}-${selected.speed}-${selected.soundOn}`} kid={selected} />
        ) : tab === "profiles" ? (
          <ProfilesPanel kids={kids} levels={levels} maxKids={family.maxKids} />
        ) : (
          <SecurityPanel key={String(family.hasPin)} email={family.email} hasPin={family.hasPin} />
        )}
      </div>
    </div>
  );
}
