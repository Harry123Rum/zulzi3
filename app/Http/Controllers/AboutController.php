<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function index()
    {
        $data = [
            'company' => [
                'name' => 'Zulzi Trans',
                'tagline' => 'Partner Terpercaya untuk Kebutuhan Transportasi Anda',
                'description' => 'Zulzi Trans adalah penyedia layanan transportasi terpercaya yang mengutamakan kenyamanan, keamanan, dan ketepatan waktu. Dengan pengalaman bertahun-tahun, kami mampu memfasilitasi perjalanan terbaik. Dengan pengalaman bertahun-tahun, kami mampu memberikan pelayanan terbaik. Dengan pengalaman bertahun-tahun, kami mampu memfasilitasi transportasi yang aman, nyaman, dan terpercaya.'
            ],
            'statistics' => [
                [
                    'icon' => 'users',
                    'value' => '1000+',
                    'label' => 'Pelanggan Puas'
                ],
                [
                    'icon' => 'map',
                    'value' => '50+',
                    'label' => 'Rute Kota'
                ],
                [
                    'icon' => 'clock',
                    'value' => '24/7',
                    'label' => 'Layanan'
                ],
                [
                    'icon' => 'star',
                    'value' => '99%',
                    'label' => 'Kepuasan'
                ]
            ],
            'vision' => [
                [
                    'number' => '1',
                    'text' => 'Harga penyedia layanan transportasi terpercaya di Indonesia'
                ],
                [
                    'number' => '2',
                    'text' => 'Menyajikan solusi perjalanan yang aman dan nyaman'
                ],
                [
                    'number' => '3',
                    'text' => 'Menjadi pilihan utama masyarakat untuk mobilitas sehari-hari'
                ]
            ],
            'mission' => [
                [
                    'icon' => 'check-circle',
                    'text' => 'Memberikan layanan transportasi yang berkualitas dan terpercaya'
                ],
                [
                    'icon' => 'check-circle',
                    'text' => 'Menyediakan armada yang terawat dan dalam kondisi prima'
                ],
                [
                    'icon' => 'check-circle',
                    'text' => 'Meningkatkan kepuasan pelanggan dengan layanan terbaik dan profesional'
                ],
                [
                    'icon' => 'check-circle',
                    'text' => 'Memberikan pelayanan yang ramah dan profesional'
                ]
            ],
            'features' => [
                [
                    'icon' => 'dollar-sign',
                    'title' => 'Harga Kompetitif',
                    'description' => 'Tarif yang terjangkau dengan kualitas terbaik untuk semua kalangan'
                ],
                [
                    'icon' => 'headphones',
                    'title' => 'Layanan 24/7',
                    'description' => 'Siap melayani kebutuhan transportasi Anda kapan saja'
                ],
                [
                    'icon' => 'globe',
                    'title' => 'Booking Online',
                    'description' => 'Kemudahan untuk melakukan pemesanan melalui aplikasi digital'
                ],
                [
                    'icon' => 'shield',
                    'title' => 'Transparansi Penuh',
                    'description' => 'Informasi harga dan layanan yang jelas tanpa biaya tersembunyi'
                ]
            ],
            'commitment' => [
                'guarantee' => '100%',
                'guarantee_label' => 'Garansi',
                'service' => '24/7',
                'service_label' => 'Layanan',
                'rating' => '5★',
                'rating_label' => 'Rating',
                'description' => 'Kepercayaan yang Anda berikan adalah aset kami. Kami berkomitmen untuk terus meningkatkan dan memberikan layanan transportasi yang terpercaya dalam setiap perjalanan. Keselamatan dan kenyamanan Anda adalah prioritas utama kami. Dengan armada terawat dan sopir berpengalaman, kami siap memberikan Anda di tujuan dengan aman dan nyaman.'
            ]
        ];

        return response()->json($data);
    }
}