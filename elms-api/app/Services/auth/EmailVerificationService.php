<?php

namespace App\Services\Auth;

use Core\Database;
use Core\App;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;


class EmailVerificationService {

    private Database $db;

    public function __construct() {
        $this->db = App::resolve(Database::class);
    }


    public function sendVerificationEmail($name, $email, $verification_token) {
         
    $phpmailer = new PHPMailer(true);

    try {
        $phpmailer->SMTPDebug = SMTP::DEBUG_SERVER;
        $phpmailer->isSMTP();
        $phpmailer->SMTPAuth = true;

        $phpmailer = new PHPMailer();
        $phpmailer->isSMTP();
        $phpmailer->Host = 'sandbox.smtp.mailtrap.io';
        $phpmailer->SMTPAuth = true;
        $phpmailer->Port = 2525;
        $phpmailer->Username = '349ceb0e7b12dc';
        $phpmailer->Password = '2c46a93e575dab';
        $phpmailer->SMTPSecure = "tls";
        $phpmailer->Port = 587;
        $phpmailer->setFrom("your-email@gmail.com", $name);
        $phpmailer->addAddress($email);

        $phpmailer->isHTML(true);
        $phpmailer->Subject = 'Email Verification';

        $email_template = "
            <h1>You have Registred with Employee Leave Management System</h1>
            <p>Please click the link below to verify your email: 
                <a href='http://localhost:5173/verify-email?token=$verification_token'>Verify Email</a>
            </p>
            <p>If you did not request this verification, please ignore this email.</p>
            <p>Thank you for using our service.</p>
        ";

        $phpmailer->Body = $email_template;
        $phpmailer->AltBody = $email_template;

        $phpmailer->send();
        return true;
    }catch (Exception $e) {
        throw new \Exception('Failed to send verification email: ' . $e->getMessage());
    }

    }
}