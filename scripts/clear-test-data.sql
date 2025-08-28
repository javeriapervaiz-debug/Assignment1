-- Clear all test data from the database
-- WARNING: This will delete ALL users, sessions, and verification tokens!

-- Delete all verification tokens
DELETE FROM verification_tokens;

-- Delete all sessions
DELETE FROM sessions;

-- Delete all users
DELETE FROM users;

-- Reset auto-increment counters
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE sessions_id_seq RESTART WITH 1;
ALTER SEQUENCE verification_tokens_id_seq RESTART WITH 1;

-- Verify tables are empty
SELECT 'Users count:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Sessions count:', COUNT(*) FROM sessions
UNION ALL
SELECT 'Verification tokens count:', COUNT(*) FROM verification_tokens;
