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

-- =========================================================

CREATE TABLE
    pekerja (
        pekerja_id VARCHAR NOT NULL PRIMARY KEY,
        pekerja_name VARCHAR,
        pekerja_email VARCHAR,
        pekerja_phone VARCHAR,
        pekerja_password VARCHAR,
        pekerja_confirmpassword VARCHAR,
        pekerja_photo VARCHAR,
        pekerja_jobdesk VARCHAR,
        pekerja_domisili VARCHAR,
        pekerja_tempat_kerja VARCHAR,
        pekerja_deskripsi TEXT,
        verify text not null,
        created_on timestamp default CURRENT_TIMESTAMP not null,
        updated_on timestamp default CURRENT_TIMESTAMP not null
    );

CREATE FUNCTION UPDATE_UPDATED_ON_PEKERJA() RETURNS 
TRIGGER AS $$ 
	$$ $$ $$ BEGIN NEW.updated_on = now();
	RETURN NEW;
	END;
	$$ language 'plpgsql';


CREATE TRIGGER UPDATE_PEKERJA_UPDATED_ON 
	UPDATE_PEKERJA_UPDATED_ON UPDATE_PEKERJA_UPDATED_ON update_pekerja_updated_on BEFORE
	UPDATE ON pekerja FOR EACH ROW
	EXECUTE
	    PROCEDURE update_updated_on_pekerja();


create table
    pekerja_verification (
        id text not null,
        pekerja_id text,
        token text,
        created_on timestamp default CURRENT_TIMESTAMP not null,
        constraint pekerja foreign key(pekerja_id) references pekerja(id) ON DELETE CASCADE,
        primary key (id)
    )

-- =================================

CREATE OR REPLACE FUNCTION UPDATE_UPDATED_ON_PEKERJA
() RETURNS TRIGGER AS $$ 
	$$ $$ BEGIN NEW.updated_on = now();


RETURN NEW;

END;

$$ LANGUAGE 'plpgsql';

CREATE TRIGGER UPDATE_PEKERJA_UPDATED_ON 
	UPDATE_PEKERJA_UPDATED_ON update_pekerja_updated_on BEFORE
	UPDATE ON pekerja FOR EACH ROW
	EXECUTE
	    FUNCTION update_updated_on_pekerja();


create table
    pekerja_verification (
        id text not null,
        pekerja_id text,
        token text,
        created_on timestamp default CURRENT_TIMESTAMP not null,
        constraint pekerja foreign key(pekerja_id) references pekerja(pekerja_id) ON DELETE CASCADE,
        primary key (id)
    )

-- ====================================================

CREATE TABLE
    perekrut (
        perekrut_id VARCHAR NOT NULL PRIMARY KEY,
        perekrut_name VARCHAR,
        perekrut_email VARCHAR,
        perekrut_perusahaan VARCHAR,
        perekrut_jabatan VARCHAR,
        perekrut_phone VARCHAR,
        perekrut_password VARCHAR,
        perekrut_confirmpassword VARCHAR,
        perekrut_photo VARCHAR,
        perekrut_bidang VARCHAR,
        perekrut_kota VARCHAR,
        perekrut_deskripsi TEXT,
        perekrut_instagram VARCHAR,
        perekrut_linkedin VARCHAR,
        verify text not null,
        created_on timestamp default CURRENT_TIMESTAMP not null,
        updated_on timestamp default CURRENT_TIMESTAMP not null
    );

CREATE OR REPLACE FUNCTION update_updated_on_perekrut()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_on = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_perekrut_updated_on
BEFORE UPDATE ON perekrut
FOR EACH ROW
EXECUTE FUNCTION update_updated_on_perekrut();



create table
    perekrut_verification (
        id text not null,
        perekrut_id text,
        token text,
        created_on timestamp default CURRENT_TIMESTAMP not null,
        constraint perekrut foreign key(perekrut_id) references perekrut(perekrut_id) ON DELETE CASCADE,
        primary key (id)
    )


INSERT INTO pekerja (pekerja_id, pekerja_name, pekerja_email, pekerja_phone, pekerja_password, pekerja_confirmpassword, pekerja_photo, pekerja_jobdesk, pekerja_domisili, pekerja_tempat_kerja, pekerja_deskripsi, verify)
VALUES
    (UUID(), 'John Doe', 'john.doe@example.com', '123-456-7890', 'password123', 'password123', 'photo1.jpg', 'Job Desk 1', 'Domisili 1', 'Tempat Kerja 1', 'Deskripsi 1', 'true'),
    (UUID(), 'Jane Smith', 'jane.smith@example.com', '987-654-3210', 'password456', 'password456', 'photo2.jpg', 'Job Desk 2', 'Domisili 2', 'Tempat Kerja 2', 'Deskripsi 2', 'true'),
    (UUID(), 'Bob Johnson', 'bob.johnson@example.com', '111-222-3333', 'password789', 'password789', 'photo3.jpg', 'Job Desk 3', 'Domisili 3', 'Tempat Kerja 3', 'Deskripsi 3', 'true'),
    -- Tambahkan 12 data lainnya dengan cara yang serupa
    (UUID(), 'Alice Brown', 'alice.brown@example.com', '555-555-5555', 'password123', 'password123', 'photo4.jpg', 'Job Desk 4', 'Domisili 4', 'Tempat Kerja 4', 'Deskripsi 4', 'true'),
    -- Tambahkan data-data lainnya di sini
    (UUID(), 'Eva Wilson', 'eva.wilson@example.com', '777-777-7777', 'password456', 'password456', 'photo5.jpg', 'Job Desk 5', 'Domisili 5', 'Tempat Kerja 5', 'Deskripsi 5', 'true');

CREATE Table hiring (
      hiring_id VARCHAR NOT NULL PRIMARY KEY,
      hiring_title VARCHAR,
      hiring_message TEXT,
      pekerja_name VARCHAR,
      pekerja_id VARCHAR,
      pekerja_email VARCHAR,
      perekrut_id VARCHAR,
      perekrut_perusahaan VARCHAR
);