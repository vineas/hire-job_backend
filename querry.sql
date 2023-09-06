-- TABLE USERS

CREATE TABLE
    pekerja (
        pekerja_id VARCHAR NOT NULL PRIMARY KEY,
        pekerja_name VARCHAR(255),
        pekerja_email VARCHAR(255),
        pekerja_phone VARCHAR(255),
        pekerja_password VARCHAR(255),
        pekerja_confirmpassword VARCHAR(255),
        pekerja_photo VARCHAR(255),
        pekerja_jobdesk VARCHAR(255),
        pekerja_domisili VARCHAR(255),
        pekerja_tempat_kerja VARCHAR(255),
        pekerja_deskripsi VARCHAR(255)
    );

CREATE TABLE
    skill (
        skill_id VARCHAR PRIMARY KEY,
        skill_name VARCHAR(255) NOT NULL,
        pekerja_id VARCHAR(255)
    );

CREATE TABLE
    portofolio (
        portofolio_id VARCHAR PRIMARY KEY,
        portofolio_name VARCHAR(255),
        link_repository VARCHAR(255),
        portofolio_image VARCHAR(255),
        pekerja_id VARCHAR(255)
    );
        -- portofolio_type VARCHAR(20),

CREATE TABLE
    pengalaman_kerja (
        pengalaman_kerja_id VARCHAR PRIMARY KEY,
        posisi VARCHAR(255),
        nama_perusahaan VARCHAR(255),
        dari VARCHAR(255),
        sampai VARCHAR(255),
        deskripsi VARCHAR(255),
        pekerja_id VARCHAR(255)
    );

CREATE TABLE
    perekrut (
        perekrut_id VARCHAR NOT NULL PRIMARY KEY,
        perekrut_name VARCHAR(255),
        perekrut_email VARCHAR(255),
        perekrut_perusahaan VARCHAR(255),
        perekrut_jabatan VARCHAR(255),
        perekrut_phone VARCHAR(255),
        perekrut_password VARCHAR(255),
        perekrut_confirmpassword VARCHAR(255),
        perekrut_photo VARCHAR(255),
        perekrut_bidang VARCHAR(255),
        perekrut_kota VARCHAR(255),
        perekrut_deskripsi VARCHAR(255),
        perekrut_instagram VARCHAR(255),
        perekrut_linkedin VARCHAR(255)
    );