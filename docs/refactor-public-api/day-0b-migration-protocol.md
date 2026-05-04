# Day 0b — 文档迁移协议

> 跨仓 git mv:V2 仓 `docs/refactor-public-api/` → meta2d.js 仓 `docs/refactor-public-api/`
> 严格走 destructive 三步走变体(P0 期间 baseline)
> 这是 destructive 操作 — 任何意外发现立即 stop ping user

---

## 前置条件 verify

### 0.1 Branch 状态 verify

```bash
# meta2d.js 仓
cd D:/Codes/web/beepower/meta2d.js
git branch --show-current  # 应该看到 main(user 已完成 fast-forward)
git log --oneline -5       # 应该看到 P0 期间的 commits(ef67f9ff / 83618799 等)
git tag | grep P0          # 应该看到 P0-complete-2026-05-02

# V2 仓
cd D:/Codes/web/beepower/beepowertopology-v2
git branch --show-current  # 当前 branch
git log --oneline -5       # 当前 history
git tag | grep P0          # 应该看到 P0-complete-2026-05-02
```

如有任何异常,**stop ping user**。

### 0.2 Working tree clean verify

```bash
# meta2d.js
cd D:/Codes/web/beepower/meta2d.js
git status  # 必须 clean(no modified / no untracked,除了 packages/core/coverage/)

# V2
cd D:/Codes/web/beepower/beepowertopology-v2
git status  # leftover 应该只有 docs/refactor-strict-deep-2026/_handoff-debts.md
            # 和 P0 收口期 acknowledge 的 leftover 一致
```

如有意外 modified / untracked,**stop ping user**。

---

## Step 1 — meta2d.js 仓建立 docs/refactor-public-api/(空目录)

### 1.1 切到工作 branch

```bash
cd D:/Codes/web/beepower/meta2d.js
git checkout main  # confirm 在 main(已 fast-forward)
git checkout -b refactor/P0-cleanup  # 开 P0-cleanup branch(Day 0-7 工作 branch)
git branch --show-current  # verify 在 refactor/P0-cleanup
```

### 1.2 创建 docs/ 目录(如果不存在)

```bash
mkdir -p docs/refactor-public-api/_archived
ls -la docs/  # verify 目录创建
```

### 1.3 stop ping user verify

ping 内容:

```
meta2d.js refactor/P0-cleanup branch 创建 ✅
docs/refactor-public-api/ + _archived/ 空目录就位

下一步:从 V2 仓 copy refactor-public-api/ 内容过来。

continue?
```

**等 user 显式 GO 后再 Step 2**。

---

## Step 2 — 从 V2 仓 copy 文件过来(不动 V2 仓)

> 注意:跨仓 git mv 不存在(git 不支持跨 repo mv)。
> 实际做法:**meta2d 仓 cp + git add**,然后 V2 仓单独 git rm。
> 两仓 history 各自独立,跨仓引用通过 commit message。

### 2.1 V2 仓内容 inventory

```bash
cd D:/Codes/web/beepower/beepowertopology-v2/docs/refactor-public-api/
ls -la  # 列全部文件
find . -type f -not -path "./_archived/*" | sort  # 排除 _archived 主体文件
find . -type f -path "./_archived/*" | sort  # _archived 内容
```

预期输出大约:

```
./00-master-plan.md
./02-public-api-surface.md
./03-mece-decomposition.md
./10-phase-0-scope.md
./11a-canvas-api-inventory.md
./11b-core-api-inventory.md
./11c-render-api-inventory.md
./11d-satellite-call-sites.md
./11e-v2-call-sites.md
./11f-implicit-behaviors.md
./11g-surface-mapping-report.md
./11h-surface-gaps.md
./99-progress.md
./AI-PROMPT.md
./README.md
./_archived/00-master-plan-v0.1-archived.md
./_archived/_handoff-debts.md
```

### 2.2 stop ping user verify file list

ping 内容:

```
V2 仓 docs/refactor-public-api/ inventory:

主体文件: <file count> (00 + 02 + 03 + 10 + 11a-h + 99 + AI-PROMPT + README)
_archived/ 内: <file count> (master-plan v0.1 + _handoff-debts)

预期 17 个文件 + 1 个 _archived/ 目录
实测 <X> 个文件

inventory 一致?
```

**等 user 确认 inventory 后再 Step 3**。

---

## Step 3 — Copy 文件到 meta2d 仓(不 git rm V2 仓)

### 3.1 Copy 操作(单向 — V2 → meta2d)

