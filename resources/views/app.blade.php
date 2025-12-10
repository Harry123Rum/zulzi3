<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Zulzi Trans</title>

        <!-- CSRF Token untuk Axios / Fetch -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/main.jsx'])
    </head>

    <body class="antialiased">
        <div id="root"></div>
    </body>

    <script>
        // Ambil data dari Blade (jika ada)
        const oauthData = @json($oauthData ?? null);

        if (oauthData && oauthData.token) {
            // 1. Simpan Token ke localStorage
            localStorage.setItem('auth_token', oauthData.token);
            
            // 2. Simpan Data User ke localStorage (opsional, tapi disarankan)
            localStorage.setItem('user', JSON.stringify(oauthData.user));
            
            // 3. Hapus data dari URL/session sementara dan redirect bersih ke beranda
            window.location.replace('/beranda');
        }
    </script>
</html>
