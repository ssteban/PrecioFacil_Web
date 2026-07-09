from app.db.init import DatabaseConnection


class CategoriaQuery:
    @staticmethod
    def create_categoria(nombre, empresa_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    "INSERT INTO categorias (n_categoria, empresa_id) VALUES (%s, %s) RETURNING id_categoria",
                    (nombre.strip().upper(), empresa_id)
                )
                id_categoria = cursor.fetchone()[0]
                return {"status": "success", "id": id_categoria}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def get_categorias(empresa_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    "SELECT id_categoria, n_categoria, created_at FROM categorias WHERE empresa_id = %s ORDER BY n_categoria",
                    (empresa_id,)
                )
                rows = cursor.fetchall()
                return {
                    "status": "success",
                    "categorias": [
                        {
                            "id": row[0],
                            "nombre": row[1],
                            "created_at": row[2].isoformat() if row[2] else None,
                        }
                        for row in rows
                    ],
                }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def delete_categoria(id_categoria, empresa_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    "DELETE FROM categorias WHERE id_categoria = %s AND empresa_id = %s RETURNING id_categoria",
                    (id_categoria, empresa_id)
                )
                deleted = cursor.fetchone()
                if not deleted:
                    return {"status": "error", "message": "Categoría no encontrada"}
                return {"status": "success", "id": deleted[0]}
        except Exception as e:
            return {"status": "error", "message": str(e)}


class InsumoQuery:
    @staticmethod
    def _resolve_categoria(cursor, categoria_nombre, empresa_id):
        cursor.execute(
            "SELECT id_categoria FROM categorias WHERE n_categoria = %s AND empresa_id = %s",
            (categoria_nombre.strip().upper(), empresa_id)
        )
        row = cursor.fetchone()
        if row:
            return row[0]
        cursor.execute(
            "INSERT INTO categorias (n_categoria, empresa_id) VALUES (%s, %s) RETURNING id_categoria",
            (categoria_nombre.strip().upper(), empresa_id)
        )
        return cursor.fetchone()[0]

    @staticmethod
    def create_insumo(nombre_insumo, precio_compra, cantidad, unidad_medida, categoria, empresa_id):
        try:
            with DatabaseConnection() as cursor:
                id_categoria = InsumoQuery._resolve_categoria(cursor, categoria, empresa_id)
                cursor.execute(
                    """INSERT INTO insumos (nombre_insumo, precio_compra, cantidad, unidad_medida, id_categoria, empresa_id)
                       VALUES (%s, %s, %s, %s, %s, %s) RETURNING id_insumo""",
                    (nombre_insumo.strip(), precio_compra, cantidad, unidad_medida, id_categoria, empresa_id)
                )
                id_insumo = cursor.fetchone()[0]
                return {"status": "success", "id": id_insumo}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def get_insumos(empresa_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    """SELECT i.id_insumo, i.nombre_insumo, i.precio_compra, i.cantidad,
                              i.unidad_medida, i.id_categoria, c.n_categoria,
                              i.created_at, i.updated_at
                       FROM insumos i
                       JOIN categorias c ON i.id_categoria = c.id_categoria
                       WHERE i.empresa_id = %s
                       ORDER BY i.created_at DESC""",
                    (empresa_id,)
                )
                rows = cursor.fetchall()
                return {
                    "status": "success",
                    "insumos": [
                        {
                            "id_insumo": row[0],
                            "nombre_insumo": row[1],
                            "precio_compra": float(row[2]),
                            "cantidad": float(row[3]) if row[3] is not None else None,
                            "unidad_medida": row[4],
                            "id_categoria": row[5],
                            "nombre_categoria": row[6],
                            "created_at": row[7].isoformat() if row[7] else None,
                            "updated_at": row[8].isoformat() if row[8] else None,
                        }
                        for row in rows
                    ],
                }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def update_insumo(id_insumo, empresa_id, nombre_insumo=None, precio_compra=None, cantidad=None, unidad_medida=None, categoria=None):
        try:
            with DatabaseConnection() as cursor:
                fields = []
                values = []
                if nombre_insumo is not None:
                    fields.append("nombre_insumo = %s")
                    values.append(nombre_insumo.strip())
                if precio_compra is not None:
                    fields.append("precio_compra = %s")
                    values.append(precio_compra)
                if cantidad is not None:
                    fields.append("cantidad = %s")
                    values.append(cantidad)
                if unidad_medida is not None:
                    fields.append("unidad_medida = %s")
                    values.append(unidad_medida)
                if categoria is not None:
                    id_categoria = InsumoQuery._resolve_categoria(cursor, categoria, empresa_id)
                    fields.append("id_categoria = %s")
                    values.append(id_categoria)
                if not fields:
                    return {"status": "error", "message": "Sin campos para actualizar"}
                values.append(id_insumo)
                values.append(empresa_id)
                cursor.execute(
                    f"UPDATE insumos SET {', '.join(fields)} WHERE id_insumo = %s AND empresa_id = %s RETURNING id_insumo",
                    values
                )
                updated = cursor.fetchone()
                if not updated:
                    return {"status": "error", "message": "Insumo no encontrado"}
                return {"status": "success", "id": updated[0]}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def delete_insumo(id_insumo, empresa_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    "DELETE FROM insumos WHERE id_insumo = %s AND empresa_id = %s RETURNING id_insumo",
                    (id_insumo, empresa_id)
                )
                deleted = cursor.fetchone()
                if not deleted:
                    return {"status": "error", "message": "Insumo no encontrado"}
                return {"status": "success", "id": deleted[0]}
        except Exception as e:
            return {"status": "error", "message": str(e)}
