<?php

namespace App\Policies;

use App\Models\Opinion;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OpinionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Opinion $opinion): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    // public function update(User $user, Opinion $opinion)
    // {
    //     // Solo el autor puede editar
    //     return $opinion->alumno_id === $user->alumno?->id;
    // }
    public function update(User $user, Opinion $opinion)
    {
        // Solo el autor puede editar
        return $opinion->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Opinion $opinion)
    {
        return $this->update($user, $opinion);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Opinion $opinion): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Opinion $opinion): bool
    {
        return false;
    }
}
