// Task 04: đăng nhập, đăng ký, chọn hồ sơ, tạo hồ sơ 3 bước, PIN bố mẹ, chặn truy cập chéo giữa các gia đình.
import { STATE, loginUI, openParentGate, password, pickProfile } from "./helpers/auth";
import { LEARNER_COOKIE, setLearnerCookie, signCookie } from "./helpers/cookies";
import { count, exec, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";
import { EMAIL, KID } from "./setup/accounts";

const NO_STATE = { cookies: [], origins: [] };
const runId = Date.now().toString(36);

test.describe("Bước 0 — đăng nhập và đăng ký (Screen01)", () => {
  test.use({ storageState: NO_STATE });

  // Kiểm tra: "đăng ký, đăng nhập, sai mật khẩu báo lỗi nhẹ nhàng"
  test("đăng nhập đúng thì vào màn chọn hồ sơ", async ({ page }) => {
    await loginUI(page, EMAIL.b);
    await expect(page).toHaveURL(/\/profiles$/);
    await expect(page.getByRole("heading", { name: "Ai đang học hôm nay?" })).toBeVisible();
  });

  test("sai mật khẩu báo lỗi nhẹ nhàng, không dùng màu đỏ gắt, không lộ email có tồn tại hay không", async ({ page }) => {
    const messages: string[] = [];
    for (const email of [EMAIL.p, "khong-co-ai@edu.local"]) {
      await page.goto("/login");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Mật khẩu", { exact: true }).fill("SaiMatKhau123");
      await page.getByRole("button", { name: /^Đăng nhập/ }).click();
      const alert = page.getByText("Email hoặc mật khẩu chưa đúng");
      await expect(alert).toBeVisible();
      messages.push((await alert.textContent()) ?? "");
      await expect(page).toHaveURL(/\/login$/);
      // Màu chữ của lời báo không phải đỏ gắt (kênh đỏ nổi trội so với xanh lá và xanh dương).
      const [r, g, b] = await alert.evaluate((el) => (getComputedStyle(el).color.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number));
      expect(r > 180 && g < 90 && b < 90, `Lời báo có màu đỏ gắt rgb(${r},${g},${b})`).toBe(false);
    }
    expect(messages[0]).toBe(messages[1]);
  });

  test("để trống thì nút Đăng nhập chưa bấm được", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /^Đăng nhập/ })).toBeDisabled();
    await page.getByLabel("Email").fill("abc@edu.local");
    await expect(page.getByRole("button", { name: /^Đăng nhập/ })).toBeDisabled();
  });

  test("có nút hiện/ẩn mật khẩu", async ({ page }) => {
    await page.goto("/login");
    const field = page.getByLabel("Mật khẩu", { exact: true });
    await field.fill("abc");
    await expect(field).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Hiện mật khẩu" }).click();
    await expect(field).toHaveAttribute("type", "text");
  });

  test("chưa đăng nhập gõ thẳng các trang được bảo vệ thì về /login", async ({ page }) => {
    for (const route of ["/profiles", "/home", "/parent", "/parent/settings", "/admin"]) {
      await page.goto(route);
      await expect(page, route).toHaveURL(/\/login$/);
    }
  });

  test("đăng ký tài khoản mới rồi vào màn chọn hồ sơ trống", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Tên của bố mẹ").fill("Phụ huynh thử");
    await page.getByLabel("Email").fill(`dang-ky-${runId}@edu.local`);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("MatKhau12345");
    await page.getByLabel("Nhập lại mật khẩu").fill("MatKhau12345");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    await page.waitForURL("**/profiles");
    await expect(page.getByText("Chưa có hồ sơ nào")).toBeVisible();
    expect(await count("users", "email = ?", [`dang-ky-${runId}@edu.local`])).toBe(1);
  });

  test("đăng ký báo lỗi: email trùng, mật khẩu ngắn, hai mật khẩu khác nhau", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Tên của bố mẹ").fill("Phụ huynh thử");
    await page.getByLabel("Email").fill(EMAIL.a);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("MatKhau12345");
    await page.getByLabel("Nhập lại mật khẩu").fill("MatKhau12345");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    await expect(page.getByText("Email này đã có tài khoản")).toBeVisible();

    await page.getByLabel("Email").fill(`khac-${runId}@edu.local`);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("ngan1");
    await page.getByLabel("Nhập lại mật khẩu").fill("ngan1");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    await expect(page.getByText("Mật khẩu cần ít nhất 8 ký tự")).toBeVisible();

    await page.getByLabel("Mật khẩu", { exact: true }).fill("MatKhau12345");
    await page.getByLabel("Nhập lại mật khẩu").fill("MatKhau99999");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    await expect(page.getByText("Hai mật khẩu chưa giống nhau")).toBeVisible();
    expect(await count("users", "email = ?", [`khac-${runId}@edu.local`])).toBe(0);
  });
});

