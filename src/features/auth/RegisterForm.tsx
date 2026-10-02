"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { Button, Card, Icon, IconButton, TextField } from "@/components/ui";
import { MIN_PASSWORD_LENGTH } from "@/lib/schemas";
import { useHotkeys } from "@/lib/use-hotkeys";
import { registerAction, type AuthFormState } from "./actions";
import { guarded } from "./guard";
import styles from "./auth.module.css";

const initial: AuthFormState = { status: "idle" };
const submit = guarded(registerAction);

/** Tạo tài khoản gia đình: tên bố mẹ, email, mật khẩu (nhập hai lần). Cùng bốn trạng thái với màn đăng nhập. */
export function RegisterForm() {
  const [state, action, pending] = useActionState(submit, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = name.trim() !== "" && email.trim() !== "" && password !== "" && confirm !== "";
  const empty = name === "" && email === "" && password === "" && confirm === "";

  useHotkeys({ Enter: () => formRef.current?.requestSubmit() }, { enabled: canSubmit && !pending });

  return (
    <Card className={styles.card}>
      <form ref={formRef} action={action} className={styles.form} aria-label="Tạo tài khoản gia đình" noValidate>
        <div>
          <h1 className={styles.heading}>Tạo tài khoản</h1>
          <p className={styles.sub}>Một tài khoản cho cả nhà — bố mẹ tạo hồ sơ cho từng bé sau.</p>
        </div>

        {state.connection && (
          <div className={styles.alert} role="alert">
            <span className={styles.alertIcon}>
              <Icon name="wifi" size={28} />
            </span>
            <div>
              <b className={styles.alertTitle}>Chưa kết nối được</b>
              <div className={styles.alertText}>Kiểm tra mạng Wi-Fi rồi bấm Thử lại nhé.</div>
            </div>
          </div>
        )}

        <TextField
          label="Tên của bố mẹ"
          name="name"
          autoComplete="name"
          placeholder="vd. Nguyễn Gia"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={pending}
          error={state.fieldErrors?.name}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder="vd. nguyen.gia@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
          error={state.fieldErrors?.email}
        />
        <TextField
          label="Mật khẩu"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder={`Ít nhất ${MIN_PASSWORD_LENGTH} ký tự`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={pending}
          adornment={
            <IconButton
              icon="eye"
              iconSize={22}
              label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
              disabled={pending}
            />
          }
          error={state.fieldErrors?.password}
        />
        <TextField
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={pending}
          error={state.fieldErrors?.confirmPassword}
          hint={empty ? "Điền đủ các ô để tiếp tục." : undefined}
        />

        {pending ? (
          <Button type="submit" size="l" block disabled>
            <span className={styles.busy}>
              <span className={styles.spin} />
              Đang tạo tài khoản…
            </span>
          </Button>
        ) : state.connection ? (
          <Button type="submit" size="l" block icon="replay" label="Thử lại" />
        ) : (
          <Button type="submit" size="l" block label="Tạo tài khoản" shortcut="Enter" disabled={!canSubmit} />
        )}

        <p className={styles.foot}>
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </p>
      </form>
    </Card>
  );
}
