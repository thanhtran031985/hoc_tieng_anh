import { Mascot, type MascotProps } from "./Mascot";
import type { Stage } from "./dragon-stages";

export type MascotGrowthProps = Omit<MascotProps, "stage" | "expr"> & {
  /** Dáng theo cấp: 1 Hạt giống, 2 Mầm non, 3 Lá xanh (dáng gốc), 4 Cành cây, 5 Cây lớn. */
  stage: Stage;
  /** Mặc định `chao`. Cả 8 biểu cảm dùng được cho mọi dáng. */
  expr?: MascotProps["expr"];
};

/** Rồng Bông lớn lên (`Bong.MascotGrowth(stage, expr, size)`): cùng nét vẽ và 4 màu bé chọn, đổi dáng theo cấp 1–5. */
export function MascotGrowth({ stage, expr = "chao", ...rest }: MascotGrowthProps) {
  return <Mascot stage={stage} expr={expr} {...rest} />;
}
