import { query } from './db';

export async function initializeDatabase() {
  try {
    // ── Users table ──────────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        avatar_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] Users table initialized');

    // ── Sessions table ───────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      )
    `);
    console.log('[DB] Sessions table initialized');

    // ── Employees table ──────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        employee_code VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        department VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        avatar_initials VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] Employees table initialized');

    // ── Attendance records table ─────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id SERIAL PRIMARY KEY,
        employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        clock_in TIME,
        clock_out TIME,
        status VARCHAR(50) DEFAULT 'present',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (employee_id, date)
      )
    `);
    console.log('[DB] Attendance records table initialized');

    // ── Leaves table ─────────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS leaves (
        id SERIAL PRIMARY KEY,
        employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        leave_type VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        reviewed_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] Leaves table initialized');

    // ── Seed sample employees if table is empty ──────────────────────────────
    const empCheck = await query('SELECT COUNT(*) FROM employees');
    if (parseInt(empCheck.rows[0].count) === 0) {
      await query(`
        INSERT INTO employees (employee_code, full_name, email, phone, department, position, status, avatar_initials)
        VALUES
          ('EMP001', 'Juan dela Cruz', 'juan.delacruz@company.com', '+63-917-123-4567', 'Engineering', 'Senior Developer', 'active', 'JD'),
          ('EMP002', 'Maria Santos', 'maria.santos@company.com', '+63-918-234-5678', 'Engineering', 'Frontend Developer', 'active', 'MS'),
          ('EMP003', 'Mark Reyes', 'mark.reyes@company.com', '+63-919-345-6789', 'Design', 'UI/UX Designer', 'active', 'MR'),
          ('EMP004', 'Anna Garcia', 'anna.garcia@company.com', '+63-920-456-7890', 'QA', 'QA Engineer', 'active', 'AG'),
          ('EMP005', 'Paolo Mendoza', 'paolo.mendoza@company.com', '+63-921-567-8901', 'DevOps', 'DevOps Engineer', 'active', 'PM'),
          ('EMP006', 'Kristine Bautista', 'kristine.bautista@company.com', '+63-922-678-9012', 'HR', 'HR Manager', 'active', 'KB'),
          ('EMP007', 'Miguel Villanueva', 'miguel.villanueva@company.com', '+63-923-789-0123', 'Engineering', 'Backend Developer', 'active', 'MV'),
          ('EMP008', 'Patricia Cruz', 'patricia.cruz@company.com', '+63-924-890-1234', 'Marketing', 'Marketing Lead', 'active', 'PC')
      `);
      console.log('[DB] Sample employees seeded');
    }

    return true;
  } catch (error) {
    console.error('[DB] Failed to initialize database:', error);
    throw error;
  }
}