```bash
# 在 meta2d.js cwd
cd D:/Codes/web/beepower/meta2d.js

# Copy 主体文件
cp ../beepowertopology-v2/docs/refactor-public-api/00-master-plan.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/02-public-api-surface.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/03-mece-decomposition.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/10-phase-0-scope.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/11a-canvas-api-inventory.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/11b-core-api-inventory.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/11c-render-api-inventory.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/11d-satellite-call-sites.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/11e-v2-call-sites.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/11f-implicit-behaviors.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/11g-surface-mapping-report.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/11h-surface-gaps.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/99-progress.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/AI-PROMPT.md docs/refactor-public-api/
cp ../beepowertopology-v2/docs/refactor-public-api/README.md docs/refactor-public-api/

# Copy _archived/
cp ../beepowertopology-v2/docs/refactor-public-api/_archived/00-master-plan-v0.1-archived.md docs/refactor-public-api/_archived/
cp ../beepowertopology-v2/docs/refactor-public-api/_archived/_handoff-debts.md docs/refactor-public-api/_archived/
```

### 3.2 Verify copy

```bash
cd D:/Codes/web/beepower/meta2d.js
find docs/refactor-public-api -type f | sort  # 应该看到全部 17 文件
diff -r docs/refactor-public-api ../beepowertopology-v2/docs/refactor-public-api
# 应该输出空(完全一致),除了 cross-chasm-v2-deltas.md(meta2d 仓即将新增,V2 仓没有)
```

### 3.3 添加 cross-chasm-v2-deltas.md(Day 0a 起草成果)

```bash
# user 把 Day 0a 起草的 cross-chasm-v2-deltas.md 放到
# D:/Codes/web/beepower/meta2d.js/docs/refactor-public-api/cross-chasm-v2-deltas.md
# (从 /mnt/user-data/outputs/day0/cross-chasm-v2-deltas.md copy 过去)

ls -la docs/refactor-public-api/cross-chasm-v2-deltas.md  # verify 文件就位
```

### 3.4 git add + verify staged

```bash
cd D:/Codes/web/beepower/meta2d.js
git add docs/refactor-public-api/
git status  # verify staged 是 18 个新文件 + _archived/ 2 文件
git diff --cached --stat  # show 全部新增 + line count
```

### 3.5 stop ping user verify

ping 内容:

```
meta2d.js 仓 docs/refactor-public-api/ copy 完成:

  主体: 15 文件(原 V2 17 - README + AI-PROMPT 暂保留过期版,Day 5 重写)
       17 文件 + cross-chasm-v2-deltas.md = 18 文件
  _archived/: 2 文件
  总: 20 个 staged 文件

git diff --cached --stat 显示:
[Claude Code 输出实际 stat]

continue 到 commit?
```

**等 user GO 后再 Step 4**。

---

## Step 4 — Commit + push 到 user fork

### 4.1 Commit message 起草

```bash
git commit -m "docs: migrate refactor-public-api/ from beepowertopology-v2

P0 collision + sealed in V2 仓(beepowertopology-v2 commit 0339b1b,
tag P0-complete-2026-05-02)。本 commit 起后续 P1+ 演化在 meta2d.js 仓。

迁移内容:
- 8 P0 产出(11a-h)
- 99-progress.md(P0 期间 history,1749 行,Day 3 重组三块结构)
- 00-master-plan.md(Day 5 改名 + 小修)
- 02-public-api-surface.md(P0 final + 1 修订项 P1 处理)
- 03-mece-decomposition.md(P0 final,P1 spike 期间 verify)
- 10-phase-0-scope.md(P0 final + Day 4 改 phases/P0/scope.md)
- AI-PROMPT.md(过期 v1,Day 5 重写)
- README.md(过期 v1,Day 5 重写)
- _archived/(旧 master plan v0.1 + _handoff-debts)
- cross-chasm-v2-deltas.md(Day 0a 起草,Day 1-7 实践期间持续 append)

后续 V2 仓 docs/refactor-public-api/ 单独 commit 删除(handle in Step 5)。

Refs: beepowertopology-v2@0339b1b, beepowertopology-v2@P0-complete-2026-05-02
"
```

### 4.2 Verify commit

```bash
git log --oneline -3
git show HEAD --stat | head -30
```

### 4.3 push 到 user fork(不是 upstream le5le-com)

```bash
git remote -v  # verify origin 是 user fork
git push origin refactor/P0-cleanup
```

### 4.4 stop ping user verify

ping 内容:

```
meta2d.js refactor/P0-cleanup branch commit ✅
- commit hash: <sha>
- 20 文件 / <line count> lines
- pushed to origin (user fork)

remote verify:
  origin = <user fork URL>(不是 le5le-com)

continue 到 V2 仓清理(Step 5)?
```

**等 user GO 后再 Step 5**。

---

## Step 5 — V2 仓单独 commit 删除 docs/refactor-public-api/

### 5.1 切换 cwd 到 V2 仓

