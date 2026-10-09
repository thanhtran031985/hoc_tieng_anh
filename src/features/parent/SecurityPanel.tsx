"use client";

import { useState } from "react";
import { AdultButton, AdultCard, AdultCardHead, AdultInput } from "@/components/adult";
import { validateNewPassword, validateNewPin } from "@/lib/rules/parent-settings";
import { changeParentPinAction, changePasswordAction, type SettingsActionResult } from "./settings-actions";
import styles from "./settings.module.css";
import { useSave } from "./use-save";

type Errors = Record<string, string | undefined>;

const digits = (value: string) => value.replace(/\D/g, "").slice(0, 6);

/** Đổi mật khẩu tài khoản (≥ 8 ký tự có chữ và số) và PIN vào khu bố mẹ (4–6 số, không quá dễ đoán). */
export function SecurityPanel({ email, hasPin }: { email: string; hasPin: boolean }) {
  const password = usePasswordForm();
  const pin = usePinForm(hasPin);

  return (
    <>
      <AdultCard className={styles.sec} id="pw">
        <AdultCardHead title="Đổi mật khẩu tài khoản" sub={`Tài khoản gia đình · ${email}`} />
        <div className={styles.row2}>
          <AdultInput label="Mật khẩu hiện tại" type="password" autoComplete="current-password" required value={password.current} onChange={(e) => password.set("current", e.target.value)} error={password.errors.current} />
          <span />
          <AdultInput label="Mật khẩu mới" type="password" autoComplete="new-password" required hint="Nhập tự do, không giới hạn ký tự" value={password.next} onChange={(e) => password.set("password", e.target.value)} onBlur={password.validateNext} error={password.errors.password} />
          <AdultInput label="Nhập lại mật khẩu mới" type="password" autoComplete="new-password" required value={password.confirm} onChange={(e) => password.set("confirm", e.target.value)} error={password.errors.confirm} />
        </div>
        {password.errors.form && <p role="alert">{password.errors.form}</p>}
        <div className={styles.savebar}>
          <AdultButton label="Đổi mật khẩu" icon="lock" onClick={() => void password.submit()} loading={password.pending} />
        </div>
      </AdultCard>

      <AdultCard className={styles.sec} id="pin">
        <AdultCardHead title={hasPin ? "Đổi mã PIN vào khu bố mẹ" : "Đặt mã PIN vào khu bố mẹ"} sub="PIN 4–6 chữ số, dùng thay mật khẩu trên máy của con" />
        <div className={styles.row3}>
          <AdultInput
            label={hasPin ? "PIN hiện tại" : "Mật khẩu tài khoản"}
            type="password"
            inputMode={hasPin ? "numeric" : undefined}
            maxLength={hasPin ? 6 : undefined}
            autoComplete="off"
            required
            hint={hasPin ? undefined : "Chưa có PIN: nhập mật khẩu để đặt PIN lần đầu."}
            value={pin.current}
            onChange={(e) => pin.set("current", hasPin ? digits(e.target.value) : e.target.value)}
            error={pin.errors.current}
          />
          <AdultInput label="PIN mới" type="password" inputMode="numeric" maxLength={6} autoComplete="off" required value={pin.next} onChange={(e) => pin.set("pin", digits(e.target.value))} onBlur={pin.validateNext} error={pin.errors.pin} />
          <AdultInput label="Nhập lại PIN mới" type="password" inputMode="numeric" maxLength={6} autoComplete="off" required value={pin.confirm} onChange={(e) => pin.set("confirmPin", digits(e.target.value))} error={pin.errors.confirmPin} />
        </div>
        {pin.errors.form && <p role="alert">{pin.errors.form}</p>}
        <div className={styles.savebar}>
          <AdultButton label={hasPin ? "Đổi mã PIN" : "Đặt mã PIN"} icon="key" onClick={() => void pin.submit()} loading={pin.pending} />
        </div>
      </AdultCard>
    </>
  );
}

function usePasswordForm() {
  const { pending, save } = useSave();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const set = (field: "current" | "password" | "confirm", value: string) => {
    (field === "current" ? setCurrent : field === "password" ? setNext : setConfirm)(value);
    setErrors((e) => ({ ...e, [field]: undefined, form: undefined }));
  };
  const validateNext = () => setErrors((e) => ({ ...e, password: validateNewPassword(next) || undefined }));

  async function submit() {
    const found: Errors = {
      current: current ? undefined : "Nhập mật khẩu hiện tại.",
      password: validateNewPassword(next) || undefined,
      confirm: confirm ? (confirm === next ? undefined : "Hai mật khẩu mới chưa khớp nhau.") : "Nhập lại mật khẩu mới.",
    };
    setErrors(found);
    if (found.current || found.password || found.confirm) return;
    const result: SettingsActionResult = await save(() => changePasswordAction({ current, password: next, confirm }), "Đã đổi mật khẩu tài khoản.");
    if (result.ok) {
      setCurrent("");
      setNext("");
      setConfirm("");
    } else setErrors(result.field && ["current", "password", "confirm"].includes(result.field) ? { [result.field]: result.message } : { form: result.message });
  }
  return { pending, current, next, confirm, errors, set, validateNext, submit };
}

function usePinForm(hasPin: boolean) {
  const { pending, save } = useSave();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const set = (field: "current" | "pin" | "confirmPin", value: string) => {
    (field === "current" ? setCurrent : field === "pin" ? setNext : setConfirm)(value);
    setErrors((e) => ({ ...e, [field]: undefined, form: undefined }));
  };
  const validateNext = () => setErrors((e) => ({ ...e, pin: validateNewPin(next) || undefined }));

  async function submit() {
    const found: Errors = {
      current: current ? undefined : hasPin ? "Nhập PIN hiện tại." : "Nhập mật khẩu tài khoản.",
      pin: validateNewPin(next) || undefined,
      confirmPin: confirm === next ? undefined : "Hai mã PIN chưa khớp nhau.",
    };
    setErrors(found);
    if (found.current || found.pin || found.confirmPin) return;
    const result = await save(() => changeParentPinAction({ current, pin: next, confirmPin: confirm }), hasPin ? "Đã đổi mã PIN vào khu bố mẹ." : "Đã đặt mã PIN vào khu bố mẹ.");
    if (result.ok) {
      setCurrent("");
      setNext("");
      setConfirm("");
    } else setErrors(result.field && ["current", "pin", "confirmPin"].includes(result.field) ? { [result.field]: result.message } : { form: result.message });
  }
  return { pending, current, next, confirm, errors, set, validateNext, submit };
}
