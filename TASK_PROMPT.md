数仓值班又在吵 outbox：业务库先写业务行再写 outbox 事件，投递侧乱序到达，下游还得幂等去重，tombstone 不能被旧版本复活。仓库里有个半成品，你补到 npm test 全过。别碰 Docker。

目标：
1) 打开 index.html（npm start 或 python3 -m http.server 8823 --directory .），左结果右控制，成功时 #status=ready。
2) src/outbox.js：`OutboxQueue`——`append(event)` 持久化（内存即可）`{id, key, version, op, ts, payload}`；`listAfter(cursor)` 按追加序返回。
3) src/reorderBuffer.js：`ReorderBuffer(maxHoldMs)`——`offer(event, now)`：按 key 维护版本；若 event.version < 已提交版本则记为 stale；允许在窗口内缓冲乱序，超时仍可按到达投递但标记 late；返回动作列表（hold/emit/stale/late）。
4) src/idempotentSink.js：`IdempotentSink`——`apply(event)`：同一 event.id 只生效一次；按 key 保留最高 version；op=delete 写 tombstone，之后更低 version 的 upsert 不得复活；返回 `{applied:boolean, reason?}`。
5) src/engine.js：吃 fixtures/events.jsonl，模拟乱序到达，经 reorder → sink；#stats 至少 emitted / stale / late / applied / skipped。
6) UI：Load / Run / Export；错误写 #status。
7) 原生 ESM，别改弱测试。分多次短命令写文件，写完就跑 npm test，红了接着修到绿。
