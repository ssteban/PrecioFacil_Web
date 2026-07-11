import math
from datetime import date, timedelta
from app.db.init import DatabaseConnection

DIAS_SEMANA = {
    1: "lunes", 2: "martes", 3: "miércoles",
    4: "jueves", 5: "viernes", 6: "sábado", 7: "domingo",
}


class FreeAlgoritmo:

    @staticmethod
    def predecir(empresa_id: int, id_receta: int) -> dict:
        tomorrow = date.today() + timedelta(days=1)
        dia_semana = tomorrow.isoweekday()

        with DatabaseConnection() as cursor:
            cursor.execute(
                "SELECT nombre_receta FROM recetas WHERE id_receta = %s AND empresa_id = %s",
                (id_receta, empresa_id)
            )
            receta_row = cursor.fetchone()
            if not receta_row:
                return {"error": "Receta no encontrada"}
            nombre_receta = receta_row[0]

            result = FreeAlgoritmo._paso1_coincidencia_dia(
                cursor, id_receta, empresa_id, dia_semana
            )
            if result["tiene_datos"]:
                return {
                    "id_receta": id_receta,
                    "nombre_receta": nombre_receta,
                    "modalidad": "free",
                    "fase": result["fase"],
                    "cantidad_sugerida": result["cantidad_sugerida"],
                    "motivo": result["motivo"],
                    "cold_start": False,
                }

            result = FreeAlgoritmo._paso2_freno_seguridad(cursor, id_receta, empresa_id)
            if result["tiene_datos"]:
                return {
                    "id_receta": id_receta,
                    "nombre_receta": nombre_receta,
                    "modalidad": "free",
                    "fase": result["fase"],
                    "cantidad_sugerida": result["cantidad_sugerida"],
                    "motivo": result["motivo"],
                    "cold_start": False,
                }

            return {
                "id_receta": id_receta,
                "nombre_receta": nombre_receta,
                "modalidad": "free",
                "fase": "Fase 3: Arranque en Frío",
                "cantidad_sugerida": None,
                "motivo": (
                    "No hay datos históricos de ventas para este producto. "
                    "Comienza registrando ventas diarias para recibir "
                    "recomendaciones personalizadas."
                ),
                "cold_start": True,
            }

    @staticmethod
    def _paso1_coincidencia_dia(cursor, id_receta, empresa_id, dia_semana):
        cursor.execute(
            """SELECT COALESCE(AVG(unidades_vendidas), 0) as promedio,
                      COUNT(*) as total
               FROM ventas_diarias
               WHERE id_receta = %s AND empresa_id = %s
                 AND EXTRACT(ISODOW FROM fecha_venta) = %s""",
            (id_receta, empresa_id, dia_semana)
        )
        row = cursor.fetchone()
        promedio = float(row[0])
        total = row[1]

        if total == 0:
            return {"tiene_datos": False}

        cantidad = round(promedio)
        dia_nombre = DIAS_SEMANA.get(dia_semana, "desconocido")

        return {
            "tiene_datos": True,
            "fase": "Fase 1: Coincidencia de Día",
            "cantidad_sugerida": cantidad,
            "motivo": (
                f"Proyección basada en el promedio de ventas "
                f"de los {dia_nombre} anteriores ({total} registro{'s' if total != 1 else ''})"
            ),
        }

    @staticmethod
    def _paso2_freno_seguridad(cursor, id_receta, empresa_id):
        cursor.execute(
            "SELECT COUNT(*) FROM ventas_diarias WHERE id_receta = %s AND empresa_id = %s",
            (id_receta, empresa_id)
        )
        if cursor.fetchone()[0] == 0:
            return {"tiene_datos": False}

        cursor.execute(
            """SELECT COALESCE(AVG(unidades_vendidas), 0) as promedio,
                      COUNT(*) as total
               FROM ventas_diarias
               WHERE id_receta = %s AND empresa_id = %s
                 AND fecha_venta >= CURRENT_DATE - INTERVAL '7 days'
                 AND fecha_venta < CURRENT_DATE""",
            (id_receta, empresa_id)
        )
        row = cursor.fetchone()
        promedio_7d = float(row[0])
        total_7d = row[1]

        if total_7d == 0:
            return {"tiene_datos": False}

        cursor.execute(
            """SELECT unidades_vendidas
               FROM ventas_diarias
               WHERE id_receta = %s AND empresa_id = %s
               ORDER BY fecha_venta DESC
               LIMIT 1""",
            (id_receta, empresa_id)
        )
        venta_reciente = int(cursor.fetchone()[0])

        if promedio_7d <= venta_reciente:
            cantidad = round(promedio_7d)
            motivo = (
                f"Basado en el promedio de los últimos 7 días "
                f"({round(promedio_7d)} unds), estable frente a la última venta"
            )
        else:
            cantidad = math.floor(venta_reciente * 0.95)
            motivo = (
                f"Aplicado freno de seguridad por tendencia a la baja: "
                f"promedio semanal ({round(promedio_7d)}) supera última venta "
                f"({venta_reciente}). Se sugiere {cantidad} unds ({venta_reciente} × 0.95)"
            )

        return {
            "tiene_datos": True,
            "fase": "Fase 2: Freno de Seguridad",
            "cantidad_sugerida": cantidad,
            "motivo": motivo,
        }
