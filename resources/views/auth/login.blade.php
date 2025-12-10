<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login Zulzi Trans</title>
    @viteReactRefresh
    @vite(['resources/js/Pages/Auth/LoginPage.jsx'])
</head>
<body class="antialiased">
    <div id="login-app"></div>
</body>
</html>