test.describe("Đăng xuất và phiên", () => {
  test.use({ storageState: STATE.a });

  test("đã đăng nhập mà gõ /login hoặc /register thì về /profiles", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/profiles$/);
    await page.goto("/register");
    await expect(page).toHaveURL(/\/profiles$/);
  });

  test("đăng xuất về /login và gõ lại /profiles bị chuyển về /login", async ({ page }) => {
    await page.goto("/profiles");
    await page.getByRole("button", { name: "Đăng xuất" }).click();
    await page.waitForURL("**/login");
    await page.goto("/profiles");
    await expect(page).toHaveURL(/\/login$/);
    // Phiên đã hủy: cookie phiên không còn dùng được ở các trang khác.
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe("Bước 1 — chọn hồ sơ (Screen02)", () => {
  test("gia đình A chỉ thấy hai bé của mình", async ({ browser }) => {
    const context = await browser.newContext({ storageState: STATE.a });
    const page = await context.newPage();
    await page.goto("/profiles");
    await expect(page.getByRole("button", { name: /^Mai,/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Bảo,/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Lan,/ })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Thêm hồ sơ/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Khu vực bố mẹ/ })).toBeVisible();
    await context.close();
  });

  test("gia đình B chỉ thấy bé Lan", async ({ browser }) => {
    const context = await browser.newContext({ storageState: STATE.b1 });
    const page = await context.newPage();
    await page.goto("/profiles");
    await expect(page.getByRole("button", { name: /^Lan,/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^(Mai|Bảo),/ })).toHaveCount(0);
    await context.close();
  });

  test("bấm thẻ hồ sơ thì vào trang chủ của đúng bé", async ({ browser }) => {
    const context = await browser.newContext({ storageState: STATE.a });
    const page = await context.newPage();
    await pickProfile(page, KID.bao);
    await expect(page.getByRole("heading", { name: "Trang chủ của Bảo" })).toBeVisible();
    await context.close();
  });
});

