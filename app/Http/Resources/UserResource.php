<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_pengguna' => $this->id_pengguna,
            'role_pengguna' => $this->role_pengguna,
            'nama' => $this->nama,
            'email' => $this->email,
            'no_telepon' => $this->no_telepon,
            'tgl_daftar' => $this->tgl_daftar?->format('d-m-Y'),
            'is_admin' => $this->isAdmin(),
            'is_customer' => $this->isCustomer(),
        ];
    }
}