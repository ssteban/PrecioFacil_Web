-- 1. Tabla para clasificar el tipo de negocio
CREATE TABLE IF NOT EXISTS tipos_negocio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Tabla para registrar los datos del emprendimiento o empresa
CREATE TABLE IF NOT EXISTS empresas (
    id SERIAL PRIMARY KEY,
    nombre_emprendimiento VARCHAR(100) NOT NULL,
    tipo_negocio_id INT NOT NULL,
    CONSTRAINT fk_tipo_negocio FOREIGN KEY (tipo_negocio_id) REFERENCES tipos_negocio(id)
);

-- 3. Tabla para los datos del usuario (Acceso y Ubicación)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    pais VARCHAR(50) NOT NULL,
    departamento VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    empresa_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

-- 4. Seed: tipos de negocio por defecto
INSERT INTO tipos_negocio (nombre) VALUES
    ('EMPRENDIMIENTO'),
    ('EMPRESA'),
    ('RESTAURANTE'),
    ('COMIDA_RAPIDA'),
    ('PANADERIA')
ON CONFLICT (nombre) DO NOTHING;
