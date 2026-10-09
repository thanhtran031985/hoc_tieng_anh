// Task 06: trang chủ (Screen04), tổng quan 10 cấp (Screen05), bản đồ đảo (Screen06), màn "Sắp có" (Screen22).
import { STATE } from "./helpers/auth";
import { resetBao, seedInfo, sql } from "./helpers/db";
import { expect, test } from "./helpers/fixtures";

test.describe("Bước 1 — Trang chủ (Screen04), bé Bảo đã học 6 bài", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeAll(() => resetBao());

  test("hiện lời chào có tên bé, thanh trên có sao, xu, chuỗi ngày đúng với dữ liệu", async ({ page }) => {
    const info = seedInfo();
    await page.goto("/home");
    await expect(page.getByRole("heading", { name: "Trang chủ của Bảo" })).toBeVisible();
    await expect(page.getByText(/Chào Bảo!/)).toBeVisible();
    const bar = page.getByRole("banner");
    await expect(bar).toContainText(new RegExp(`${info.bao.stars}\s*sao`));
    await expect(bar).toContainText(new RegExp(`${info.bao.coins}\s*xu`));
    await expect(bar).toContainText(/3s*ngày học liên tiếp/);
    await expect(bar).toContainText("Cấp 3 · Lá xanh");
  });

  test("thẻ Nhiệm vụ hôm nay: số từ cần ôn lấy từ thẻ đến hạn, bài tiếp theo trùng với chặng 'đang học' trên bản đồ", async ({ page }) => {
    const info = seedInfo();
    await page.goto("/home");
    const mission = page.getByRole("region", { name: /Nhiệm vụ hôm nay/ });
    await expect(mission).toBeVisible();
    await expect(mission.getByText(`${info.bao.cards.due} từ cần ôn`)).toBeVisible();
    await expect(mission.getByRole("link", { name: "Ôn ngay" })).toHaveAttribute("href", "/review");
    const next = await mission.getByRole("link", { name: "Học tiếp" }).getAttribute("href");
    expect(next).toMatch(/^\/lesson\/\d+$/);
    // Cùng bài với nút "Bắt đầu" trên bản đồ (chặng đang học).
    await page.goto("/map/3");
    await expect(page.getByRole("link", { name: "Bắt đầu" })).toHaveAttribute("href", next!);
  });

  test("thẻ giờ học: 'Hôm nay: 8/10 phút' đúng với phiên học hôm nay", async ({ page }) => {
    const info = seedInfo();
    await page.goto("/home");
    await expect(page.getByRole("region", { name: "Tiến độ cấp học" }).getByText(`Hôm nay: ${info.bao.minutesByAge[0]}/10 phút`)).toBeVisible();
    await expect(page.getByRole("progressbar", { name: "Phút học hôm nay" })).toBeVisible();
  });

  test("4 nút lớn: Bản đồ, Sổ từ (đúng số từ đã học), Bộ sưu tập, Phòng của tớ", async ({ page }) => {
    const info = seedInfo();
    await page.goto("/home");
    const nav = page.getByRole("navigation", { name: "Đi tới" });
    await expect(nav.getByRole("link")).toHaveCount(4);
    await expect(nav.getByRole("link", { name: /^Bản đồ/ })).toHaveAttribute("href", "/map");
    await expect(nav.getByRole("link", { name: /^Sổ từ/ })).toContainText(`${info.bao.cards.total} từ đã học`);
    await expect(nav.getByRole("link", { name: /^Bộ sưu tập/ })).toHaveAttribute("href", "/collection");
    await expect(nav.getByRole("link", { name: /^Phòng của tớ/ })).toHaveAttribute("href", "/room");
  });

  // Kiểm tra: "Enter vào bài tiếp theo"
  test("bấm Enter ở trang chủ thì vào bài tiếp theo", async ({ page }) => {
    await page.goto("/home");
    const next = await page.getByRole("link", { name: "Học tiếp" }).getAttribute("href");
    await page.waitForLoadState("networkidle"); // chờ trang nạp xong phím tắt
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${next}$`));
    await expect(page.getByRole("button", { name: "Thoát bài học" })).toBeVisible();
  });

  test("tiến độ cấp: số chặng đã qua đúng với 6 bài đã xong", async ({ page }) => {
    await page.goto("/home");
    const region = page.getByRole("region", { name: "Tiến độ cấp học" });
    await expect(region).toContainText("Chặng đã qua");
    await expect(region).toContainText(/Chặng đã qua\s*6\/\d+/);
  });
});

test.describe("Trang chủ — bé mới (Mai, chưa có thẻ ôn)", () => {
  test.use({ storageState: STATE.a1 });

  test("không có từ đến hạn thì ẩn nhiệm vụ Ôn tập, chỉ còn bài đầu tiên", async ({ page }) => {
    await page.goto("/home");
    await expect(page.getByRole("heading", { name: "Trang chủ của Mai" })).toBeVisible();
    await expect(page.getByText(/Chào Mai! Chúng mình bắt đầu nhé/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Ôn ngay" })).toHaveCount(0);
    const mission = page.getByRole("region", { name: "Nhiệm vụ hôm nay" });
    await expect(mission.getByText("Bài đầu tiên!")).toBeVisible();
    await expect(mission.getByRole("link", { name: "Bắt đầu" })).toHaveAttribute("href", /^\/lesson\/\d+$/);
    await expect(mission.getByText("Chưa có từ nào cần ôn")).toBeVisible();
  });
});

test.describe("Bước 2 — Tổng quan 10 cấp (Screen05)", () => {
  test.use({ storageState: STATE.a2 });

  // Kiểm tra: "cấp đã qua, đang học, khóa hiển thị đúng; mỗi điểm có số và tên cấp"
  test("cấp 1–2 đã qua, cấp 3 đang học, cấp 4–10 còn khóa; mỗi điểm có số và tên", async ({ page }) => {
    await page.goto("/levels");
    await expect(page.getByRole("heading", { name: "Mười cấp học" })).toBeVisible();
    const names = ["Hạt giống", "Mầm non", "Lá xanh", "Cành cây", "Cây lớn", "Singapore", "Sydney", "London", "New York", "Toronto"];
    for (const [i, name] of names.entries()) {
      const n = i + 1;
      const state = n < 3 ? "đã qua" : n === 3 ? "bé đang ở đây" : "còn khoá";
      await expect(page.getByRole("button", { name: `Cấp ${n} ${name}, ${state}` }), `Cấp ${n}`).toBeVisible();
    }
    await expect(page.getByText("Tiểu học · 5 hòn đảo")).toBeVisible();
    await expect(page.getByText("THCS · 5 thành phố")).toBeVisible();
  });

  test("bấm cấp đang học mở bản đồ cấp 3; bấm cấp còn khóa thì ở lại, không vào được", async ({ page }) => {
    await page.goto("/levels");
    await page.getByRole("button", { name: /^Cấp 4 Cành cây, còn khoá/ }).click();
    const note = page.getByRole("dialog", { name: "Đảo Cành cây còn khoá" });
    await expect(note).toContainText("Bé học xong cấp đang học là mở được ngay");
    await expect(page).toHaveURL(/\/levels$/);
    await note.getByRole("button", { name: "Đã hiểu" }).click();
    await expect(note).toBeHidden();
    await page.getByRole("button", { name: /^Cấp 3 Lá xanh/ }).click();
    await expect(page).toHaveURL(/\/map\/3$/);
  });

  test("nút Về trang chủ", async ({ page }) => {
    await page.goto("/levels");
    await page.getByRole("button", { name: "Về trang chủ" }).click();
    await expect(page).toHaveURL(/\/home$/);
  });
});

test.describe("Bước 3 — Bản đồ đảo (Screen06)", () => {
  test.use({ storageState: STATE.a2 });
  test.beforeAll(() => resetBao());

  // Kiểm tra: "chặng xong hiện số sao; chặng khóa không bấm được; trùm khóa đến khi xong vùng"
  test("chặng đã xong hiện đúng số sao, chặng đang học nổi bật, chặng sau còn khóa", async ({ page }) => {
    await page.goto("/map/3");
    await expect(page.getByRole("heading", { name: "Bản đồ Đảo 3: Lá xanh" })).toBeVisible();
    // Sao theo dữ liệu seed: 3, 3, 2, 1 (vùng 1) và 3, 2 (vùng 2).
    await expect(page.getByRole("button", { name: "Chặng 1 vùng Việc hằng ngày, 3 sao" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Chặng 2 vùng Việc hằng ngày, 3 sao" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Chặng 3 vùng Việc hằng ngày, 2 sao" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Chặng 4 vùng Việc hằng ngày, 1 sao" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Chặng 1 vùng Thứ, tháng, mùa, 3 sao" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Chặng 2 vùng Thứ, tháng, mùa, 2 sao" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Chặng 3 vùng Thứ, tháng, mùa, đang học" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Chặng 4 vùng Thứ, tháng, mùa, còn khoá" })).toBeVisible();
  });

  test("trận trùm mở khi xong hết bài của vùng, còn lại khóa", async ({ page }) => {
    await page.goto("/map/3");
    await expect(page.getByRole("button", { name: "Trận trùm Daily routines, đã mở" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Trận trùm Days, months, seasons, còn khoá" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Trận trùm Weather and nature, còn khoá" })).toBeVisible();
  });

  test("bấm chặng đang học mở hộp thông tin có các từ và nút Bắt đầu vào đúng bài", async ({ page }) => {
    await page.goto("/map/3");
    await page.getByRole("button", { name: "Chặng 1 vùng Thứ, tháng, mùa, 3 sao" }).click();
    const info = page.getByRole("dialog", { name: "Thông tin chặng" });
    await expect(info).toBeVisible();
    await expect(info.getByRole("link", { name: "Học lại" })).toHaveAttribute("href", /^\/lesson\/\d+$/);
    await page.getByRole("button", { name: "Chặng 3 vùng Thứ, tháng, mùa, đang học" }).click();
    const current = page.getByRole("dialog", { name: "Thông tin chặng" });
    await current.getByRole("link", { name: "Bắt đầu" }).click();
    await expect(page).toHaveURL(/\/lesson\/\d+$/);
    await expect(page.getByRole("button", { name: "Thoát bài học" })).toBeVisible();
  });

  test("bấm chặng còn khóa không mở được bài", async ({ page }) => {
    await page.goto("/map/3");
    const locked = page.getByRole("button", { name: "Chặng 4 vùng Thứ, tháng, mùa, còn khoá" });
    await locked.click({ force: true });
    await expect(page).toHaveURL(/\/map\/3$/);
    await expect(page.getByRole("dialog", { name: "Thông tin chặng" }).getByRole("link", { name: "Bắt đầu" })).toHaveCount(0);
  });

  test("gõ thẳng URL của bài còn khóa thì không chơi được", async ({ page }) => {
    // Bài thứ tư của chủ đề thứ hai ở cấp 3 còn khóa vì bài thứ ba chưa xong.
    const [row] = await sql<{ id: number }>(
      "SELECT l.id FROM lessons l JOIN units u ON u.id = l.unit_id WHERE u.level_id = (SELECT id FROM levels WHERE number = 3) AND u.status = 'published' AND l.kind = 'lesson' ORDER BY u.sort_order, l.sort_order LIMIT 1 OFFSET 7",
    );
    await page.goto(`/lesson/${row.id}`);
    await expect(page.getByRole("button", { name: "Thoát bài học" }), "Bài còn khóa vẫn chơi được khi gõ thẳng URL").toHaveCount(0);
  });

  test("nhóm vùng 5–8 chuyển được và chặng ở đó còn khóa", async ({ page }) => {
    await page.goto("/map/3");
    await page.getByRole("button", { name: "Vùng 5–8" }).click();
    await expect(page.getByRole("button", { name: "Vùng 5–8" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /còn khoá/ }).first()).toBeVisible();
  });

  test("/map chuyển về bản đồ cấp hiện tại của bé", async ({ page }) => {
    await page.goto("/map");
    await expect(page).toHaveURL(/\/map\/3$/);
  });
});

test.describe("Screen22 — Sắp có", () => {
  test.use({ storageState: STATE.a2 });

  for (const [route, heading] of [
    ["/collection", "Bộ sưu tập đang được xây"],
    ["/room", /Phòng của tớ/],
  ] as const) {
    test(`${route} hiện màn Sắp có với nút về trang chủ`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByText("Sắp có").first()).toBeVisible();
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await page.getByRole("link", { name: "Về trang chủ" }).click();
      await expect(page).toHaveURL(/\/home$/);
    });
  }

  test("seed dữ liệu: Bảo đã xong đúng 6 bài", async () => {
    expect(seedInfo().bao.lessonIds).toHaveLength(6);
  });
});
