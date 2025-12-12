<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Zulzi Trans</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="{{ asset('images/logozulzi.png') }}">
    @viteReactRefresh
    @vite(['resources/js/Pages/Auth/LoginPage.jsx'])
</head>
<body class="antialiased">
    <div id="login-app"></div>
</body>
</html>
