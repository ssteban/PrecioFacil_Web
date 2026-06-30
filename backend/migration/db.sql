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

-- 5. Tabla de Categorías
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    n_categoria VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla de Insumos (Despensa)
CREATE TABLE insumos (
    id_insumo SERIAL PRIMARY KEY,
    nombre_insumo VARCHAR(150) NOT NULL,
    precio_compra NUMERIC(12, 2) NOT NULL, -- Soporta valores monetarios precisos (ej: 10000.00)
    cantidad NUMERIC(12, 2) DEFAULT NULL,   -- Al ser opcional, por defecto es NULL
    unidad_medida VARCHAR(50) DEFAULT NULL, -- Al ser opcional, por defecto es NULL (ej: 'gramos', 'unidades')
    id_categoria INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Relación con la tabla de categorías
    CONSTRAINT fk_categoria
        FOREIGN KEY(id_categoria) 
        REFERENCES categorias(id_categoria)
        ON DELETE RESTRICT -- Evita borrar una categoría si tiene insumos asociados
);

-- Función integrada en PostgreSQL para actualizar automáticamente el campo 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_insumos_updated_at
    BEFORE UPDATE ON insumos
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();



-- 7. Tabla Principal de Recetas
CREATE TABLE recetas (
    id_receta SERIAL PRIMARY KEY,
    nombre_receta VARCHAR(150) NOT NULL, -- Nombre del producto (ej: 'Empanada de carne')
    porcentaje_ganancia NUMERIC(5, 2) NOT NULL, -- Ej: 50.00 para 50%
    produccion NUMERIC(10, 2) NOT NULL DEFAULT 1.00, -- 'Unidades / Porciones Producidas'
    
    -- Valores Unitarios
    costo_unidad NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    precio_unidad NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ganancia_unidad NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    
    -- Valores Totales (Lote)
    total_costo NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_unidad NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- Precio total sugerido del lote
    total_ganancia NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabla Intermedia / Relacional (Ingredientes por Receta)
CREATE TABLE receta_insumos (
    id_receta_insumo SERIAL PRIMARY KEY,
    id_receta INT NOT NULL,
    id_insumo INT NOT NULL,
    cantidad_usada NUMERIC(12, 2) NOT NULL, -- Gramos, unidades o pesos usados en la receta
    costo_parcial NUMERIC(12, 2) NOT NULL, -- El costo calculado para este ingrediente en este lote
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Llaves foráneas con eliminación en cascada 
    -- (Si se borra una receta, se borran automáticamente sus ingredientes de esta tabla)
    CONSTRAINT fk_receta
        FOREIGN KEY(id_receta) 
        REFERENCES recetas(id_receta) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_insumo
        FOREIGN KEY(id_insumo) 
        REFERENCES insumos(id_insumo) 
        ON DELETE RESTRICT -- Evita borrar un insumo base de la despensa si una receta lo está usando
);

-- Triggers automáticos para actualizar 'updated_at' al hacer un UPDATE
CREATE TRIGGER update_recetas_updated_at
    BEFORE UPDATE ON recetas
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_receta_insumos_updated_at
    BEFORE UPDATE ON receta_insumos
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- 9. Tabla para registrar las ventas diarias de cada producto
CREATE TABLE ventas_diarias (
    id_venta SERIAL PRIMARY KEY,
    id_receta INT NOT NULL,
    fecha_venta DATE NOT NULL DEFAULT CURRENT_DATE,
    unidades_vendidas INT NOT NULL DEFAULT 0,
    unidades_sobrantes INT NOT NULL DEFAULT 0, -- Mermas automáticas o manuales
    ingreso_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- unidades_vendidas * precio_unidad
    ganancia_neta_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- unidades_vendidas * ganancia_unidad
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Relación con las recetas
    CONSTRAINT fk_receta_venta
        FOREIGN KEY(id_receta) 
        REFERENCES recetas(id_receta)
        ON DELETE CASCADE,
        
    -- Evita que se registre más de una venta para el mismo producto el mismo día
    CONSTRAINT unique_producto_dia UNIQUE (id_receta, fecha_venta)
);



