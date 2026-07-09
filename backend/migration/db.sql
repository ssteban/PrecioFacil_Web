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




-- =========================================================================
-- CONSOLIDACIÓN FINAL: MÓDULO PREDICTIVO Y MÉTODOS DE PAGO 'COSTLY'
-- =========================================================================

-- 1. Modificar la tabla 'empresas' para añadir el control de métodos de pago
-- Usamos un CHECK para restringir el campo exactamente a tus 3 opciones de negocio.
ALTER TABLE empresas 
ADD COLUMN medios_pago VARCHAR(30) DEFAULT 'EN_BLANCO' 
CHECK (medios_pago IN ('EN_BLANCO', 'SOLO_EFECTIVO', 'CUALQUIER_MEDIO'));


-- 2. Crear la tabla Maestra de Tipos de Eventos (Si no la habías creado antes)
CREATE TABLE IF NOT EXISTS tipos_eventos (
    id_tipo_evento SERIAL PRIMARY KEY,
    nombre_evento VARCHAR(100) NOT NULL UNIQUE, -- Ej: 'PARTIDO_DE_FUTBOL', 'QUINCENA_O_PAGO'
    multiplicador_sugerido NUMERIC(3, 2) DEFAULT 1.50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 3. Alterar la tabla 'ventas_diarias' existente (Inyección de campos de control)
-- Esto permite marcar los días extraordinarios en el histórico para proteger los promedios normales
ALTER TABLE ventas_diarias 
ADD COLUMN es_evento_extraordinario BOOLEAN DEFAULT FALSE,
ADD COLUMN id_tipo_evento INT DEFAULT NULL,
ADD CONSTRAINT fk_venta_tipo_evento 
    FOREIGN KEY (id_tipo_evento) 
    REFERENCES tipos_eventos(id_tipo_evento) 
    ON DELETE SET NULL;


-- 4. Crear la tabla de Predicciones Generadas (Caché del Frontend)
-- Conectada a tu tabla 'recetas' actual
CREATE TABLE IF NOT EXISTS predicciones_diarias (
    id_prediccion SERIAL PRIMARY KEY,
    id_receta INT NOT NULL,
    fecha_prediccion DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 day'),
    cantidad_sugerida_normal INT NOT NULL DEFAULT 0,
    cantidad_sugerida_evento INT DEFAULT NULL, -- Exclusivo para capa Premium
    fase_algoritmo VARCHAR(20) DEFAULT 'Fase 1' CHECK (fase_algoritmo IN ('Fase 1', 'Fase 2')),
    motivo_sugerencia TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_receta_prediccion 
        FOREIGN KEY (id_receta) 
        REFERENCES recetas(id_receta) 
        ON DELETE CASCADE,
        
    CONSTRAINT unique_prediccion_receta_dia UNIQUE (id_receta, fecha_prediccion)
);


-- 5. Insertar los Seeders calibrados con lógica defensiva en los eventos
INSERT INTO tipos_eventos (nombre_evento, multiplicador_sugerido) VALUES
    ('PARTIDO_DE_FUTBOL', 1.50),   
    ('CONCIERTO_O_FIESTA', 1.70),  
    ('DIA_FESTIVO', 0.95),         -- Defensivo para evitar mermas por zonas fantasmas
    ('QUINCENA_O_PAGO', 1.50)      
ON CONFLICT (nombre_evento) DO NOTHING;



-- =========================================================================
-- MÓDULO DE PLANES Y CONTROL DE CAPACIDAD DE RECETAS
-- =========================================================================

-- 1. Tabla Maestra de Planes
CREATE TABLE IF NOT EXISTS planes (
    id_plan SERIAL PRIMARY KEY,
    nombre_plan VARCHAR(30) NOT NULL UNIQUE, -- 'FREE', 'PREMIUM'
    descripcion TEXT,
    precio_base NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    recetas_incluidas_base INT NOT NULL DEFAULT 5 -- El Free incluye 5, el Premium incluye 5 más (Total 10 base)
);

-- 2. Tabla de Suscripciones (La intermedia inteligente)
-- Une al usuario con su plan actual y define dinámicamente su límite total
CREATE TABLE IF NOT EXISTS usuario_suscripciones (
    id_suscripcion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE, -- Un usuario solo tiene una suscripción activa a la vez
    id_plan INT NOT NULL,
    
    -- Manejo explícito de capacidad (Evita multiplicadores complejos en código)
    paquetes_extra_comprados INT DEFAULT 0, -- Cantidad de "bloques de 5" adicionales que ha comprado
    limite_recetas_total INT NOT NULL DEFAULT 5, -- Suma total: (recetas_base del plan) + (paquetes_extra * 5)
    
    estado_suscripcion VARCHAR(20) DEFAULT 'ACTIVO' CHECK (estado_suscripcion IN ('ACTIVO', 'VENCIDO', 'CANCELADO')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_suscripcion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_suscripcion_plan FOREIGN KEY (id_plan) REFERENCES planes(id_plan)
);

-- 3. Triggers para actualizar 'updated_at'
CREATE TRIGGER update_usuario_suscripciones_updated_at
    BEFORE UPDATE ON usuario_suscripciones
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();


-- =========================================================================
-- SEEDERS PARA INICIALIZAR LOS PLANES
-- =========================================================================
INSERT INTO planes (nombre_plan, descripcion, precio_base, recetas_incluidas_base) VALUES
    ('FREE', 'Plan inicial de control básico de mermas', 0.00, 5),
    ('PREMIUM', 'Plan avanzado con predicción de eventos e insumos ilimitados', 9.99, 10) -- Ya incluye los 5 base + 5 extra
ON CONFLICT (nombre_plan) DO NOTHING;

ALTER TABLE categorias
  ADD COLUMN empresa_id INT NOT NULL,
  ADD CONSTRAINT fk_categoria_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  DROP CONSTRAINT categorias_n_categoria_key,
  ADD CONSTRAINT categorias_unique_nombre_empresa UNIQUE (n_categoria, empresa_id);

ALTER TABLE insumos
  ADD COLUMN empresa_id INT NOT NULL,
  ADD CONSTRAINT fk_insumo_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id);

ALTER TABLE recetas
  ADD COLUMN empresa_id INT NOT NULL,
  ADD CONSTRAINT fk_receta_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id);

ALTER TABLE ventas_diarias
  ADD COLUMN empresa_id INT NOT NULL,
  ADD CONSTRAINT fk_venta_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id);








