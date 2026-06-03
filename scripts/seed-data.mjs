import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  console.log('Seeding Filipino employees and attendance data...');
  try {
    // Clear tables
    await pool.query('DELETE FROM attendance_records');
    await pool.query('DELETE FROM leaves');
    await pool.query('DELETE FROM employees');

    // Insert employees
    const empQuery = `
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
      RETURNING id;
    `;
    const res = await pool.query(empQuery);
    const employeeIds = res.rows.map(row => row.id);

    // Generate attendance records from May 1 to June 30
    const startDate = new Date('2026-05-01');
    const endDate = new Date('2026-06-30');
    
    let records = [];
    const statuses = ['present', 'present', 'present', 'present', 'late', 'absent', 'on_leave'];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      // Skip weekends
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      
      const dateStr = d.toISOString().split('T')[0];
      
      for (const empId of employeeIds) {
        // Randomly pick status
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        let clockIn = null;
        let clockOut = null;
        
        if (status === 'present') {
          clockIn = '08:5' + Math.floor(Math.random() * 9) + ':00';
          clockOut = '17:0' + Math.floor(Math.random() * 9) + ':00';
        } else if (status === 'late') {
          clockIn = '09:3' + Math.floor(Math.random() * 9) + ':00';
          clockOut = '17:3' + Math.floor(Math.random() * 9) + ':00';
        }
        
        records.push(`(${empId}, '${dateStr}', ${clockIn ? `'${clockIn}'` : 'NULL'}, ${clockOut ? `'${clockOut}'` : 'NULL'}, '${status}')`);
      }
    }

    // Insert records in batches
    const batchSize = 100;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await pool.query(`
        INSERT INTO attendance_records (employee_id, date, clock_in, clock_out, status)
        VALUES ${batch.join(', ')}
      `);
    }

    console.log('Successfully seeded database with Filipino names and May-June attendance data!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await pool.end();
  }
}

run();
