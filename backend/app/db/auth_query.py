import psycopg2
from app.db.init import DatabaseConnection
from app.util.auth_util import verify_password, hash_password


class AuthQuery:
    @staticmethod
    def register_user(username, correo, contrasena, pais, departamento, ciudad, nombre_emprendimiento, tipo_negocio, medios_pago='EN_BLANCO'):
        try:
            with DatabaseConnection() as cursor:
                tipo_negocio = tipo_negocio.strip().upper()

                cursor.execute(
                    "SELECT id FROM tipos_negocio WHERE nombre = %s",
                    (tipo_negocio,)
                )
                tipo_negocio_row = cursor.fetchone()
                if not tipo_negocio_row:
                    return {"status": "error", "message": "Tipo de negocio no encontrado"}
                tipo_negocio_id = tipo_negocio_row[0]

                hashed = hash_password(contrasena)

                cursor.execute(
                    "INSERT INTO empresas (nombre_emprendimiento, tipo_negocio_id, medios_pago) VALUES (%s, %s, %s) RETURNING id",
                    (nombre_emprendimiento, tipo_negocio_id, medios_pago)
                )
                empresa_id = cursor.fetchone()[0]

                cursor.execute(
                    """INSERT INTO usuarios (username, correo, contrasena, pais, departamento, ciudad, empresa_id)
                       VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                    (username, correo, hashed, pais, departamento, ciudad, empresa_id)
                )
                user_id = cursor.fetchone()[0]

                cursor.execute(
                    "SELECT id_plan, recetas_incluidas_base FROM planes WHERE nombre_plan = 'FREE'"
                )
                plan_row = cursor.fetchone()
                plan_id = plan_row[0] if plan_row else 1
                limite_base = plan_row[1] if plan_row else 5

                cursor.execute(
                    """INSERT INTO usuario_suscripciones (id_usuario, id_plan, paquetes_extra_comprados, limite_recetas_total, estado_suscripcion)
                       VALUES (%s, %s, %s, %s, 'ACTIVO')""",
                    (user_id, plan_id, 0, limite_base)
                )
                return {"status": "success", "id": user_id}
        except psycopg2.IntegrityError as e:
            if 'correo' in str(e):
                return {"status": "error", "message": "El correo electrónico ya está registrado."}
            if 'username' in str(e):
                return {"status": "error", "message": "El nombre de usuario ya está registrado."}
            return {"status": "error", "message": "Error de integridad de datos."}
        except Exception as e:
            return {"status": "error", "message": f"Error interno del servidor: {str(e)}"}

    @staticmethod
    def authenticate_user(correo, contrasena):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    """SELECT u.id, u.username, u.correo, u.contrasena, u.pais, u.departamento, u.ciudad, u.created_at,
                              u.empresa_id,
                              COALESCE(p.nombre_plan, 'FREE') as plan,
                              COALESCE(s.limite_recetas_total, 5) as limite_recetas_total
                       FROM usuarios u
                       LEFT JOIN usuario_suscripciones s ON s.id_usuario = u.id
                       LEFT JOIN planes p ON p.id_plan = s.id_plan
                       WHERE u.correo = %s""",
                    (correo,)
                )
                user = cursor.fetchone()
                if not user:
                    return {"status": "error", "message": "Usuario o contraseña incorrectos"}
                if verify_password(contrasena, user[3]):
                    return {
                        "status": "success",
                        "id": user[0],
                        "username": user[1],
                        "correo": user[2],
                        "pais": user[4],
                        "departamento": user[5],
                        "ciudad": user[6],
                        "created_at": user[7].isoformat() if user[7] else None,
                        "empresa_id": user[8],
                        "plan": user[9],
                        "limite_recetas_total": user[10],
                    }
                return {"status": "error", "message": "Usuario o contraseña incorrectos"}
        except Exception as e:
            return {"status": "error", "message": f"Error interno del servidor: {str(e)}"}

    @staticmethod
    def get_profile(user_id):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    "SELECT id, username, correo, pais, departamento, ciudad, created_at FROM usuarios WHERE id = %s",
                    (user_id,)
                )
                user = cursor.fetchone()
                if not user:
                    return {"status": "error", "message": "Usuario no encontrado"}
                return {
                    "status": "success",
                    "profile": {
                        "id": user[0],
                        "username": user[1],
                        "correo": user[2],
                        "pais": user[3],
                        "departamento": user[4],
                        "ciudad": user[5],
                        "created_at": user[6].isoformat() if user[6] else None
                    }
                }
        except Exception as e:
            return {"status": "error", "message": f"Error interno del servidor: {str(e)}"}

    @staticmethod
    def update_profile(user_id, username=None, correo=None, pais=None, departamento=None, ciudad=None):
        try:
            with DatabaseConnection() as cursor:
                fields = []
                values = []
                if username is not None:
                    fields.append("username = %s")
                    values.append(username)
                if correo is not None:
                    fields.append("correo = %s")
                    values.append(correo)
                if pais is not None:
                    fields.append("pais = %s")
                    values.append(pais)
                if departamento is not None:
                    fields.append("departamento = %s")
                    values.append(departamento)
                if ciudad is not None:
                    fields.append("ciudad = %s")
                    values.append(ciudad)
                if not fields:
                    return {"status": "success", "message": "Sin cambios"}
                values.append(user_id)
                cursor.execute(
                    f"UPDATE usuarios SET {', '.join(fields)} WHERE id = %s RETURNING id, username, correo, pais, departamento, ciudad, created_at",
                    values
                )
                user = cursor.fetchone()
                return {
                    "status": "success",
                    "profile": {
                        "id": user[0],
                        "username": user[1],
                        "correo": user[2],
                        "pais": user[3],
                        "departamento": user[4],
                        "ciudad": user[5],
                        "created_at": user[6].isoformat() if user[6] else None
                    }
                }
        except psycopg2.IntegrityError:
            return {"status": "error", "message": "El correo electrónico ya está registrado"}
        except Exception as e:
            return {"status": "error", "message": f"Error interno del servidor: {str(e)}"}

    @staticmethod
    def change_password(user_id, current_password, new_password):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    "SELECT contrasena FROM usuarios WHERE id = %s",
                    (user_id,)
                )
                user = cursor.fetchone()
                if not user:
                    return {"status": "error", "message": "Usuario no encontrado"}
                if not verify_password(current_password, user[0]):
                    return {"status": "error", "message": "La contraseña actual no es correcta"}
                new_hash = hash_password(new_password)
                cursor.execute(
                    "UPDATE usuarios SET contrasena = %s WHERE id = %s",
                    (new_hash, user_id)
                )
                return {"status": "success", "message": "Contraseña actualizada exitosamente"}
        except Exception as e:
            return {"status": "error", "message": f"Error interno del servidor: {str(e)}"}

    @staticmethod
    def recover_password(correo):
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(
                    "SELECT id FROM usuarios WHERE correo = %s",
                    (correo,)
                )
                user = cursor.fetchone()
                return user is not None
        except Exception:
            return False
