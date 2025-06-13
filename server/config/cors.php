<?php
return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'email/verify/*', 'registro'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:4200',
        'http://127.0.0.1:4200',
        'https://yohannagelo.ruix.iesruizgijon.es',
        env('FRONTEND_URL'),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

    'stateful' => [
        'localhost',
        '127.0.0.1',
        parse_url(env('FRONTEND_URL'), PHP_URL_HOST),
    ],

];
