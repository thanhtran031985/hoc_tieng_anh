// Kiểm tra chung cho mọi màn (PRD Phần B): vừa màn không cuộn, bàn phím + viền focus, trợ năng cơ bản, và 4 trạng thái (thường / đang tải / trống / lỗi).
// Chạy ở cả 3 kích thước màn. Trạng thái "lỗi" dựng bằng cách đổi tên tạm một bảng database test (khôi phục ngay sau đó).
import type { Page } from "@playwright/test";
import { STATE, openAdmin, openParentGate, pinOf } from "./helpers/auth";
import { exec, resetBao, resetNewKid, seedInfo, setStudyToday, sql } from "./helpers/db";
import { a11yAudit, tabAudit } from "./helpers/audit";
import { expect, test } from "./helpers/fixtures";
import { expectControlsInViewport, expectNoPageScroll } from "./helpers/layout";
import { goToStep, playLesson, type StepKind } from "./helpers/lesson";

const NO_STATE = { cookies: [], origins: [] };
const info = () => seedInfo();

async function fullLessonId(): Promise<number> {
  const [row] = await sql<{ id: number }>(
    "SELECT l.id FROM lessons l JOIN lesson_steps s ON s.lesson_id = l.id JOIN units u ON u.id = l.unit_id WHERE u.level_id = (SELECT id FROM levels WHERE number = 3) AND u.status = 'published' AND l.kind = 'lesson' GROUP BY l.id HAVING SUM(s.activity_type = 'memory_game') > 0 AND SUM(s.activity_type = 'match_pairs') > 0 AND SUM(s.activity_type = 'listen_choose_picture') > 0 ORDER BY l.id LIMIT 1",
  );
  return row.id;
}

/** Đổi tên tạm một bảng để buộc trang báo lỗi; luôn khôi phục trong finally. */
async function withBrokenTable(table: string, body: () => Promise<void>) {
  await exec(`RENAME TABLE \`${table}\` TO \`${table}__tam\``);
  try {
    await body();
  } finally {
    await exec(`RENAME TABLE \`${table}__tam\` TO \`${table}\``);
  }
}

// ---------------------------------------------------------------------------------------------------------------
// 1. Các màn bài học vừa màn hình, không cuộn, không nút bị che hoặc tràn
// ---------------------------------------------------------------------------------------------------------------
test.describe("Màn bài học: vừa màn hình, không cuộn, không nút tràn ra ngoài", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeAll(() => resetBao());

  test("khung bài học: thẻ từ (mặt trước, mặt sau), nghe chọn hình, nối, chọn từ, lật thẻ, kết thúc bài", async ({ page }) => {
    test.setTimeout(150_000);
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    const seen = new Set<StepKind>();
    const audit = async (kind: StepKind) => {
      if (seen.has(kind) || kind === "unknown") return;
      seen.add(kind);
      await page.waitForTimeout(500); // chờ hiệu ứng vào màn xong
      await expectNoPageScroll(page);
      await expectControlsInViewport(page);
    };
    await playLesson(page, { matchWithKeyboard: false, onStep: audit });
    for (const kind of ["card-front", "listen", "match", "memory", "end"] as StepKind[]) expect(seen.has(kind), `Đã kiểm bước ${kind}`).toBe(true);
    // Mặt sau của thẻ từ.
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Space");
    await expect(page.getByRole("heading", { name: "Nghĩa của từ" })).toBeVisible();
    await expectNoPageScroll(page);
    await expectControlsInViewport(page);
  });

  test("hộp thoại 'Dừng bài học?' và dải phản hồi 'Chưa đúng' không làm trang cuộn", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await goToStep(page, "listen");
    await page.waitForTimeout(400);
    await page.keyboard.press("1");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(600);
    await expectNoPageScroll(page);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    await expectNoPageScroll(page);
  });

  test("ôn tập hôm nay: màn bắt đầu, khung làm bài và tổng kết", async ({ page }) => {
    test.setTimeout(150_000);
    await page.goto("/review");
    await page.waitForLoadState("networkidle");
    await expectNoPageScroll(page);
    await expectControlsInViewport(page);
    await page.getByRole("button", { name: "Bắt đầu ôn" }).click();
    const seen = new Set<StepKind>();
    await playLesson(page, {
      onStep: async (kind) => {
        if (seen.has(kind)) return;
        seen.add(kind);
        await page.waitForTimeout(500);
        await expectNoPageScroll(page);
        await expectControlsInViewport(page);
      },
    });
    await expect(page.getByRole("region", { name: "Kết quả ôn tập" })).toBeVisible();
    await expect(page.getByText("Bông đang ghi lại kết quả…")).toBeHidden({ timeout: 15_000 });
    await page.waitForTimeout(800);
    await expectNoPageScroll(page);
    await expectControlsInViewport(page);
    resetBao();
  });
});

