"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { Button, Card, Icon, IconButton, TextField } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { loginAction, type AuthFormState } from "./actions";
import { guarded } from "./guard";
import styles from "./auth.module.css";

const initial: AuthFormState = { status: "idle" };
const submit = guarded(loginAction);

/** Đăng nhập tài khoản gia đình (Screen01): bình thường, đang tải, trống, lỗi mạng. */
export function LoginForm() {
  const [state, action, pending] = useActionState(submit, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim() !== "" && password !== "";
  const empty = email === "" && password === "";

  // Nút có nhãn Enter phải phản hồi Enter kể cả khi focus không ở trong ô nhập.
  useHotkeys({ Enter: () => formRef.current?.requestSubmit() }, { enabled: canSubmit && !pending });

  return (
    <Card className={styles.card}>
      <form ref={formRef} action={action} className={styles.form} aria-label="Đăng nhập" noValidate>
        <div>
          <h1 className={styles.heading}>Đăng nhập</h1>
          <p className={styles.sub}>Tài khoản gia đình — dành cho bố mẹ</p>
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
          autoComplete="current-password"
          placeholder="Ít nhất 8 ký tự"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={pending}
          labelAction={<Button type="button" variant="ghost" size="s" label="Quên mật khẩu?" />}
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
          error={state.message ?? state.fieldErrors?.password}
          hint={empty && !state.message ? "Nhập email và mật khẩu để tiếp tục." : undefined}
        />

        {pending ? (
          <Button type="submit" size="l" block disabled>
            <span className={styles.busy}>
              <span className={styles.spin} />
              Đang đăng nhập…
            </span>
          </Button>
        ) : state.connection ? (
          <Button type="submit" size="l" block icon="replay" label="Thử lại" />
        ) : (
          <Button type="submit" size="l" block label="Đăng nhập" shortcut="Enter" disabled={!canSubmit} />
        )}

        <p className={styles.foot}>
          Chưa có tài khoản? <Link href="/register">Tạo tài khoản gia đình</Link>
        </p>
      </form>
    </Card>
  );
}
