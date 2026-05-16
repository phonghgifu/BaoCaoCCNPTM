/**
 * Supabase RLS (Row Level Security) Policies
 * 
 * Advanced policies with complex logic for comments deletion
 * A comment can be deleted by:
 * 1. The comment author themselves
 * 2. The post author (who wrote the post the comment is on)
 * 
 * SQL Policy Implementation:
 */

-- Enable RLS on comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy: Everyone can view comments
CREATE POLICY "comments_select_policy" ON comments
  FOR SELECT USING (true);

-- 2. INSERT Policy: Authenticated users can insert comments
CREATE POLICY "comments_insert_policy" ON comments
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

-- 3. UPDATE Policy: Only comment author can update
CREATE POLICY "comments_update_policy" ON comments
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. DELETE Policy: Comment author OR post author can delete
CREATE POLICY "comments_delete_policy" ON comments
  FOR DELETE USING (
    auth.uid() = user_id  -- Comment author
    OR 
    auth.uid() = (  -- Post author
      SELECT user_id FROM posts WHERE posts.id = comments.post_id
    )
  );

-- Advanced alternative using JSON approach:
-- CREATE POLICY "comments_delete_advanced" ON comments
--   FOR DELETE USING (
--     auth.uid() IN (
--       -- Get the comment author
--       SELECT user_id FROM (SELECT auth.uid() as user_id) as self
--       WHERE self.user_id = comments.user_id
--       
--       UNION
--       
--       -- Get the post author
--       SELECT posts.user_id FROM posts 
--       WHERE posts.id = comments.post_id
--     )
--   );

/**
 * Explanation of the Policy:
 * 
 * - `auth.uid()` = Current authenticated user ID
 * - `comments.user_id` = The user who wrote the comment
 * - `posts.user_id` = The user who wrote the post
 * 
 * The DELETE policy uses two conditions joined with OR:
 * 1. `auth.uid() = user_id` → The current user is the comment author
 * 2. `auth.uid() = (SELECT user_id FROM posts...)` → The current user is the post author
 * 
 * Testing the policy:
 * - User A writes a comment on User B's post
 * - User A can delete their comment ✓
 * - User B (post author) can delete User A's comment ✓
 * - User C cannot delete the comment ✗
 */

-- Example test queries (run as different users):
-- SELECT * FROM comments WHERE id = 'comment-uuid'; -- Everyone can view
-- 
-- INSERT INTO comments (post_id, user_id, content) -- Only if user_id = current user
-- VALUES ('post-id', auth.uid(), 'Comment text');
-- 
-- DELETE FROM comments WHERE id = 'comment-id'; -- Only comment author or post author