test.describe("Bài xếp lớp và màn Hết giờ: vừa màn hình, không cuộn", () => {
  test("bài xếp lớp: giới thiệu, câu hỏi, kết quả", async ({ browser }) => {
    test.setTimeout(120_000);
    resetNewKid(info().kids.mai, 4);
    const context = await browser.newContext({ storageState: STATE.a1 });
    const page = await context.newPage();
    await page.addInitScript(() => {
      const spoken: string[] = [];
      (window as unknown as { __spoken: string[] }).__spoken = spoken;
    });
    await page.goto("/placement");
    await page.waitForLoadState("networkidle");
    await expectNoPageScroll(page);
    await expectControlsInViewport(page);
    await page.getByRole("button", { name: "Bắt đầu", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Nghe và chọn hình" })).toBeVisible();
    await page.waitForTimeout(500);
    await expectNoPageScroll(page);
    await expectControlsInViewport(page);
    for (let i = 0; i < 12; i++) {
      await page.getByRole("button", { name: "Tớ chưa biết" }).click();
      await page.waitForTimeout(250);
    }
    await expect(page.getByRole("heading", { name: "Mai làm xong rồi!" })).toBeVisible();
    await page.waitForTimeout(600);
    await expectNoPageScroll(page);
    await expectControlsInViewport(page);
    await context.close();
    resetNewKid(info().kids.mai, 4);
  });

  test("màn Hết giờ học và hộp thoại thêm giờ", async ({ browser }) => {
    setStudyToday(info().kids.teo, 20, 20);
    const context = await browser.newContext({ storageState: STATE.t2 });
    const page = await context.newPage();
    await page.goto("/time-up");
    await expect(page.getByRole("heading", { name: "Đến giờ nghỉ rồi!" })).toBeVisible();
    await page.waitForTimeout(500);
    await expectNoPageScroll(page);
    await expectControlsInViewport(page);
    await page.getByRole("button", { name: "Bố mẹ: thêm 10 phút" }).click();
    await page.waitForTimeout(400);
    await expectNoPageScroll(page);
    await context.close();
  });
});

// ---------------------------------------------------------------------------------------------------------------
// 2. Bàn phím (Tab, viền focus) và trợ năng cơ bản cho mọi màn
// ---------------------------------------------------------------------------------------------------------------
type Screen = { name: string; path: string };
const KID_SCREENS: Screen[] = [
  { name: "Chọn hồ sơ", path: "/profiles" },
  { name: "Tạo hồ sơ", path: "/profiles/new" },
  { name: "Trang chủ", path: "/home" },
  { name: "Tổng quan 10 cấp", path: "/levels" },
  { name: "Bản đồ", path: "/map/3" },
  { name: "Sổ từ", path: "/notebook" },
  { name: "Ôn tập (bắt đầu)", path: "/review" },
  { name: "Bộ sưu tập (sắp có)", path: "/collection" },
  { name: "Phòng của tớ (sắp có)", path: "/room" },
];
const PARENT_SCREENS: Screen[] = [
  { name: "Tổng quan bố mẹ", path: "/parent" },
  { name: "Cài đặt bố mẹ", path: "/parent/settings" },
];
const ADMIN_SCREENS: Screen[] = [
  { name: "Bảng điều khiển", path: "/admin" },
  { name: "Cấu trúc lộ trình", path: "/admin/tree" },
  { name: "Ngân hàng từ vựng", path: "/admin/vocab" },
  { name: "Ngân hàng câu hỏi", path: "/admin/questions" },
  { name: "Soạn bài học (danh sách)", path: "/admin/builder" },
  { name: "Thư viện hình", path: "/admin/media" },
  { name: "Nhập và xuất Excel", path: "/admin/excel" },
  { name: "Âm phonics", path: "/admin/phonics" },
  { name: "Câu hỏi dạng mới", path: "/admin/question-types" },
  { name: "Truyện tranh", path: "/admin/stories" },
];

async function auditScreen(page: Page, screen: Screen) {
  await page.goto(screen.path);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(300);
  await a11yAudit(page);
  const visited = await tabAudit(page);
  expect(visited.length, `Tab đi qua được ít nhất 1 phần tử ở "${screen.name}"`).toBeGreaterThan(0);
}

test.describe("Bàn phím và trợ năng — các màn của bé", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeAll(() => resetBao());
  for (const screen of KID_SCREENS) {
    test(`${screen.name}: Tab đi hết, mọi nút có viền focus và có tên đọc được`, async ({ page }) => {
      await auditScreen(page, screen);
    });
  }
  test("khung bài học: Tab có viền focus, nút có tên", async ({ page }) => {
    await page.goto(`/lesson/${await fullLessonId()}`);
    await page.waitForLoadState("networkidle");
    await a11yAudit(page);
    await tabAudit(page, 20);
    await goToStep(page, "listen");
    await a11yAudit(page);
    await tabAudit(page, 20);
  });
});

test.describe("Bàn phím và trợ năng — đăng nhập, đăng ký, cổng bố mẹ", () => {
  test.describe("chưa đăng nhập", () => {
    test.use({ storageState: NO_STATE });
    for (const screen of [
      { name: "Đăng nhập", path: "/login" },
      { name: "Đăng ký", path: "/register" },
    ]) {
      test(`${screen.name}`, async ({ page }) => {
        await auditScreen(page, screen);
      });
    }
  });
  test.describe("đã đăng nhập", () => {
    test.use({ storageState: STATE.a });
    test("Cổng vào khu bố mẹ (Adult01)", async ({ page }) => {
      await auditScreen(page, { name: "Cổng bố mẹ", path: "/parent/unlock" });
    });
  });
});

test.describe("Bàn phím và trợ năng — khu bố mẹ", () => {
  test.use({ storageState: STATE.a });
  test.beforeEach(async ({ page }) => {
    await openParentGate(page, pinOf("A"));
  });
  for (const screen of PARENT_SCREENS) {
    test(`${screen.name}`, async ({ page }) => {
      await auditScreen(page, screen);
    });
  }
  // Kiểm tra cuối task 11: "dùng toàn bộ khu bố mẹ chỉ bằng bàn phím"
  test("đổi tab Cài đặt chỉ bằng bàn phím và lưu giới hạn giờ", async ({ page }) => {
    await page.goto("/parent/settings");
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: "Thời gian học" }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("tab", { name: "Giao diện & âm thanh" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Tab"); // vào bảng điều khiển của tab
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();
  });
});

test.describe("Bàn phím và trợ năng — khu quản trị", () => {
  test.use({ storageState: STATE.admin });
  test.beforeEach(async ({ page }) => {
    await openAdmin(page);
  });
  for (const screen of ADMIN_SCREENS) {
    test(`${screen.name}`, async ({ page }) => {
      await auditScreen(page, screen);
    });
  }
  test("Soạn bài học (một bài)", async ({ page }) => {
    await auditScreen(page, { name: "Soạn bài", path: `/admin/builder/${info().draft.lessonId}` });
  });
  test("Nhập chủ đề mới (tab)", async ({ page }) => {
    await auditScreen(page, { name: "Nhập chủ đề", path: "/admin/excel?tab=topic" });
  });
});

// ---------------------------------------------------------------------------------------------------------------
// 3. Bốn trạng thái: thường / đang tải (khung xương) / trống / lỗi (nút Thử lại)
// ---------------------------------------------------------------------------------------------------------------
const SKELETON = '[aria-busy="true"], [class*="Skeleton"], [class*="skeleton"], [class*="__sk"], [class*="sk__"]';

/** Bấm một liên kết trong ứng dụng khi yêu cầu RSC bị làm chậm: màn đích phải hiện khung xương trong lúc chờ. */
async function expectSkeletonWhileLoading(page: Page, click: () => Promise<void>, why: string) {
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => (release = resolve));
  await page.route(/[?&]_rsc=/, async (route) => {
    await gate;
    await route.continue();
  });
  await click();
  await expect(page.locator(SKELETON).first(), `Đang tải: ${why}`).toBeVisible({ timeout: 8000 });
  release();
  await page.waitForTimeout(300);
}

test.describe("Trạng thái đang tải (khung xương) — màn của bé", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeAll(() => resetBao());
  const cases: { name: string; from: string; link: string; kind: "link" | "button" }[] = [
    { name: "Sổ từ", from: "/home", link: "Sổ từ", kind: "link" },
    { name: "Bản đồ", from: "/home", link: "Bản đồ", kind: "link" },
    { name: "Ôn tập", from: "/home", link: "Ôn ngay", kind: "link" },
    { name: "Bài học", from: "/home", link: "Học tiếp", kind: "link" },
  ];
  for (const c of cases) {
    test(`${c.name} hiện khung xương khi tải chậm`, async ({ page }) => {
      await page.goto(c.from);
      await page.waitForLoadState("networkidle");
      await expectSkeletonWhileLoading(page, () => page.getByRole("link", { name: new RegExp(`^${c.link}`) }).first().click(), c.name);
    });
  }
});

