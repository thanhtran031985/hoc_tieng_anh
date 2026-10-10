"use client";

import { useState } from "react";
import {
  AdultButton,
  AdultButtonLink,
  AdultCard,
  AdultEmpty,
  AdultIconButton,
  AdultInput,
  AdultSegmented,
  AdultSelect,
  AdultSortable,
  adultStyles,
  useToast,
} from "@/components/adult";
import { Icon, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import { GAME_ACTIVITIES, isGameActivity, isRainLevel } from "@/lib/rules/games";
import { ACTIVITY_INFO, estimateMinutes, gameStepProblem, insertIndex, isActivityStep, isBuilderActivity, lessonStats, type BuilderActivity, type BuilderStep } from "@/lib/rules/admin-builder";
import { lessonPublishBlock } from "@/lib/rules/admin-tree";
import { buildPlaySteps, type PlayStep, type PlayWord } from "@/lib/rules/lesson-play";
import { saveLessonSchema } from "@/lib/schemas/admin-builder";
import { parseLessonStepConfig } from "@/lib/schemas/lesson-step-config";
import type { BuilderData } from "@/server/admin/builder";
import { getUnitWordsAction, saveLessonAction } from "./builder-actions";
import styles from "./builder.module.css";
import { StepsPreview } from "./StepsPreview";

type Tab = "words" | "qs" | "stories";
type Errors = Record<string, string>;

const toStep = (s: BuilderData["steps"][number]): BuilderStep => ({ key: `s${s.id}`, id: s.id, activityType: s.activityType, wordId: s.wordId, questionId: s.questionId, config: s.config });

/** Soạn bài học (Adult12): gợi ý từ và câu hỏi theo chủ đề, các bước của bài (kéo thả hoặc ↑/↓), thông tin bài, lưu và xem trước như học sinh. */
export function BuilderView({ data }: { data: BuilderData }) {
  const toast = useToast();
  const { lesson } = data;
  const [title, setTitle] = useState(lesson.title);
  const [status, setStatus] = useState(lesson.status);
  const [steps, setSteps] = useState<BuilderStep[]>(() => data.steps.map(toStep));
  const [known, setKnown] = useState(() => new Map<number, PlayWord>([...data.stepWords, ...data.suggestions].map((w) => [w.id, w])));
  const [unitId, setUnitId] = useState(lesson.unitId);
  const [suggestions, setSuggestions] = useState<PlayWord[]>(data.suggestions);
  const [tab, setTab] = useState<Tab>("words");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<PlayStep[] | null>(null);
  const [counter, setCounter] = useState(0);

  // Dữ liệu mới từ server (sau khi lưu, id bước đổi) thì dựng lại danh sách bước.
  const [seen, setSeen] = useState(data);
  if (seen !== data) {
    setSeen(data);
    setTitle(data.lesson.title);
    setStatus(data.lesson.status);
    setSteps(data.steps.map(toStep));
    setKnown((m) => new Map([...m, ...[...data.stepWords, ...data.suggestions].map((w): [number, PlayWord] => [w.id, w])]));
  }

  const stats = lessonStats(steps);
  const minutes = estimateMinutes(steps);
  const hasCard = (wordId: number) => steps.some((s) => s.activityType === "word_card" && s.wordId === wordId);
  const hasQuestion = (id: number) => steps.some((s) => s.questionId === id);
  const storyIdOf = (s: Pick<BuilderStep, "activityType" | "config">): number | null => (s.activityType === "story" && typeof s.config?.storyId === "number" ? s.config.storyId : null);
  const hasStory = (id: number) => steps.some((s) => storyIdOf(s) === id);

  function add(step: Omit<BuilderStep, "key">) {
    setErrors((e) => ({ ...e, steps: "" }));
    setCounter((c) => c + 1);
    setSteps((list) => {
      const next = [...list];
      next.splice(insertIndex(list, step.activityType), 0, { ...step, key: `n${counter}-${list.length}` });
      return next;
    });
  }
  const addWordStep = (word: PlayWord, activityType: BuilderActivity) => {
    add({ activityType, wordId: word.id, questionId: null, config: null });
    toast(`Đã thêm bước “${ACTIVITY_INFO[activityType].label}”: ${word.word}.`);
  };

  async function changeUnit(next: number) {
    setUnitId(next);
    const words = await getUnitWordsAction({ unitId: next });
    setSuggestions(words ?? []);
    if (words) setKnown((m) => new Map([...m, ...words.map((w): [number, PlayWord] => [w.id, w])]));
    else toast("Chưa tải được từ của chủ đề này.");
  }

  const describe = (s: BuilderStep): string => {
    const storyId = storyIdOf(s);
    if (storyId !== null) return data.stories.find((st) => st.storyId === storyId)?.title ?? `Truyện #${storyId}`;
    if (s.questionId !== null) return data.questions.find((q) => q.id === s.questionId)?.summary ?? `Câu hỏi #${s.questionId}`;
    if (s.wordId !== null) return known.get(s.wordId)?.word ?? `Từ #${s.wordId}`;
    if (isGameActivity(s.activityType)) return "Dùng các từ có hình của bài";
    return s.activityType === "match_pairs" ? "Nối các từ có hình trong bài" : "Lật thẻ ghép các từ có hình";
  };

  function validate() {
    const payload = { id: lesson.id, title, status, steps: steps.map((s) => ({ id: s.id, activityType: s.activityType, wordId: s.wordId, questionId: s.questionId, config: s.config })) };
    const next: Errors = {};
    const parsed = saveLessonSchema.safeParse(payload);
    if (!parsed.success) for (const issue of parsed.error.issues) next[issue.path[0] === "steps" ? "steps" : typeof issue.path[0] === "string" ? issue.path[0] : "form"] ??= issue.message;
    if (status === "published" && !next.steps) {
      const block = lessonPublishBlock(steps.length, steps.filter(isActivityStep).length);
      if (block) next.steps = block;
    }
    if (!next.steps) {
      const cardWords = steps.flatMap((s) => (s.activityType === "word_card" && s.wordId !== null && known.get(s.wordId) ? [known.get(s.wordId)!] : []));
      const problem = gameStepProblem(steps, lesson.levelNumber, [...cardWords, ...suggestions]);
      if (problem) next.steps = problem;
    }
    setErrors(next);
    return Object.keys(next).length === 0 && parsed.success ? parsed.data : null;
  }

  async function save() {
    const payload = validate();
    if (!payload) return;
    setBusy(true);
    const result = await saveLessonAction(payload);
    setBusy(false);
    if (!result.ok) {
      setErrors({ [result.field ?? "form"]: result.message });
      return;
    }
    toast(status === "published" ? "Đã lưu và xuất bản bài." : "Đã lưu bài (nháp).");
  }

  function openPreview() {
    const stored = steps.map((s, i) => {
      const q = s.questionId === null ? undefined : data.questions.find((x) => x.id === s.questionId);
      return { id: i + 1, activityType: s.activityType, config: parseLessonStepConfig(s.activityType, s.config), word: s.wordId === null ? null : (known.get(s.wordId) ?? null), question: q?.data ? { id: q.id, type: q.type, ...q.data } : null };
    });
    const unitWords = stored.flatMap((s) => (s.activityType === "word_card" && s.word ? [s.word] : []));
    const pool = [...new Map([...unitWords, ...suggestions].map((w) => [w.id, w])).values()];
    const play = buildPlaySteps(stored, pool, "preview", { stories: new Map(data.stories.map((st) => [st.storyId, st])), words: known, levelNumber: lesson.levelNumber });
    if (play.length === 0) {
      toast(steps.length === 0 ? "Bài chưa có bước nào để xem trước." : "Chưa có bước nào xem trước được (các bước cần từ có hình và đủ từ trong bài).");
      return;
    }
    setPreview(play);
  }

  return (
    <div className={styles.lb} data-level={lesson.levelNumber}>
      <AdultCard aria-labelledby="sg-title">
        <h2 className={cn(adultStyles.h2, styles.cardTitle)} id="sg-title">
          Gợi ý theo chủ đề
        </h2>
        <AdultSelect label="Chủ đề" value={unitId} onChange={(e) => void changeUnit(Number(e.target.value))} options={data.units.map((u) => [u.id, `Cấp ${lesson.levelNumber} · ${u.title}`] as const)} />
        <div className={styles.tabs}>
          <AdultSegmented
            label="Loại gợi ý"
            labelHidden
            value={tab}
            onChange={setTab}
            options={[
              ["words", `Từ vựng (${suggestions.length})`],
              ["qs", `Câu hỏi (${data.questions.length})`],
              ["stories", `Truyện (${data.stories.length})`],
            ]}
          />
        </div>
        {tab === "words" ? (
          suggestions.length === 0 ? (
            <AdultEmpty title="Chủ đề này chưa có từ" text="Thêm từ vào chủ đề ở Ngân hàng từ vựng, hoặc nhập chủ đề bằng Excel." />
          ) : (
            <ul className={styles.sug}>
              {suggestions.map((w) => (
                <li key={w.id}>
                  <span className={styles.thumb}>{w.image ? <WordPicture word={w.word} src={w.image} size={30} /> : <Icon name="image" size={16} />}</span>
                  <span>
                    <b lang="en">{w.word}</b> <span className={cn(adultStyles.small, adultStyles.muted)}>{w.ipa}</span>
                    <br />
                    <span className={cn(adultStyles.small, adultStyles.muted)}>{w.meaningVi}</span>
                  </span>
                  <span className={styles.sugActs}>
                    {hasCard(w.id) ? (
                      <span className={styles.in}>
                        <Icon name="check" size={14} />
                        Đã có
                      </span>
                    ) : (
                      <AdultButton label="Thêm" icon="plus" variant="secondary" size="s" aria-label={`Thêm thẻ từ ${w.word} vào bài`} onClick={() => addWordStep(w, "word_card")} />
                    )}
                    {w.image && (
                      <>
                        <AdultIconButton icon="speaker" label={`Thêm bước nghe và chọn hình cho ${w.word}`} onClick={() => addWordStep(w, "listen_choose_picture")} />
                        <AdultIconButton icon="image" label={`Thêm bước chọn từ đúng cho hình ${w.word}`} onClick={() => addWordStep(w, "choose_word_for_picture")} />
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )
        ) : tab === "stories" ? (
          data.stories.length === 0 ? (
            <AdultEmpty title="Chưa có truyện đã xuất bản cho cấp này" text="Soạn và xuất bản truyện ở màn Truyện tranh rồi quay lại đây để thêm vào bài." action={<AdultButtonLink href="/admin/stories" label="Mở Truyện tranh" variant="secondary" />} />
          ) : (
            <ul className={styles.sug}>
              {data.stories.map((st) => (
                <li key={st.storyId}>
                  <span className={styles.thumb}>
                    <Icon name="book" size={18} />
                  </span>
                  <span>
                    <b className={adultStyles.body} lang="en">
                      {st.title}
                    </b>
                    <br />
                    <span className={cn(adultStyles.small, adultStyles.muted)}>{st.pages.filter((p) => p.kind === "page").length} trang</span>
                  </span>
                  {hasStory(st.storyId) ? (
                    <span className={styles.in}>
                      <Icon name="check" size={14} />
                      Đã có
                    </span>
                  ) : (
                    <AdultButton
                      label="Thêm"
                      icon="plus"
                      variant="secondary"
                      size="s"
                      onClick={() => {
                        add({ activityType: "story", wordId: null, questionId: null, config: { storyId: st.storyId } });
                        toast("Đã thêm truyện vào bài.");
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>
          )
        ) : data.questions.length === 0 ? (
          <AdultEmpty title="Chưa có câu hỏi cho cấp này" text="Tạo câu hỏi ở Ngân hàng câu hỏi rồi quay lại đây để thêm vào bài." action={<AdultButtonLink href="/admin/questions" label="Mở ngân hàng câu hỏi" variant="secondary" />} />
        ) : (
          <ul className={styles.sug}>
            {data.questions.map((q) => {
              const type = isBuilderActivity(q.type) ? q.type : null;
              const needsWord = type !== null && ACTIVITY_INFO[type].needsWord;
              return (
                <li key={q.id}>
                  <span className={styles.thumb}>
                    <Icon name={type ? ACTIVITY_INFO[type].icon : "exam"} size={18} />
                  </span>
                  <span>
                    <b className={adultStyles.body}>{q.summary}</b>
                    <br />
                    <span className={cn(adultStyles.small, adultStyles.muted)}>độ khó {q.difficulty}</span>
                  </span>
                  {hasQuestion(q.id) ? (
                    <span className={styles.in}>
                      <Icon name="check" size={14} />
                      Đã có
                    </span>
                  ) : (
                    <AdultButton
                      label="Thêm"
                      icon="plus"
                      variant="secondary"
                      size="s"
                      onClick={() => {
                        if (!type || (needsWord && q.wordId === null)) {
                          toast("Câu hỏi này chưa gắn với từ nên chưa thêm được vào bài.");
                          return;
                        }
                        add({ activityType: type, wordId: needsWord ? q.wordId : null, questionId: q.id, config: null });
                        toast("Đã thêm câu hỏi vào bài.");
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </AdultCard>

      <AdultCard aria-labelledby="steps-title">
        <div className={styles.stepsHead}>
          <div>
            <h2 className={adultStyles.h2} id="steps-title">
              Các bước của bài ({steps.length})
            </h2>
            <span className={cn(adultStyles.small, adultStyles.muted)}>Kéo tay nắm để đổi thứ tự · Tab tới tay nắm rồi ↑ / ↓</span>
          </div>
          <AdultButton label="Thêm nối cặp" icon="plus" variant="ghost" size="s" onClick={() => add({ activityType: "match_pairs", wordId: null, questionId: null, config: null })} />
          <AdultButton label="Thêm lật thẻ" icon="plus" variant="ghost" size="s" onClick={() => add({ activityType: "memory_game", wordId: null, questionId: null, config: null })} />
        </div>
        <div className={styles.games} role="group" aria-label="Thêm trò chơi vào bài">
          <span className={cn(adultStyles.small, adultStyles.muted)}>Mini game:</span>
          {GAME_ACTIVITIES.map((type) => (
            <AdultButton
              key={type}
              label={`Thêm ${ACTIVITY_INFO[type].label}`}
              icon="plus"
              variant="ghost"
              size="s"
              disabled={type === "word_rain" && !isRainLevel(lesson.levelNumber)}
              onClick={() => {
                add({ activityType: type, wordId: null, questionId: null, config: null });
                toast(`Đã thêm trò chơi “${ACTIVITY_INFO[type].label}”.`);
              }}
            />
          ))}
          {!isRainLevel(lesson.levelNumber) && <span className={cn(adultStyles.small, adultStyles.muted)}>Mưa từ vựng chỉ dành cho bài cấp 3–5.</span>}
        </div>
        {steps.length === 0 ? (
          <AdultEmpty title="Bài chưa có bước nào" text="Thêm từ hoặc câu hỏi ở cột gợi ý bên trái." />
        ) : (
          <AdultSortable
            className={styles.steps}
            ids={steps.map((s) => s.key)}
            labelOf={(key) => `bước ${steps.findIndex((s) => s.key === key) + 1}: ${ACTIVITY_INFO[steps.find((s) => s.key === key)?.activityType ?? "word_card"].label}`}
            onReorder={(keys) => setSteps((list) => keys.map((k) => list.find((s) => s.key === k)!).filter(Boolean))}
          >
            {(api) =>
              steps.map((s, i) => {
                const info = ACTIVITY_INFO[s.activityType];
                return (
                  <li key={s.key} className={styles.step} {...api.itemProps(s.key)}>
                    <button type="button" className={styles.grip} {...api.gripProps(s.key)}>
                      <Icon name="grip" size={16} />
                    </button>
                    <span className={styles.no}>{i + 1}</span>
                    <span className={cn(styles.type, isActivityStep(s) && styles.typeQ)}>
                      <Icon name={info.icon} size={18} />
                    </span>
                    <span className={styles.stepText}>
                      <b>{info.label}</b>
                      <span className={cn(adultStyles.small, adultStyles.muted)} lang="en">
                        {describe(s)}
                      </span>
                    </span>
                    <AdultIconButton icon="close" label={`Bỏ bước ${i + 1}: ${info.label}`} onClick={() => (setSteps((list) => list.filter((x) => x.key !== s.key)), setErrors((e) => ({ ...e, steps: "" })))} />
                  </li>
                );
              })
            }
          </AdultSortable>
        )}
        <div className={cn(styles.total, adultStyles.small, adultStyles.muted)}>
          <span>
            Khoảng <b>{minutes} phút</b>
          </span>
          <span>
            <b>{stats.words}</b> từ mới
          </span>
          <span>
            <b>{stats.activities}</b> hoạt động / câu hỏi
          </span>
        </div>
        <p className={cn(adultStyles.err, adultStyles.small)} role="alert" hidden={!errors.steps}>
          <Icon name="warn" size={14} />
          <span>{errors.steps}</span>
        </p>
      </AdultCard>

      <AdultCard aria-labelledby="info-title">
        <h2 className={cn(adultStyles.h2, styles.cardTitle)} id="info-title">
          Thông tin bài
        </h2>
        <form
          className={styles.info}
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <AdultInput label="Tên bài" required value={title} error={errors.title} onChange={(e) => (setTitle(e.target.value), setErrors((x) => ({ ...x, title: "" })))} />
          <div className={cn(styles.where, adultStyles.small)}>
            Cấp {lesson.levelNumber} · {lesson.levelName} › {lesson.unitTitle}
          </div>
          <AdultSegmented
            label="Trạng thái"
            value={status}
            onChange={(value) => (setStatus(value), setErrors((x) => ({ ...x, steps: "", status: "" })))}
            options={[
              ["draft", "Nháp"],
              ["published", "Xuất bản"],
            ]}
          />
          {status === "published" && errors.steps && (
            <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
              <Icon name="warn" size={14} />
              <span>Chưa xuất bản được — xem lỗi ở danh sách bước.</span>
            </p>
          )}
          {errors.form && (
            <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
              <Icon name="warn" size={14} />
              <span>{errors.form}</span>
            </p>
          )}
          <div className={styles.actions}>
            <AdultButton label="Xem trước" icon="eye" variant="secondary" block onClick={openPreview} />
            <AdultButton type="submit" label="Lưu bài" icon="check" block loading={busy} />
          </div>
        </form>
        <p className={cn(styles.foot, adultStyles.small, adultStyles.muted)}>Thời lượng tự tính theo các bước, lưu cùng bài.</p>
      </AdultCard>

      {preview && <StepsPreview steps={preview} level={lesson.levelNumber} onClose={() => setPreview(null)} />}
    </div>
  );
}
