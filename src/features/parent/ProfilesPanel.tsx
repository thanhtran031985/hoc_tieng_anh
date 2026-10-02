"use client";

import { useState } from "react";
import { AdultButton, AdultButtonLink, AdultCard, AdultCardHead, AdultDialog, AdultEmpty, AdultIconButton, AdultInput, AdultSelect, adultStyles } from "@/components/adult";
import { Avatar, Icon, LevelChip } from "@/components/ui";
import { cn } from "@/lib/cn";
import { validateName } from "@/lib/rules/parent-settings";
import { changeGradeAction, changeLevelAction, deleteLearnerAction, renameLearnerAction, resetProgressAction } from "./settings-actions";
import type { SettingsData, SettingsKid } from "./settings-types";
import styles from "./settings.module.css";
import { useSave } from "./use-save";

type Dialog = { kind: "rename" | "grade" | "level" | "reset" | "delete"; kid: SettingsKid } | null;

const THEME_LABEL: Record<SettingsKid["uiTheme"], string> = { tieu_hoc: "Tiểu học", thcs: "THCS", auto: "tự động" };

/** Hồ sơ của con: đổi tên, lớp, cấp, đặt lại tiến độ, xóa (gõ đúng tên) — mỗi thao tác qua hộp thoại xác nhận. */
export function ProfilesPanel({ kids, levels, maxKids }: { kids: SettingsData["kids"]; levels: SettingsData["levels"]; maxKids: number }) {
  const { save } = useSave();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  function open(kind: NonNullable<Dialog>["kind"], kid: SettingsKid) {
    setError(undefined);
    setValue(kind === "rename" ? kid.name : kind === "grade" ? String(kid.grade ?? 1) : kind === "level" ? String(kid.levelNumber) : "");
    setDialog({ kind, kid });
  }

  /** Chạy hành động của hộp thoại: lỗi thì giữ hộp mở và báo ngay trong hộp (trả về false). */
  async function confirm(action: () => ReturnType<typeof renameLearnerAction>, message: string): Promise<boolean> {
    const result = await save(action, message);
    if (!result.ok) {
      setError(result.message);
      return false;
    }
    return true;
  }

  const kid = dialog?.kid;
  return (
    <AdultCard className={styles.sec}>
      <AdultCardHead
        title="Hồ sơ của con"
        sub={`${kids.length} hồ sơ · tối đa ${maxKids} hồ sơ mỗi tài khoản gia đình`}
        right={<AdultButtonLink href="/profiles/new" label="Thêm hồ sơ" icon="plus" variant="secondary" aria-disabled={kids.length >= maxKids || undefined} tabIndex={kids.length >= maxKids ? -1 : undefined} />}
      />
      {kids.length === 0 ? (
        <AdultEmpty title="Chưa có hồ sơ nào" text="Thêm hồ sơ để con bắt đầu học." action={<AdultButtonLink href="/profiles/new" label="Thêm hồ sơ" icon="plus" />} />
      ) : (
        kids.map((k) => (
          <div key={k.id} className={styles.kidrow} data-level={k.levelNumber}>
            <Avatar name={k.name} level={k.levelNumber} hair={k.hair} size={44} />
            <div>
              <b className={adultStyles.h3}>{k.name}</b>
              <br />
              <span className={cn(adultStyles.small, adultStyles.muted)}>{k.grade ? `Lớp ${k.grade} · ` : ""}</span>
              <LevelChip level={k.levelNumber} name={k.levelName} plain />
              <span className={cn(adultStyles.small, adultStyles.muted)}> · Giao diện {THEME_LABEL[k.uiTheme]}</span>
            </div>
            <div className={styles.acts}>
              <AdultButton label="Đổi tên" size="s" variant="secondary" onClick={() => open("rename", k)} />
              <AdultButton label="Đổi lớp" size="s" variant="secondary" onClick={() => open("grade", k)} />
              <AdultButton label="Đổi cấp" size="s" variant="secondary" onClick={() => open("level", k)} />
              <AdultButton label="Đặt lại tiến độ" size="s" variant="dangerOutline" onClick={() => open("reset", k)} />
              <AdultIconButton icon="trash" label={`Xóa hồ sơ ${k.name}`} onClick={() => open("delete", k)} />
            </div>
          </div>
        ))
      )}

      <AdultDialog
        open={dialog?.kind === "rename"}
        onClose={() => setDialog(null)}
        title="Đổi tên hồ sơ"
        actions={[
          { label: "Hủy" },
          {
            label: "Lưu tên",
            variant: "primary",
            onClick: () => {
              const message = validateName(value);
              if (message) return (setError(message), false);
              return confirm(() => renameLearnerAction({ learnerId: kid!.id, name: value }), `Đã đổi tên thành ${value.trim()}.`);
            },
          },
        ]}
      >
        <AdultInput label="Tên hiển thị" required value={value} onChange={(e) => (setValue(e.target.value), setError(undefined))} error={error} hint="Bông sẽ gọi con bằng tên này. Tối đa 20 ký tự." />
      </AdultDialog>

      <AdultDialog
        open={dialog?.kind === "grade"}
        onClose={() => setDialog(null)}
        title={`Đổi lớp cho ${kid?.name ?? ""}`}
        actions={[{ label: "Hủy" }, { label: "Lưu lớp", variant: "primary", onClick: () => confirm(() => changeGradeAction({ learnerId: kid!.id, grade: Number(value) }), `${kid!.name} giờ học lớp ${value}.`) }]}
      >
        <AdultSelect label="Lớp ở trường" value={value} onChange={(e) => setValue(e.target.value)} options={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => [g, `Lớp ${g}`] as const)} hint="Dùng để gợi ý bài theo Unit SGK. Giao diện “Tự động” sẽ đổi theo lớp." error={error} />
      </AdultDialog>

      <AdultDialog
        open={dialog?.kind === "level"}
        onClose={() => setDialog(null)}
        title={`Đổi cấp cho ${kid?.name ?? ""}`}
        wide
        actions={[
          { label: "Hủy" },
          { label: "Đổi cấp", variant: "primary", onClick: () => confirm(() => changeLevelAction({ learnerId: kid!.id, level: Number(value) }), `${kid!.name} chuyển sang cấp ${value} · ${levels.find((l) => l.number === Number(value))?.name ?? ""}.`) },
        ]}
      >
        <div className={styles.lvsel} role="radiogroup" aria-label="Cấp">
          {levels.map((l) => (
            <button key={l.number} type="button" role="radio" data-level={l.number} aria-checked={Number(value) === l.number} onClick={() => setValue(String(l.number))}>
              <i />
              Cấp {l.number}
              <span className={cn(adultStyles.small, adultStyles.muted)} style={{ fontWeight: 400 }}>
                {l.name}
              </span>
            </button>
          ))}
        </div>
        <div className={cn(styles.warnbox, adultStyles.small)}>
          <Icon name="info" size={16} />
          <span>Lên cấp: các bài ở cấp thấp hơn được tính là đã qua. Xuống cấp: tiến độ cũ vẫn giữ, con học lại từ đầu cấp mới.</span>
        </div>
        {error && (
          <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
            {error}
          </p>
        )}
      </AdultDialog>

      <AdultDialog
        open={dialog?.kind === "reset"}
        onClose={() => setDialog(null)}
        title={`Đặt lại tiến độ của ${kid?.name ?? ""}?`}
        actions={[{ label: "Hủy" }, { label: "Đặt lại tiến độ", variant: "danger", onClick: () => confirm(() => resetProgressAction({ learnerId: kid!.id }), `Đã đặt lại tiến độ của ${kid!.name}.`) }]}
      >
        <p style={{ margin: 0 }}>
          Toàn bộ sao, xu, XP, chuỗi ngày, từ đã thuộc và bài đã qua sẽ về 0. Hồ sơ, cài đặt và cấp hiện tại được giữ. <b>Không hoàn tác được.</b>
        </p>
        {error && (
          <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
            {error}
          </p>
        )}
      </AdultDialog>

      <AdultDialog
        open={dialog?.kind === "delete"}
        onClose={() => setDialog(null)}
        title={`Xóa hồ sơ ${kid?.name ?? ""}?`}
        actions={[
          { label: "Hủy" },
          {
            label: "Xóa hồ sơ",
            variant: "danger",
            icon: "trash",
            onClick: () => {
              if (value.trim() === "") return (setError("Gõ tên con để xác nhận."), false);
              return confirm(() => deleteLearnerAction({ learnerId: kid!.id, confirmName: value }), `Đã xóa hồ sơ ${kid!.name}.`);
            },
          },
        ]}
      >
        <p style={{ margin: 0 }}>
          Hồ sơ, tiến độ và kết quả học của {kid?.name} sẽ bị xóa vĩnh viễn. <b>Không hoàn tác được.</b>
        </p>
        <AdultInput label={`Gõ “${kid?.name ?? ""}” để xác nhận`} required value={value} onChange={(e) => (setValue(e.target.value), setError(undefined))} error={error} />
      </AdultDialog>
    </AdultCard>
  );
}