test.describe("Trạng thái đang tải (khung xương) — khu bố mẹ và quản trị", () => {
  test.describe("bố mẹ", () => {
    test.use({ storageState: STATE.a });
    test("Cài đặt", async ({ page }) => {
      await openParentGate(page, pinOf("A"));
      await page.goto("/parent");
      await page.waitForLoadState("networkidle");
      await expectSkeletonWhileLoading(page, () => page.getByRole("link", { name: "Cài đặt" }).click(), "Cài đặt");
    });
  });
  test.describe("quản trị", () => {
    test.use({ storageState: STATE.admin });
    for (const [label, name] of [
      ["Cấu trúc lộ trình", "Cấu trúc lộ trình"],
      ["Ngân hàng từ vựng", "Ngân hàng từ vựng"],
      ["Ngân hàng câu hỏi", "Ngân hàng câu hỏi"],
      ["Soạn bài học", "Soạn bài học"],
      ["Hình ảnh & âm thanh", "Hình ảnh & âm thanh"],
      ["Nhập & xuất Excel", "Nhập & xuất Excel"],
    ]) {
      test(label, async ({ page }) => {
        await openAdmin(page);
        await page.waitForLoadState("networkidle");
        await expectSkeletonWhileLoading(page, () => page.getByRole("link", { name }).first().click(), label);
      });
    }
  });
});

