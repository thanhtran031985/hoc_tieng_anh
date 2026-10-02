"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Dialog, TextField } from "@/components/ui";
import { setParentPinAction, unlockParentAction, type ParentGateResult } from "./actions";
import styles from "./parent.module.css";

type Props = { hasPin: boolean };

/**
 * Nút "Bố mẹ" (ổ khóa) và hộp thoại cổng bố mẹ. Đã có PIN: nhập PIN hoặc mật khẩu tài khoản.
 * Chưa có PIN: đặt PIN lần đầu (nhập mật khẩu tài khoản và PIN 4–6 số hai lần).
 */
export function ParentGate({ hasPin }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const ready = hasPin ? secret !== "" : password !== "" && pin !== "" && confirmPin !== "";

  function close() {
    setOpen(false);
    setSecret("");
    setPassword("");
    setPin("");
    setConfirmPin("");
    setError(null);
  }

  async function submit() {
    if (!ready || pending) return;
    setPending(true);
    setError(null);
    let result: ParentGateResult;
    try {
      result = hasPin ? await unlockParentAction(secret) : await setParentPinAction({ password, pin, confirmPin });
    } catch {
      result = { ok: false, message: "Chưa kết nối được. Bố mẹ kiểm tra mạng rồi thử lại nhé." };
    }
    setPending(false);
    if (result.ok) {
      router.push("/parent");
      return;
    }
    setError(result.message);
    setSecret("");
  }

  const enterToSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void submit();
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="s"
        icon="lock"
        label="Bố mẹ"
        aria-label="Khu vực bố mẹ (cần PIN hoặc mật khẩu)"
        onClick={() => setOpen(true)}
      />
      <Dialog
        open={open}
        onClose={close}
        title={hasPin ? "Khu vực của bố mẹ" : "Đặt PIN cho bố mẹ"}
        body={
          <form
            className={styles.form}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <p className={styles.intro}>
              {hasPin
                ? "Bố mẹ nhập PIN (hoặc mật khẩu tài khoản) để xem báo cáo học tập, giới hạn thời gian và quản lý hồ sơ."
                : "PIN 4–6 số giúp bé không tự vào khu vực của bố mẹ. Lần sau chỉ cần nhập PIN."}
            </p>
            {hasPin ? (
              <TextField
                label="PIN hoặc mật khẩu"
                name="secret"
                type="password"
                autoComplete="off"
                placeholder="PIN hoặc mật khẩu tài khoản"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                onKeyDown={enterToSubmit}
                disabled={pending}
              />
            ) : (
              <>
                <TextField
                  label="Mật khẩu tài khoản"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={enterToSubmit}
                  disabled={pending}
                />
                <TextField
                  label="PIN mới (4–6 số)"
                  name="pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="off"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={enterToSubmit}
                  disabled={pending}
                />
                <TextField
                  label="Nhập lại PIN"
                  name="confirmPin"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="off"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={enterToSubmit}
                  disabled={pending}
                />
              </>
            )}
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <button type="submit" hidden />
          </form>
        }
        actions={[
          { label: hasPin ? "Mở khoá" : "Đặt PIN", variant: "primary", shortcut: "Enter", onClick: () => void submit(), keepOpen: true, disabled: !ready || pending },
          { label: "Để sau", variant: "secondary" },
        ]}
      />
    </>
  );
}
