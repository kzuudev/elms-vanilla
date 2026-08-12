-- ELMS learning seed (sample data only)
-- Password for ALL seeded users: password
-- Run AFTER schema exists. Prefer a dedicated learning DB reset.
--
-- Insert order matters (parents before children):
--   1) leave_types
--   2) users (managers before employees who reference them)
--   3) leave_balance
--   4) optional leave_requests / notifications
--
-- Safe reset for LEARNING only (wipes data):
--   SET FOREIGN_KEY_CHECKS = 0;
--   TRUNCATE TABLE notifications;
--   TRUNCATE TABLE personal_access_tokens;
--   TRUNCATE TABLE email_verification_token;
--   TRUNCATE TABLE leave_requests;
--   TRUNCATE TABLE leave_balance;
--   TRUNCATE TABLE users;
--   TRUNCATE TABLE leave_types;
--   SET FOREIGN_KEY_CHECKS = 1;
--   then run this file.

SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- 1) leave_types (parent / lookup)
-- ------------------------------------------------------------
INSERT INTO leave_types (id, name, default_allocated_days, is_paid) VALUES
  (1, 'Vacation', 15, 1),
  (2, 'Sick', 10, 1),
  (3, 'Emergency', 5, 0);

-- ------------------------------------------------------------
-- 2) users
-- bcrypt hash below = password_hash('password', PASSWORD_BCRYPT)
-- ------------------------------------------------------------
INSERT INTO users (
  id, first_name, last_name, email, password, role, department,
  assigned_to, is_active, hired_date, phone, email_verified_at, deleted_at
) VALUES
  (1, 'Ada', 'Admin', 'admin@elms.test',
   '$2y$12$.E7XJG2rB2HJBN18WjdUruzhFCyQfHPtS/idV/y71n1Rb5P57P/P.',
   'admin', 'IT', NULL, 1, '2024-01-15', '09170000001', CURRENT_TIMESTAMP, NULL),

  (2, 'Morgan', 'Manager', 'manager@elms.test',
   '$2y$12$.E7XJG2rB2HJBN18WjdUruzhFCyQfHPtS/idV/y71n1Rb5P57P/P.',
   'manager', 'IT', 1, 1, '2024-02-01', '09170000002', CURRENT_TIMESTAMP, NULL),

  (3, 'John Kevin', 'Dela Cruz', 'johnkevin@elms.test',
   '$2y$12$.E7XJG2rB2HJBN18WjdUruzhFCyQfHPtS/idV/y71n1Rb5P57P/P.',
   'employee', 'IT', 2, 1, '2024-03-01', '09170000003', CURRENT_TIMESTAMP, NULL),

  (4, 'John Andrei', 'Mayagma', 'johnandrei@elms.test',
   '$2y$12$.E7XJG2rB2HJBN18WjdUruzhFCyQfHPtS/idV/y71n1Rb5P57P/P.',
   'employee', 'IT', 2, 1, '2024-03-15', '09170000004', CURRENT_TIMESTAMP, NULL);

-- ------------------------------------------------------------
-- 3) leave_balance (one row per user + leave type)
-- ------------------------------------------------------------
INSERT INTO leave_balance (user_id, leave_type_id, allocated_days, used_days, remaining_balance) VALUES
  -- manager also has balances (optional but useful)
  (2, 1, 15.00, 0.00, 15.00),
  (2, 2, 10.00, 0.00, 10.00),
  (2, 3,  5.00, 0.00,  5.00);
  (2, 4, 10.00, 0.00, 10.00),
  (2, 5, 10.00, 0.00, 10.00),
  (2, 6, 10.00, 0.00, 10.00),
  (2, 7, 10.00, 0.00, 10.00),
  (2, 8, 10.00, 0.00, 10.00),
  (2, 9, 10.00, 0.00, 10.00),
  (2, 10, 10.00, 0.00, 10.00),

    -- employee 3
  (3, 1, 15.00, 0.00, 15.00),
  (3, 2, 10.00, 0.00, 10.00),
  (3, 3,  5.00, 0.00,  5.00),
  (3, 4, 10.00, 0.00, 10.00),
  (3, 5, 10.00, 0.00, 10.00),
  (3, 6, 10.00, 0.00, 10.00),
  (3, 7, 10.00, 0.00, 10.00),
  (3, 8, 10.00, 0.00, 10.00),
  (3, 9, 10.00, 0.00, 10.00),
  (3, 10, 10.00, 0.00, 10.00),
  
  -- employee 4
  (4, 1, 15.00, 0.00, 15.00),
  (4, 2, 10.00, 0.00, 10.00),
  (4, 3,  5.00, 0.00,  5.00),
  (4, 4, 10.00, 0.00, 10.00),
  (4, 5, 10.00, 0.00, 10.00),
  (4, 6, 10.00, 0.00, 10.00),
  (4, 7, 10.00, 0.00, 10.00),
  (4, 8, 10.00, 0.00, 10.00),
  (4, 9, 10.00, 0.00, 10.00),
  (4, 10, 10.00, 0.00, 10.00),


-- ------------------------------------------------------------
-- 4) sample leave_requests (optional — for review testing)
-- ------------------------------------------------------------
-- INSERT INTO leave_requests (
--   id, user_id, leave_type_id, start_date, end_date, total_days,
--   reason, status, assigned_to, rejection_reason, deleted_at
-- ) VALUES
--   (1, 3, 1, '2026-08-18', '2026-08-20', 3,
--    'Family trip', 'pending', 2, NULL, NULL),
--   (2, 4, 2, '2026-08-12', '2026-08-12', 1,
--    'Doctor appointment', 'pending', 2, NULL, NULL);

-- Optional: reset AUTO_INCREMENT after fixed IDs
ALTER TABLE leave_types AUTO_INCREMENT = 4;
ALTER TABLE users AUTO_INCREMENT = 5;
ALTER TABLE leave_requests AUTO_INCREMENT = 3;
