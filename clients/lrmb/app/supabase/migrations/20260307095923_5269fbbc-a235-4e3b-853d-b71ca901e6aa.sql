CREATE POLICY "Users delete own photos on visible tasks"
ON public.task_photos FOR DELETE TO authenticated
USING (
  (uploaded_by = auth.uid()) AND EXISTS (
    SELECT 1 FROM tasks t WHERE t.id = task_photos.task_id
    AND (t.assigned_to = auth.uid() OR has_admin_access(auth.uid()))
  )
);