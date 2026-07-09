from app.db.receta_query import RecetaQuery


class RecomendacionQuery:
    @staticmethod
    def get_recomendaciones(empresa_id):
        result = RecetaQuery.get_recetas(empresa_id)
        if result["status"] == "error":
            return result
        recomendaciones = []
        for r in result["recetas"]:
            recomendaciones.append({
                "id_receta": r["id_receta"],
                "nombre_receta": r["nombre_receta"],
                "modalidad": "en_desarrollo",
                "mensaje": "Esta funcionalidad está en desarrollo. Pronto recibirás recomendaciones inteligentes de producción para este producto.",
            })
        return {"status": "success", "recomendaciones": recomendaciones}
