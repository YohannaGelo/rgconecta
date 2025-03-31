<?php

namespace App\Interfaces;

interface RoleCheck
{
    /**
     * Método para verificar si el usuario es administrador.
     *
     * @return bool
     */
    public function isAdmin(): bool;
}
