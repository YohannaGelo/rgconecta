<?php

namespace App\Interfaces;

interface RoleCheck
{
    /**
     * Método para verificar si el usuario es administrador.
     *
     * @return bool
     */
    // Verifica si el usuario autenticado es administrador
    public function isAdmin(): bool;
}
