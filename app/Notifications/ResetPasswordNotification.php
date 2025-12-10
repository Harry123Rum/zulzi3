<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    // Properti publik untuk menyimpan token
    public $token;

    // Constructor untuk menerima token
    public function __construct($token)
    {
        $this->token = $token;
    }

    // Menentukan saluran pengiriman (di sini hanya 'mail')
    public function via($notifiable)
    {
        return ['mail'];
    }

    // Membangun MailMessage untuk email
    public function toMail($notifiable)
    {
        // Membuat URL reset password
        // Pastikan APP_URL di .env sudah dikonfigurasi dengan benar (misalnya: http://localhost:8000)
        $url = config('app.url') . '/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage)
                    ->subject('Reset Password Notification') // Subjek email
                    ->line('Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.')
                    ->action('Reset Password', $url) // Tombol dengan tautan reset
                    ->line('Tautan reset password ini akan kedaluwarsa dalam ' . config('auth.passwords.' . config('auth.defaults.passwords') . '.expire') . ' menit.')
                    ->line('Jika Anda tidak meminta reset password, abaikan email ini.');
    }
}
