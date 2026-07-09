from app.db.init import DatabaseConnection


class RecetaQuery:
    @staticmethod
    def create_receta(nombre_receta, porcentaje_ganancia, produccion, costo_unidad, precio_unidad,
                      ganancia_unidad, total_costo, total_unidad, total_ganancia, ingredientes, empresa_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    """INSERT INTO recetas (nombre_receta, porcentaje_ganancia, produccion,
                       costo_unidad, precio_unidad, ganancia_unidad, total_costo, total_unidad, total_ganancia, empresa_id)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id_receta""",
                    (nombre_receta.strip(), porcentaje_ganancia, produccion,
                     costo_unidad, precio_unidad, ganancia_unidad,
                     total_costo, total_unidad, total_ganancia, empresa_id)
                )
                id_receta = cursor.fetchone()[0]

                for ing in ingredientes:
                    cursor.execute(
                        """INSERT INTO receta_insumos (id_receta, id_insumo, cantidad_usada, costo_parcial)
                           VALUES (%s, %s, %s, %s)""",
                        (id_receta, ing["id_insumo"], ing["cantidad_usada"], ing["costo_parcial"])
                    )

                return {"status": "success", "id": id_receta}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def get_recetas(empresa_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    """SELECT id_receta, nombre_receta, porcentaje_ganancia, produccion,
                              costo_unidad, precio_unidad, ganancia_unidad,
                              total_costo, total_unidad, total_ganancia,
                              created_at, updated_at
                       FROM recetas WHERE empresa_id = %s ORDER BY created_at DESC""",
                    (empresa_id,)
                )
                recetas_rows = cursor.fetchall()

                cursor.execute(
                    """SELECT ri.id_receta_insumo, ri.id_receta, ri.id_insumo,
                              i.nombre_insumo, ri.cantidad_usada, ri.costo_parcial
                       FROM receta_insumos ri
                       JOIN insumos i ON ri.id_insumo = i.id_insumo
                       WHERE ri.id_receta IN (SELECT id_receta FROM recetas WHERE empresa_id = %s)
                       ORDER BY ri.id_receta, ri.id_receta_insumo""",
                    (empresa_id,)
                )
                insumos_rows = cursor.fetchall()

                ingredientes_por_receta = {}
                for row in insumos_rows:
                    receta_id = row[1]
                    if receta_id not in ingredientes_por_receta:
                        ingredientes_por_receta[receta_id] = []
                    ingredientes_por_receta[receta_id].append({
                        "id_receta_insumo": row[0],
                        "id_insumo": row[2],
                        "nombre_insumo": row[3],
                        "cantidad_usada": float(row[4]),
                        "costo_parcial": float(row[5]),
                    })

                recetas = []
                for row in recetas_rows:
                    receta_id = row[0]
                    recetas.append({
                        "id_receta": receta_id,
                        "nombre_receta": row[1],
                        "porcentaje_ganancia": float(row[2]),
                        "produccion": float(row[3]),
                        "costo_unidad": float(row[4]),
                        "precio_unidad": float(row[5]),
                        "ganancia_unidad": float(row[6]),
                        "total_costo": float(row[7]),
                        "total_unidad": float(row[8]),
                        "total_ganancia": float(row[9]),
                        "created_at": row[10].isoformat() if row[10] else None,
                        "updated_at": row[11].isoformat() if row[11] else None,
                        "ingredientes": ingredientes_por_receta.get(receta_id, []),
                    })

                return {"status": "success", "recetas": recetas}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def get_receta(id_receta, empresa_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    """SELECT id_receta, nombre_receta, porcentaje_ganancia, produccion,
                              costo_unidad, precio_unidad, ganancia_unidad,
                              total_costo, total_unidad, total_ganancia,
                              created_at, updated_at
                       FROM recetas WHERE id_receta = %s AND empresa_id = %s""",
                    (id_receta, empresa_id)
                )
                row = cursor.fetchone()
                if not row:
                    return {"status": "error", "message": "Receta no encontrada"}

                cursor.execute(
                    """SELECT ri.id_receta_insumo, ri.id_insumo,
                              i.nombre_insumo, ri.cantidad_usada, ri.costo_parcial
                       FROM receta_insumos ri
                       JOIN insumos i ON ri.id_insumo = i.id_insumo
                       WHERE ri.id_receta = %s
                       ORDER BY ri.id_receta_insumo""",
                    (id_receta,)
                )
                ingredientes = [
                    {
                        "id_receta_insumo": ing[0],
                        "id_insumo": ing[1],
                        "nombre_insumo": ing[2],
                        "cantidad_usada": float(ing[3]),
                        "costo_parcial": float(ing[4]),
                    }
                    for ing in cursor.fetchall()
                ]

                return {
                    "status": "success",
                    "receta": {
                        "id_receta": row[0],
                        "nombre_receta": row[1],
                        "porcentaje_ganancia": float(row[2]),
                        "produccion": float(row[3]),
                        "costo_unidad": float(row[4]),
                        "precio_unidad": float(row[5]),
                        "ganancia_unidad": float(row[6]),
                        "total_costo": float(row[7]),
                        "total_unidad": float(row[8]),
                        "total_ganancia": float(row[9]),
                        "created_at": row[10].isoformat() if row[10] else None,
                        "updated_at": row[11].isoformat() if row[11] else None,
                        "ingredientes": ingredientes,
                    },
                }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def delete_receta(id_receta, empresa_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    "DELETE FROM recetas WHERE id_receta = %s AND empresa_id = %s RETURNING id_receta",
                    (id_receta, empresa_id)
                )
                deleted = cursor.fetchone()
                if not deleted:
                    return {"status": "error", "message": "Receta no encontrada"}
                return {"status": "success", "id": deleted[0]}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def update_receta(id_receta, nombre_receta, porcentaje_ganancia, produccion,
                      costo_unidad, precio_unidad, ganancia_unidad,
                      total_costo, total_unidad, total_ganancia, ingredientes, empresa_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    """UPDATE recetas SET nombre_receta=%s, porcentaje_ganancia=%s, produccion=%s,
                       costo_unidad=%s, precio_unidad=%s, ganancia_unidad=%s,
                       total_costo=%s, total_unidad=%s, total_ganancia=%s
                       WHERE id_receta=%s AND empresa_id=%s RETURNING id_receta""",
                    (nombre_receta.strip(), porcentaje_ganancia, produccion,
                     costo_unidad, precio_unidad, ganancia_unidad,
                     total_costo, total_unidad, total_ganancia, id_receta, empresa_id)
                )
                if not cursor.fetchone():
                    return {"status": "error", "message": "Receta no encontrada"}

                cursor.execute("DELETE FROM receta_insumos WHERE id_receta=%s", (id_receta,))

                for ing in ingredientes:
                    cursor.execute(
                        """INSERT INTO receta_insumos (id_receta, id_insumo, cantidad_usada, costo_parcial)
                           VALUES (%s, %s, %s, %s)""",
                        (id_receta, ing["id_insumo"], ing["cantidad_usada"], ing["costo_parcial"])
                    )

                return {"status": "success", "id": id_receta}
        except Exception as e:
            return {"status": "error", "message": str(e)}
