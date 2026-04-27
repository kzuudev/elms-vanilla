<?php

namespace Core;

class Authenticator {


    public function authenticate($email, $password) {

        $db = App::resolve(Database::class);

        // check if the email provided by the user is existing in the database
        $user = $db->query("SELECT * FROM users WHERE email = :email", [
            'email' => $email
        ])->find();

    }
}