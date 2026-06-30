from app.db.init import DatabaseConnection


UNIQUE_CONSTRAINT_MSG = (
    "Ya existe un registro de venta para este producto en la fecha seleccionada."
)


class VentaDiariaQuery:
    @staticmethod
    def create_venta(id_receta, fecha_venta, unidades_vendidas, unidades_sobrantes,
                     ingreso_total, ganancia_neta_total):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    """INSERT INTO ventas_diarias
                       (id_receta, fecha_venta, unidades_vendidas, unidades_sobrantes,
                        ingreso_total, ganancia_neta_total)
                       VALUES (%s, %s, %s, %s, %s, %s)
                       RETURNING id_venta""",
                    (id_receta, fecha_venta, unidades_vendidas, unidades_sobrantes,
                     ingreso_total, ganancia_neta_total)
                )
                id_venta = cursor.fetchone()[0]
                return {"status": "success", "id": id_venta}
        except Exception as e:
            error_msg = str(e)
            if "unique_producto_dia" in error_msg or "duplicate key" in error_msg:
                return {"status": "error", "message": UNIQUE_CONSTRAINT_MSG}
            return {"status": "error", "message": error_msg}

    @staticmethod
    def get_ventas():
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    """SELECT v.id_venta, v.id_receta, v.fecha_venta,
                              v.unidades_vendidas, v.unidades_sobrantes,
                              v.ingreso_total, v.ganancia_neta_total,
                              r.nombre_receta, r.costo_unidad, v.created_at
                       FROM ventas_diarias v
                       JOIN recetas r ON v.id_receta = r.id_receta
                       ORDER BY v.fecha_venta DESC, v.created_at DESC"""
                )
                rows = cursor.fetchall()
                ventas = []
                for row in rows:
                    ventas.append({
                        "id_venta": row[0],
                        "id_receta": row[1],
                        "fecha_venta": row[2].isoformat() if row[2] else None,
                        "unidades_vendidas": row[3],
                        "unidades_sobrantes": row[4],
                        "ingreso_total": float(row[5]),
                        "ganancia_neta_total": float(row[6]),
                        "nombre_receta": row[7],
                        "costo_unidad": float(row[8]) if row[8] else 0,
                        "created_at": row[9].isoformat() if row[9] else None,
                    })
                return {"status": "success", "ventas": ventas}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def get_ventas_por_receta(id_receta):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    """SELECT v.id_venta, v.id_receta, v.fecha_venta,
                              v.unidades_vendidas, v.unidades_sobrantes,
                              v.ingreso_total, v.ganancia_neta_total,
                              r.nombre_receta, r.costo_unidad, v.created_at
                       FROM ventas_diarias v
                       JOIN recetas r ON v.id_receta = r.id_receta
                       WHERE v.id_receta = %s
                       ORDER BY v.fecha_venta DESC""",
                    (id_receta,)
                )
                rows = cursor.fetchall()
                ventas = []
                for row in rows:
                    ventas.append({
                        "id_venta": row[0],
                        "id_receta": row[1],
                        "fecha_venta": row[2].isoformat() if row[2] else None,
                        "unidades_vendidas": row[3],
                        "unidades_sobrantes": row[4],
                        "ingreso_total": float(row[5]),
                        "ganancia_neta_total": float(row[6]),
                        "nombre_receta": row[7],
                        "costo_unidad": float(row[8]) if row[8] else 0,
                        "created_at": row[9].isoformat() if row[9] else None,
                    })
                return {"status": "success", "ventas": ventas}
        except Exception as e:
            return {"status": "error", "message": str(e)}