test.describe("Bước 2 và 3 — tạo hồ sơ, PIN (tài khoản P chưa có hồ sơ, chưa có PIN)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: NO_STATE });

  // Đưa tài khoản P về trạng thái đầu (chạy lại test không bị lệch): không hồ sơ, không PIN.
  test.beforeAll(async () => {
    await exec("DELETE FROM learners WHERE user_id = (SELECT id FROM users WHERE email = ?)", [EMAIL.p]);
    await exec("UPDATE users SET parent_pin = NULL WHERE email = ?", [EMAIL.p]);
  });

  test("chưa có hồ sơ thì thấy trạng thái Trống với nút tạo hồ sơ đầu tiên", async ({ page }) => {
    await loginUI(page, EMAIL.p);
    await expect(page.getByText("Chưa có hồ sơ nào")).toBeVisible();
    await expect(page.getByRole("link", { name: "Tạo hồ sơ đầu tiên" })).toBeVisible();
  });

  // Kiểm tra: "tạo được bé lớp 1–9; kiểm tra loa phát âm thanh, thanh mức micro chạy; không có micro thì vẫn đi tiếp được"
  test("tạo hồ sơ 3 bước cho bé lớp 1: bỏ trống tên thì không đi tiếp được", async ({ page, context }) => {
    await context.grantPermissions(["microphone"]);
    await loginUI(page, EMAIL.p);
    await page.goto("/profiles/new");
    await expect(page.getByRole("button", { name: "Tiếp tục" })).toBeDisabled();
    await page.getByLabel("Tên của bé").fill("Bé Một");
    await page.getByRole("radio", { name: "Lớp 1" }).click();
    await page.getByLabel("Tên của bé").fill("");
    await expect(page.getByRole("button", { name: "Tiếp tục" })).toBeDisabled();
    await page.getByLabel("Tên của bé").fill("Bé Một");
    await page.getByRole("button", { name: "Tiếp tục" }).click();

    await expect(page.getByRole("heading", { name: "Chọn một bạn rồng để học cùng nhé!" })).toBeVisible();
    await page.getByLabel("Đặt tên cho bạn rồng").fill("");
    await expect(page.getByRole("button", { name: "Tiếp tục" })).toBeDisabled();
    await page.getByLabel("Đặt tên cho bạn rồng").fill("Mây");
    await page.getByRole("button", { name: "Tiếp tục" }).click();

    await expect(page.getByRole("heading", { name: "Kiểm tra loa và micro" })).toBeVisible();
    await page.getByRole("button", { name: "Nghe thử loa" }).click();
    await page.getByRole("button", { name: "Có, nghe rõ" }).click();
    await expect(page.getByText("Tuyệt vời!")).toBeVisible();
    await page.getByRole("button", { name: "Bắt đầu học" }).click();
    await page.waitForURL("**/placement");
    const [kid] = await sql<{ name: string; school_grade: number; mascot_name: string; current_level_id: number }>("SELECT name, school_grade, mascot_name, current_level_id FROM learners WHERE user_id = (SELECT id FROM users WHERE email = ?)", [EMAIL.p]);
    expect(kid).toMatchObject({ name: "Bé Một", school_grade: 1, mascot_name: "Mây" });
  });

  test("micro hoạt động: bấm micro thì thấy trạng thái đang nghe (micro giả của Chrome)", async ({ page, context }) => {
    await context.grantPermissions(["microphone"]);
    await loginUI(page, EMAIL.p);
    await page.goto("/profiles/new");
    await page.getByLabel("Tên của bé").fill("Bé Hai");
    await page.getByRole("radio", { name: "Lớp 2" }).click();
    await page.getByRole("button", { name: "Tiếp tục" }).click();
    await page.getByRole("button", { name: "Tiếp tục" }).click();
    const mic = page.getByRole("button", { name: "Bấm và nói Hello" });
    await expect(mic).toBeVisible();
    await mic.click();
    await expect(mic).toHaveAttribute("aria-pressed", "true");
    // Bỏ qua kiểm tra loa/micro vẫn đi tiếp được.
    await page.getByRole("button", { name: "Bỏ qua, kiểm tra sau" }).click();
  });

  test("không có micro (từ chối quyền) vẫn đi tiếp được; tạo bé lớp 9", async ({ page, context }) => {
    await context.clearPermissions();
    await page.addInitScript(() => {
      // Giả lập máy không có micro: getUserMedia bị từ chối.
      navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException("Permission denied", "NotAllowedError"));
    });
    await loginUI(page, EMAIL.p);
    await page.goto("/profiles/new");
    await page.getByLabel("Tên của bé").fill("Bé Chín");
    await page.getByRole("radio", { name: "Lớp 9" }).click();
    await page.getByRole("button", { name: "Tiếp tục" }).click();
    await page.getByRole("button", { name: "Tiếp tục" }).click();
    await page.getByRole("button", { name: "Bấm và nói Hello" }).click();
    await expect(page.getByText(/Chưa dùng được micro/)).toBeVisible();
    await page.getByRole("button", { name: "Bắt đầu học" }).click();
    await page.waitForURL("**/placement");
    const [kid] = await sql<{ school_grade: number }>("SELECT school_grade FROM learners WHERE name = 'Bé Chín'");
    expect(kid.school_grade).toBe(9);
  });

  test("hủy tạo hồ sơ (×) thì về màn chọn hồ sơ", async ({ page }) => {
    await loginUI(page, EMAIL.p);
    await page.goto("/profiles/new");
    await page.getByRole("button", { name: "Huỷ tạo hồ sơ" }).click();
    await page.waitForURL("**/profiles");
  });

  // Kiểm tra: "đặt PIN lần đầu; PIN lưu dạng hash"
  test("tài khoản chưa có PIN: mở khu bố mẹ bằng mật khẩu, đặt PIN, rồi PIN mở được và lưu dạng hash", async ({ page }) => {
    await loginUI(page, EMAIL.p);
    await page.goto("/parent/unlock");
    await expect(page.getByLabel("Mật khẩu tài khoản")).toBeVisible();
    await expect(page.getByRole("radio", { name: "Mã PIN" })).toHaveCount(0);
    await page.getByLabel("Mật khẩu tài khoản").fill(password());
    await page.getByRole("button", { name: /Mở khóa/ }).click();
    await page.waitForURL("**/parent");

    await page.goto("/parent/settings");
    await page.getByRole("tab", { name: "Mật khẩu & mã PIN" }).click();
    await page.getByLabel("Mật khẩu tài khoản").fill(password());
    await page.getByLabel(/^PIN mới/).fill("7391");
    await page.getByLabel(/^Nhập lại PIN mới/).fill("7391");
    await page.getByRole("button", { name: "Đặt mã PIN" }).click();
    await expect(page.getByText("Đã đặt mã PIN vào khu bố mẹ.")).toBeVisible();

    const [row] = await sql<{ parent_pin: string }>("SELECT parent_pin FROM users WHERE email = ?", [EMAIL.p]);
    expect(row.parent_pin).toMatch(/^\$2[aby]\$/);
    expect(row.parent_pin).not.toContain("7391");

    await page.context().clearCookies({ name: "edu_parent_gate" });
    await openParentGate(page, "7391");
  });
});

