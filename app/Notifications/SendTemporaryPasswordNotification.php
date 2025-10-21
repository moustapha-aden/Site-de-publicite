<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendTemporaryPasswordNotification extends Notification
{
    use Queueable;

    protected $temporaryPassword;

    /**
     * Create a new notification instance.
     */
    public function __construct($temporaryPassword)
    {
        $this->temporaryPassword = $temporaryPassword;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Votre nouveau mot de passe temporaire')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Vous avez demandé la réinitialisation de votre mot de passe.')
            ->line('Voici votre nouveau mot de passe temporaire :')
            ->line('**' . $this->temporaryPassword . '**')
            ->line('⚠️ **IMPORTANT :**')
            ->line('• Ce mot de passe est temporaire et sécurisé')
            ->line('• Connectez-vous immédiatement avec ce mot de passe')
            ->line('• Changez votre mot de passe dès votre première connexion')
            ->line('• Ce mot de passe expirera dans 24 heures')
            ->action('Se connecter maintenant', config('app.frontend_url', 'http://localhost:3000') . '/login')
            ->line('Si vous n\'avez pas demandé cette réinitialisation, contactez immédiatement l\'administrateur.')
            ->salutation('Cordialement, L\'équipe de votre application');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'temporary_password' => $this->temporaryPassword,
            'email' => $notifiable->email
        ];
    }
}
