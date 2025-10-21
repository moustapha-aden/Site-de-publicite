<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendRealPasswordNotification extends Notification
{
    use Queueable;

    protected $realPassword;

    /**
     * Create a new notification instance.
     */
    public function __construct($realPassword)
    {
        $this->realPassword = $realPassword;
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
            ->subject('Votre mot de passe de connexion')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Vous avez demandé la récupération de votre mot de passe.')
            ->line('Voici votre mot de passe actuel :')
            ->line('**' . $this->realPassword . '**')
            ->line('🔐 **Informations de connexion :**')
            ->line('• Email : ' . $notifiable->email)
            ->line('• Mot de passe : ' . $this->realPassword)
            ->action('Se connecter maintenant', config('app.frontend_url', 'http://127.0.0.1:8000') . '/login')
            ->line('⚠️ **Sécurité :**')
            ->line('• Gardez ces informations confidentielles')
            ->line('• Ne partagez jamais votre mot de passe')
            ->line('• Changez votre mot de passe régulièrement')
            ->line('Si vous n\'avez pas demandé cette récupération, contactez immédiatement l\'administrateur.')
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
            'real_password' => $this->realPassword,
            'email' => $notifiable->email
        ];
    }
}