test.describe("Trạng thái trống", () => {
  test("bé chưa học (Mai): Sổ từ, Ôn tập, Tổng quan bố mẹ đều có màn trống thân thiện", async ({ browser }) => {
    resetNewKid(info().kids.mai, 4);
    const context = await browser.newContext({ storageState: STATE.a1 });
    const page = await context.newPage();
    await page.goto("/notebook");
    await expect(page.getByRole("heading", { name: "Sổ từ còn trống" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Học bài đầu tiên" })).toBeVisible();
    await expect(page.getByRole("img", { name: /Rồng Bông/ }).first()).toBeVisible(); // Tiểu học: màn trống có linh vật
    await page.goto("/review");
    await expect(page.getByRole("main")).toContainText(/0\s*từ đến hạn ôn/);
    await openParentGate(page, pinOf("A"));
    await page.goto(`/parent?kid=${info().kids.mai}`);
    await expect(page.getByRole("heading", { name: "Mai chưa học buổi nào" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chưa có hoạt động" })).toBeVisible();
    await context.close();
  });

  test("gia đình chưa có hồ sơ: màn Chọn hồ sơ trống có linh vật và nút tạo hồ sơ", async ({ browser }) => {
    const context = await browser.newContext({ storageState: NO_STATE, baseURL: "http://localhost:3100" });
    const page = await context.newPage();
    const email = `trong-${Date.now().toString(36)}@edu.local`;
    await page.goto("/register");
    await page.getByLabel("Tên của bố mẹ").fill("Trống");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("MatKhau12345");
    await page.getByLabel("Nhập lại mật khẩu").fill("MatKhau12345");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    await page.waitForURL("**/profiles");
    await expect(page.getByText("Chưa có hồ sơ nào")).toBeVisible();
    await expect(page.getByRole("img", { name: /Rồng Bông/ }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Tạo hồ sơ đầu tiên" })).toBeVisible();
    await context.close();
    await exec("DELETE FROM users WHERE email = ?", [email]);
  });

  test.describe("quản trị", () => {
    test.use({ storageState: STATE.admin });
    test.beforeEach(async ({ page }) => {
      await openAdmin(page);
    });
    test("Ngân hàng câu hỏi chưa có câu nào", async ({ page }) => {
      await exec("DELETE FROM questions");
      await page.goto("/admin/questions");
      await expect(page.getByRole("heading", { name: "Chưa có câu hỏi nào" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Thêm câu hỏi" }).first()).toBeVisible();
    });
    test("Ngân hàng từ vựng và Soạn bài: tìm không ra thì có màn trống", async ({ page }) => {
      await page.goto("/admin/vocab");
      await page.getByRole("region", { name: "Ngân hàng từ vựng" }).getByLabel("Tìm kiếm").fill("khongcotuthenay");
      await expect(page.getByRole("region", { name: "Ngân hàng từ vựng" }).getByRole("status").or(page.getByText(/Không tìm thấy|Không có/)).first()).toBeVisible();
      await page.goto("/admin/builder");
      await page.getByRole("region", { name: "Danh sách bài học" }).getByLabel("Tìm kiếm").fill("khongcobainay");
      await expect(page.getByRole("region", { name: "Danh sách bài học" }).getByRole("status").or(page.getByText(/Không tìm thấy|Không có/)).first()).toBeVisible();
    });
  });
});

test.describe("Trạng thái lỗi (database không trả lời) — có thông báo nhẹ nhàng và nút Thử lại", () => {

  const kidCases: { screen: string; path: string; table: string }[] = [
    { screen: "Trang chủ", path: "/home", table: "review_cards" },
    { screen: "Tổng quan 10 cấp", path: "/levels", table: "lesson_progress" },
    { screen: "Bản đồ", path: "/map/3", table: "lesson_progress" },
    { screen: "Sổ từ", path: "/notebook", table: "review_cards" },
    { screen: "Ôn tập", path: "/review", table: "review_cards" },
  ];
  test.describe("của bé", () => {
    test.use({ storageState: STATE.a2 });
    for (const c of kidCases) {
      test(`${c.screen}: hỏng bảng ${c.table} thì báo lỗi, khôi phục rồi Thử lại được`, async ({ page }) => {
        await withBrokenTable(c.table, async () => {
          await page.goto(c.path);
          const retry = page.getByRole("button", { name: /Thử lại/ }).first();
          await expect(retry, `${c.screen}: không có nút Thử lại khi lỗi`).toBeVisible({ timeout: 15_000 });
          await expect(page.locator("body")).not.toContainText(/Internal Server Error|Application error|stack/i);
        });
        await page.getByRole("button", { name: /Thử lại/ }).first().click();
        await expect(page.getByRole("button", { name: /Thử lại/ })).toHaveCount(0, { timeout: 15_000 });
      });
    }
  });

  test.describe("khu bố mẹ", () => {
    test.use({ storageState: STATE.a });
    test("Tổng quan: hỏng bảng study_sessions thì báo lỗi, Thử lại được", async ({ page }) => {
      await openParentGate(page, pinOf("A"));
      await withBrokenTable("study_sessions", async () => {
        await page.goto("/parent");
        await expect(page.getByRole("button", { name: /Thử lại/ }).first()).toBeVisible({ timeout: 15_000 });
      });
      await page.getByRole("button", { name: /Thử lại/ }).first().click();
      await expect(page.getByRole("heading", { name: /Tổng quan · / })).toBeVisible({ timeout: 15_000 });
    });
  });

  test.describe("quản trị", () => {
    test.use({ storageState: STATE.admin });
    const adminCases = [
      { screen: "Bảng điều khiển", path: "/admin", table: "words" },
      { screen: "Cấu trúc lộ trình", path: "/admin/tree", table: "units" },
      { screen: "Ngân hàng từ vựng", path: "/admin/vocab", table: "words" },
      { screen: "Ngân hàng câu hỏi", path: "/admin/questions", table: "questions" },
      { screen: "Soạn bài học", path: "/admin/builder", table: "lessons" },
      { screen: "Thư viện hình", path: "/admin/media", table: "words" },
    ];
    for (const c of adminCases) {
      test(`${c.screen}: hỏng bảng ${c.table} thì báo lỗi kèm nút Thử lại`, async ({ page }) => {
        await openAdmin(page);
        await withBrokenTable(c.table, async () => {
          await page.goto(c.path);
          await expect(page.getByRole("button", { name: /Thử lại/ }).first(), `${c.screen}: không có nút Thử lại khi lỗi`).toBeVisible({ timeout: 15_000 });
        });
        await page.getByRole("button", { name: /Thử lại/ }).first().click();
        await expect(page.getByRole("button", { name: /Thử lại/ })).toHaveCount(0, { timeout: 15_000 });
      });
    }
  });

  test("màn Hết giờ: tóm tắt hôm nay lỗi thì vẫn có lời chúc ngủ ngon và nút Thử lại (khôi phục được)", async ({ browser }) => {
    setStudyToday(info().kids.teo, 20, 20);
    const context = await browser.newContext({ storageState: STATE.t2 });
    const page = await context.newPage();
    await withBrokenTable("lesson_attempts", async () => {
      await page.goto("/time-up");
      await expect(page.getByText("Chưa tải được tóm tắt hôm nay.")).toBeVisible();
      await expect(page.getByRole("button", { name: /Thử lại/ }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: "Chúc Bông ngủ ngon" })).toBeVisible(); // bé vẫn đi tiếp được
    });
    await page.getByRole("button", { name: /Thử lại/ }).first().click();
    await expect(page.getByText("Chưa tải được tóm tắt hôm nay.")).toBeHidden({ timeout: 15_000 });
    await context.close();
  });
});
