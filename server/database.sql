CREATE DATABASE hive_farm;

--SET EXTENSION
CREATE TABLE tenants(
    tenant_id UUID PRIMARY KEY DEFAULT 
    uuid_generate_v7(),
    tenant_username VARCHAR(255) NOT NULL,
    tenant_name VARCHAR(255) NOT NULL,
    tenant_email VARCHAR(255) NOT NULL,
    tenant_password VARCHAR(255) NOT NULL
);

--SEED DATABASE
INSERT INTO tenants (tenant_username, tenant_name, tenant_email, tenant_password) VALUES ('admin', 'administrator','lucasborges@galileitechnology.com', 'Gt@ti@999!');