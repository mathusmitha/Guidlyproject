-- Seed streams
INSERT INTO streams (name, slug, description, icon) VALUES
('Engineering & Technology', 'engineering', 'Computer Science, Mechanical, Civil, Electrical and more', 'Cpu'),
('Medical & Health Sciences', 'medical', 'MBBS, BDS, Nursing, Pharmacy and allied health', 'Stethoscope'),
('Commerce & Management', 'commerce', 'B.Com, BBA, CA, CS and business management', 'Briefcase'),
('Arts & Humanities', 'arts', 'Literature, Psychology, Sociology, History and languages', 'BookOpen'),
('Science', 'science', 'B.Sc Physics, Chemistry, Biology, Mathematics', 'Atom'),
('Law', 'law', 'LLB, BA LLB and legal studies', 'Scale'),
('Design & Architecture', 'design', 'B.Des, B.Arch and creative design fields', 'PenTool')
ON CONFLICT (slug) DO NOTHING;

-- Seed courses
INSERT INTO courses (name, slug, description, stream_id, duration_years, level, avg_fees, career_prospects, skills_gained) VALUES
('B.Tech Computer Science', 'btech-cse', 'Four-year engineering degree focused on computing, algorithms, and software development.', (SELECT id FROM streams WHERE slug='engineering'), 4, 'UG', 800000, 'Software Engineer, Data Scientist, AI/ML Engineer, Product Manager', ARRAY['Programming','Data Structures','Algorithms','Software Design','Databases']),
('B.Tech Mechanical', 'btech-mech', 'Engineering degree in mechanical systems, thermodynamics, and manufacturing.', (SELECT id FROM streams WHERE slug='engineering'), 4, 'UG', 600000, 'Design Engineer, Automotive Engineer, Manufacturing Manager', ARRAY['Thermodynamics','CAD','Manufacturing','Materials']),
('B.Tech Electronics', 'btech-ece', 'Electronics and communication engineering covering circuits, signals, and embedded systems.', (SELECT id FROM streams WHERE slug='engineering'), 4, 'UG', 700000, 'Embedded Engineer, VLSI Designer, Telecom Engineer', ARRAY['Circuits','Signal Processing','Embedded Systems','VLSI']),
('MBBS', 'mbbs', 'Bachelor of Medicine and Bachelor of Surgery — the path to becoming a doctor.', (SELECT id FROM streams WHERE slug='medical'), 5.5, 'UG', 1500000, 'General Physician, Surgeon, Specialist Doctor', ARRAY['Anatomy','Diagnosis','Patient Care','Pharmacology']),
('BDS', 'bds', 'Bachelor of Dental Surgery for a career in dentistry.', (SELECT id FROM streams WHERE slug='medical'), 5, 'UG', 1000000, 'Dentist, Dental Surgeon, Oral Health Consultant', ARRAY['Dental Surgery','Oral Health','Patient Care']),
('B.Com', 'bcom', 'Undergraduate degree in accounting, finance, and business studies.', (SELECT id FROM streams WHERE slug='commerce'), 3, 'UG', 150000, 'Accountant, Financial Analyst, Auditor', ARRAY['Accounting','Finance','Taxation','Business Law']),
('BBA', 'bba', 'Bachelor of Business Administration — foundation in management and leadership.', (SELECT id FROM streams WHERE slug='commerce'), 3, 'UG', 300000, 'Business Analyst, Marketing Manager, HR Manager', ARRAY['Management','Marketing','Finance','Leadership']),
('B.A. Psychology', 'ba-psychology', 'Study of human behavior, mental health, and counseling.', (SELECT id FROM streams WHERE slug='arts'), 3, 'UG', 200000, 'Counselor, HR Specialist, Clinical Psychologist (with PG)', ARRAY['Counseling','Research','Behavioral Analysis','Communication']),
('B.Sc Physics', 'bsc-physics', 'Fundamental and applied physics with lab and research exposure.', (SELECT id FROM streams WHERE slug='science'), 3, 'UG', 180000, 'Research Scientist, Data Analyst, Teacher', ARRAY['Mathematical Modeling','Lab Techniques','Research','Analytics']),
('B.A. English Literature', 'ba-english', 'In-depth study of literature, language, and critical theory.', (SELECT id FROM streams WHERE slug='arts'), 3, 'UG', 120000, 'Content Writer, Editor, Teacher, Civil Services', ARRAY['Critical Thinking','Writing','Communication','Analysis']),
('BA LLB', 'ballb', 'Integrated five-year law degree after 12th.', (SELECT id FROM streams WHERE slug='law'), 5, 'UG', 500000, 'Advocate, Legal Advisor, Corporate Lawyer, Judge', ARRAY['Legal Research','Argumentation','Drafting','Constitutional Law']),
('B.Des', 'bdes', 'Bachelor of Design for product, UX, and visual design careers.', (SELECT id FROM streams WHERE slug='design'), 4, 'UG', 400000, 'UX Designer, Product Designer, Graphic Designer', ARRAY['Design Thinking','Prototyping','Visual Design','User Research'])
ON CONFLICT (slug) DO NOTHING;

