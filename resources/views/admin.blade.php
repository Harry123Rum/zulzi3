<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- 1. Meta CSRF Token (PENTING UNTUK AXIOS) -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Zulzi Trans</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="{{ asset('images/logozulzi.png') }}">

    <!-- 2. Import Font Montserrat -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- 3. Load Vite Assets (pastikan me-load main.jsx) -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/main.jsx'])

    <!-- 4. Penyesuaian Font (Karena tidak ada tailwind.config.js) -->
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
        }
    </style>
</head>
<body class="bg-slate-50 antialiased"> <!-- 'font-sans' dihapus, di-handle oleh <style> -->
    <!-- 5. Mount Point React -->
    <div id="root"></div>
</body>
</html>