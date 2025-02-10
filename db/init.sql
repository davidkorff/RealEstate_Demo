CREATE DATABASE housing_complex;

\c housing_complex;

CREATE TABLE residents (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    unit_number VARCHAR(50) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) DEFAULT 'resident'
);

CREATE TABLE maintenance_requests (
    id SERIAL PRIMARY KEY,
    resident_id INTEGER REFERENCES residents(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_residents_email ON residents(email);
CREATE INDEX idx_maintenance_requests_resident_id ON maintenance_requests(resident_id);
CREATE INDEX idx_announcements_expires_at ON announcements(expires_at);
CREATE INDEX idx_residents_role ON residents(role);

INSERT INTO announcements (title, content, expires_at) VALUES
('Welcome to Our Portal', 'We are excited to launch our new resident portal. Please feel free to explore all the features!', NOW() + INTERVAL '30 days'),
('Maintenance Schedule', 'Regular maintenance checks will be conducted every first Monday of the month.', NOW() + INTERVAL '60 days'),
('Holiday Office Hours', 'The management office will have modified hours during the upcoming holidays.', NOW() + INTERVAL '15 days');

INSERT INTO residents (email, password, unit_number, first_name, last_name, role) 
VALUES (
    'staff@example.com', 
    '$2a$10$rPQcHDAHbXPh7bWO8F.NwOKsLdI1Aq3gGRVmz6QqRRg/4VzLFgd.O',
    'STAFF',
    'Staff',
    'Admin',
    'staff'
); 