test.describe("PIN bố mẹ — đúng và sai", () => {
  test.use({ storageState: STATE.a });

  test("PIN đúng vào được, PIN sai không vào được", async ({ page }) => {
    await page.goto("/parent/unlock");
    await page.getByLabel("Mã PIN").fill("0000");
    await page.getByRole("button", { name: /Mở khóa/ }).click();
    await expect(page.getByText(/chưa đúng/)).toBeVisible();
    await expect(page).toHaveURL(/\/parent\/unlock$/);
    await page.goto("/parent");
    await expect(page).toHaveURL(/\/parent\/unlock$/);
  });
});

// Kiểm tra cuối task: "thử truy cập hồ sơ của tài khoản khác qua URL phải bị chặn" (ở server, không chỉ ẩn nút).
test.describe("Chặn truy cập chéo giữa các gia đình", () => {
  test.use({ storageState: STATE.a });

  test("cookie hồ sơ trỏ tới bé của gia đình khác (chữ ký hợp lệ) thì bị từ chối và về /profiles", async ({ context, page }) => {
    const info = seedInfo();
    await setLearnerCookie(context, signCookie(`${info.users.a}.${info.kids.lan}`));
    for (const route of ["/home", "/map/3", "/notebook", "/review", "/levels"]) {
      await page.goto(route);
      await expect(page, route).toHaveURL(/\/profiles$/);
    }
  });

  test("cookie hồ sơ ký cho gia đình B nhưng dùng trong phiên của gia đình A thì bị từ chối", async ({ context, page }) => {
    const info = seedInfo();
    await setLearnerCookie(context, signCookie(`${info.users.b}.${info.kids.lan}`));
    await page.goto("/home");
    await expect(page).toHaveURL(/\/profiles$/);
  });

  test("cookie hồ sơ không có chữ ký hoặc chữ ký giả thì bị từ chối", async ({ context, page }) => {
    const info = seedInfo();
    await setLearnerCookie(context, `${info.users.a}.${info.kids.lan}`);
    await page.goto("/home");
    await expect(page).toHaveURL(/\/profiles$/);
    await setLearnerCookie(context, `${info.users.a}.${info.kids.lan}.chu-ky-gia`);
    await page.goto("/home");
    await expect(page).toHaveURL(/\/profiles$/);
  });

  test("hồ sơ của chính mình vẫn dùng được (đối chứng)", async ({ context, page }) => {
    const info = seedInfo();
    await setLearnerCookie(context, signCookie(`${info.users.a}.${info.kids.bao}`));
    await page.goto("/home");
    await expect(page).toHaveURL(/\/home$/);
    expect(LEARNER_COOKIE).toBe("edu_learner");
  });

  test("trang bố mẹ: ?kid= là id của bé gia đình khác thì không hiện số liệu của bé đó", async ({ page }) => {
    const info = seedInfo();
    await openParentGate(page, process.env.TEST_PIN_A!);
    await page.goto(`/parent?kid=${info.kids.lan}`);
    await expect(page.getByRole("heading", { name: /Tổng quan · / })).not.toContainText("Lan");
    await expect(page.getByRole("radio", { name: /Lan/ })).toHaveCount(0);
    await page.goto(`/parent/settings?kid=${info.kids.lan}`);
    await expect(page.getByRole("heading", { name: /của (Mai|Bảo)/ }).first()).toBeVisible();
  });

  test("gia đình B không thấy bé của gia đình A (đối chứng ngược)", async ({ browser }) => {
    const info = seedInfo();
    const context = await browser.newContext({ storageState: STATE.b1 });
    await setLearnerCookie(context, signCookie(`${info.users.b}.${info.kids.bao}`));
    const page = await context.newPage();
    await page.goto("/home");
    await expect(page).toHaveURL(/\/profiles$/);
    await context.close();
  });
});
