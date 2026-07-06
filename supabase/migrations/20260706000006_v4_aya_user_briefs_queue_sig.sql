-- Cache-bust the per-user staff brief when the queue it summarizes changes.
-- queue_sig = a short signature of the caller's top tasks (ids + statuses); the
-- aya-my-brief edge fn regenerates when it differs, so the brief never keeps
-- naming a task the worker already finished. The 2h TTL is only a backstop.
ALTER TABLE public.aya_user_briefs ADD COLUMN IF NOT EXISTS queue_sig text;