-- Seed colleges
INSERT INTO colleges (name, slug, description, city, state, type, established_year, rating, total_reviews, website_url, image_url) VALUES
('Indian Institute of Technology Delhi', 'iit-delhi', 'Premier engineering institution known for research and innovation.', 'New Delhi', 'Delhi', 'Public', 1961, 4.8, 320, 'https://iitd.ac.in', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'),
('Indian Institute of Technology Bombay', 'iit-bombay', 'Top-ranked engineering college with strong industry connections.', 'Mumbai', 'Maharashtra', 'Public', 1958, 4.8, 410, 'https://iitb.ac.in', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'),
('All India Institute of Medical Sciences', 'aiims-delhi', 'India''s leading medical college and hospital.', 'New Delhi', 'Delhi', 'Public', 1956, 4.9, 280, 'https://aiims.edu', 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg'),
('Lady Shri Ram College for Women', 'lsr-delhi', 'Renowned arts and commerce college under Delhi University.', 'New Delhi', 'Delhi', 'Public', 1956, 4.6, 190, 'https://lsr.edu.in', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'),
('St. Xavier''s College', 'st-xaviers', 'Prestigious institution for arts, science, and commerce.', 'Mumbai', 'Maharashtra', 'Private', 1869, 4.5, 230, 'https://xaviers.edu', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'),
('National Law School of India University', 'nlsiu', 'Top law university in India.', 'Bengaluru', 'Karnataka', 'Public', 1986, 4.7, 150, 'https://nls.ac.in', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'),
('National Institute of Design', 'nid', 'India''s foremost design institute.', 'Ahmedabad', 'Gujarat', 'Public', 1961, 4.7, 120, 'https://nid.edu', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'),
('Christ University', 'christ', 'Deemed university offering diverse programs.', 'Bengaluru', 'Karnataka', 'Deemed', 1969, 4.4, 340, 'https://christuniversity.in', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg')
ON CONFLICT (slug) DO NOTHING;

-- Seed college-course mappings
INSERT INTO college_courses (college_id, course_id, annual_fees, eligibility, seats) VALUES
((SELECT id FROM colleges WHERE slug='iit-delhi'), (SELECT id FROM courses WHERE slug='btech-cse'), 250000, 'JEE Advanced — top rank', 120),
((SELECT id FROM colleges WHERE slug='iit-delhi'), (SELECT id FROM courses WHERE slug='btech-mech'), 250000, 'JEE Advanced', 80),
((SELECT id FROM colleges WHERE slug='iit-bombay'), (SELECT id FROM courses WHERE slug='btech-cse'), 250000, 'JEE Advanced — top rank', 140),
((SELECT id FROM colleges WHERE slug='iit-bombay'), (SELECT id FROM courses WHERE slug='btech-ece'), 250000, 'JEE Advanced', 80),
((SELECT id FROM colleges WHERE slug='aiims-delhi'), (SELECT id FROM courses WHERE slug='mbbs'), 50000, 'NEET — top rank', 125),
((SELECT id FROM colleges WHERE slug='lsr-delhi'), (SELECT id FROM courses WHERE slug='ba-psychology'), 30000, 'Class 12 with high marks', 60),
((SELECT id FROM colleges WHERE slug='lsr-delhi'), (SELECT id FROM courses WHERE slug='bcom'), 30000, 'Class 12 Commerce', 120),
((SELECT id FROM colleges WHERE slug='st-xaviers'), (SELECT id FROM courses WHERE slug='ba-english'), 25000, 'Class 12 with English', 80),
((SELECT id FROM colleges WHERE slug='st-xaviers'), (SELECT id FROM courses WHERE slug='bsc-physics'), 30000, 'Class 12 Science', 60),
((SELECT id FROM colleges WHERE slug='nlsiu'), (SELECT id FROM courses WHERE slug='ballb'), 250000, 'CLAT — top rank', 80),
((SELECT id FROM colleges WHERE slug='nid'), (SELECT id FROM courses WHERE slug='bdes'), 350000, 'NID DAT entrance', 100),
((SELECT id FROM colleges WHERE slug='christ'), (SELECT id FROM courses WHERE slug='bba'), 200000, 'Class 12 + interview', 180),
((SELECT id FROM colleges WHERE slug='christ'), (SELECT id FROM courses WHERE slug='bcom'), 150000, 'Class 12 Commerce', 240)
ON CONFLICT (college_id, course_id) DO NOTHING;

-- Seed career paths
INSERT INTO career_paths (title, slug, description, avg_salary, growth_outlook, recommended_courses, skills_required, industries) VALUES
('Software Engineer', 'software-engineer', 'Designs, builds, and maintains software applications and systems.', 1200000, 'High', ARRAY[(SELECT id FROM courses WHERE slug='btech-cse')], ARRAY['Programming','Problem Solving','System Design','Databases'], ARRAY['IT','Finance','Healthcare','E-commerce']),
('Data Scientist', 'data-scientist', 'Analyzes data to build predictive models and drive decisions.', 1500000, 'High', ARRAY[(SELECT id FROM courses WHERE slug='btech-cse'), (SELECT id FROM courses WHERE slug='bsc-physics')], ARRAY['Statistics','Python','Machine Learning','Data Visualization'], ARRAY['IT','Finance','Research','Retail']),
('Doctor', 'doctor', 'Diagnoses and treats patients across medical specialties.', 1200000, 'High', ARRAY[(SELECT id FROM courses WHERE slug='mbbs')], ARRAY['Diagnosis','Patient Care','Medical Knowledge','Empathy'], ARRAY['Healthcare','Research','Public Health']),
('Chartered Accountant', 'chartered-accountant', 'Manages accounting, auditing, and taxation for organizations.', 1000000, 'High', ARRAY[(SELECT id FROM courses WHERE slug='bcom')], ARRAY['Accounting','Taxation','Auditing','Finance'], ARRAY['Finance','Consulting','Corporate']),
('UX Designer', 'ux-designer', 'Designs intuitive and engaging user experiences for digital products.', 900000, 'High', ARRAY[(SELECT id FROM courses WHERE slug='bdes')], ARRAY['User Research','Prototyping','Visual Design','Empathy'], ARRAY['IT','Product','Design','E-commerce']),
('Corporate Lawyer', 'corporate-lawyer', 'Advises companies on legal compliance, contracts, and disputes.', 1500000, 'Medium', ARRAY[(SELECT id FROM courses WHERE slug='ballb')], ARRAY['Legal Research','Drafting','Negotiation','Analytical Thinking'], ARRAY['Law','Corporate','Consulting']),
('Clinical Psychologist', 'clinical-psychologist', 'Assesses and treats mental health disorders through therapy.', 700000, 'Medium', ARRAY[(SELECT id FROM courses WHERE slug='ba-psychology')], ARRAY['Counseling','Assessment','Empathy','Research'], ARRAY['Healthcare','Education','Social Work']),
('Mechanical Engineer', 'mechanical-engineer', 'Designs and manufactures mechanical systems and machinery.', 700000, 'Medium', ARRAY[(SELECT id FROM courses WHERE slug='btech-mech')], ARRAY['CAD','Thermodynamics','Manufacturing','Problem Solving'], ARRAY['Automotive','Manufacturing','Aerospace','Energy'])
ON CONFLICT (slug) DO NOTHING;
