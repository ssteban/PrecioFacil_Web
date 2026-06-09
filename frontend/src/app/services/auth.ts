import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { API } from '../config/api';

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  username: string;
  correo: string;
  contrasena: string;
  pais: string;
  departamento: string;
  ciudad: string;
  nombre_emprendimiento: string;
  tipo_negocio: string;
}

export interface UserData {
  id: number;
  username: string;
  correo: string;
  pais: string;
  departamento: string;
  ciudad: string;
  created_at: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);

  isAuthenticated = signal<boolean>(false);
  user = signal<UserData | null>(null);

  async login(correo: string, contrasena: string): Promise<boolean> {
    try {
      const body: LoginRequest = { correo, contrasena };
      const data = await lastValueFrom(this.http.post<UserData>(API.login, body));
      this.user.set(data);
      this.isAuthenticated.set(true);
      this.router.navigate(['/dashboard']);
      return true;
    } catch {
      return false;
    }
  }

  async register(req: RegisterRequest): Promise<{ success: boolean; message: string }> {
    try {
      await lastValueFrom(this.http.post(API.register, req));
      return { success: true, message: 'Usuario registrado exitosamente' };
    } catch (err: any) {
      const detail = err?.error?.detail || 'Error al registrar usuario';
      return { success: false, message: detail };
    }
  }

  logout() {
    this.isAuthenticated.set(false);
    this.user.set(null);
    this.router.navigate(['/login']);
  }
}
