@echo off
echo Clearing database for testing...
node scripts/apply-sql.cjs scripts/clear-test-data.sql
echo Database cleared! You can now test with fresh data.
pause