```bash
cd D:/Codes/web/beepower/beepowertopology-v2
git status  # verify clean(除 leftover handoff-debts.md)
git branch --show-current
```

### 5.2 destructive verify(再次 step a)

```bash
ls -la docs/refactor-public-api/
# Show what we're about to delete
git ls-files docs/refactor-public-api/ | wc -l  # tracked files count
```

### 5.3 stop ping user

ping 内容:

```
V2 仓即将删除:
  docs/refactor-public-api/ 目录(<file count> tracked files)

理由:已迁移到 meta2d.js 仓(meta2d.js commit <sha>,refactor/P0-cleanup branch)

V2 仓 P0-complete-2026-05-02 tag 仍存在(指向 0339b1b commit,P0 期间产出
sealed snapshot,history immutable),不删 tag。

V2 仓 P0 final commit 0339b1b 仍存在(historical),只是 working tree 不再
有 docs/refactor-public-api/ 目录。

destructive操作 — user 显式 GO 后执行?
```

**等 user 显式 "GO 删除 V2 仓 docs/refactor-public-api/" 后再 Step 5.4**。

### 5.4 git rm + commit

```bash
cd D:/Codes/web/beepower/beepowertopology-v2
git rm -rf docs/refactor-public-api/
git status  # verify staged deletion
git diff --cached --stat | head -10  # show what's deleted
git commit -m "docs: remove refactor-public-api/ (migrated to meta2d.js)

P0 期间产出 sealed in V2 仓 commit 0339b1b + tag P0-complete-2026-05-02
(history immutable,不动)。

后续 P1+ 演化在 meta2d.js 仓 docs/refactor-public-api/。
跨仓 reference: meta2d.js@<meta2d new commit sha>

V2 仓 docs/ 后续仅 V2 主线工作产物(REFACTOR-BRIEF.md / handoff.md / 
ADR-graphics-architecture-v3.1.md / etc),不再混入 meta2d 重构文档。

Refs: meta2d.js@<sha>
"
```

注意:`Refs: meta2d.js@<sha>` 应该是 Step 4 的 meta2d 仓新 commit hash。

### 5.5 V2 push(可选 — V2 仓 local-first acknowledge)

V2 仓 P0 收口期 acknowledge skip push(无 remote 配置)。

```bash
git remote -v  # verify 仍然空 / 仍然 local-only
# skip push
```

### 5.6 stop ping user verify

ping 内容:

```
V2 仓 docs/refactor-public-api/ 删除 ✅
- commit hash: <sha>
- <file count> 文件删除 / <line count> lines

V2 仓 working tree 状态:
  docs/(只剩 V2 主线文档)
  剩 untracked: docs/refactor-strict-deep-2026/_handoff-debts.md(P0 acknowledge leftover)

push: skip(local-only,P0 期间 acknowledge)

跨仓 history 一致性:
- meta2d.js 仓: P0 期间 history immutable(refactor/strict-deep-2026-04)
                 + main(fast-forward)
                 + refactor/P0-cleanup(本次迁移 + 后续 Day 1-7 工作)
- V2 仓: 0339b1b(P0 final commit,docs sealed in V2)
         + <new commit>(docs removed,migrated to meta2d)
         + tag P0-complete-2026-05-02 仍指向 0339b1b(immutable)

Day 0b 文档迁移完成 ✅
```

---

## Step 6(本协议外 — user 手工 / Day 1 起草前准备)

Step 5 完成后,后续 Day 1 起草工作的 cwd:

```bash
cd D:/Codes/web/beepower/meta2d.js
git checkout refactor/P0-cleanup
ls docs/refactor-public-api/  # 工作目录 ready
```

之后 Day 1-7 起草工作全部在 meta2d.js cwd + refactor/P0-cleanup branch。

---

## 异常处理

### 异常 1 — Step 1.1 fast-forward 没完成

如果 user 实际上没 fast-forward(`git branch --show-current` 显示 `refactor/strict-deep-2026-04` 而非 `main`),stop ping:

```
Choice 3-Y 显示 user 已 fast-forward,但实测 main 不是 latest。
需要 user 先做:
  git checkout main
  git merge --ff-only refactor/strict-deep-2026-04
  git push origin main --tags

verify 后 ping 我 continue。
```

### 异常 2 — Step 2.2 inventory 不匹配

如果实测文件数 != 17,stop ping 列出差异让 user verify。

### 异常 3 — Step 3.2 diff 不空

如果 copy 后 diff 显示有差异(应该完全一致),stop ping 列差异原因(可能 V2 仓有 user 后期手工编辑过的内容?)。

### 异常 4 — Step 4.3 push 失败(权限 / branch 不存在)

stop ping,user verify GitHub fork remote 配置 + branch push 权限。

---

**End of Day 0b migration protocol**