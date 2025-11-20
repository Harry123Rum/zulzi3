import React from 'react';
import { CheckCircle, Target, Users, Award } from 'lucide-react';

// Pastikan import ini mengarah ke komponen yang BARU SAJA kita update (Capital C)
import Navbar from '../Components/Navbar'; 
import Footer from '../Components/Footer';

export default function AboutPage(props) {
  // Ambil auth dari props jika tersedia
  const auth = props.auth || {};

  return (
    <div className="font-sans antialiased text-gray-800 bg-white min-h-screen flex flex-col">
      
      {/* Navbar Reusable */}
      <Navbar auth={auth} />

      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#003366] pt-40 pb-24 overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight animate-fade-in-up">
                Tentang Zulzi Trans
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                Kami bukan sekadar penyedia transportasi, kami adalah mitra perjalanan Anda menuju kesuksesan dan tujuan impian.
            </p>
        </div>
      </section>

      {/* --- STORY SECTION --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
                {/* Image Placeholder dengan Style yang Rapi */}
                <div className="w-full md:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                        <div className="bg-gray-100 h-96 w-full flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-700">
                             {/* Ganti ini dengan <img src="..." /> jika sudah ada foto */}
                             <div className="text-center">
                                <div className="bg-gray-200 p-4 rounded-full inline-block mb-2">
                                    <Users size={48} className="text-gray-400" />
                                </div>
                                <p className="font-medium">Foto Tim / Armada</p>
                             </div>
                        </div>
                        <div className="absolute bottom-0 left-0 bg-[#00a3e0] text-white px-8 py-4 rounded-tr-2xl font-bold text-xl shadow-lg">
                            Est. 2018
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-sm font-bold text-[#00a3e0] uppercase tracking-widest mb-2">Siapa Kami</h2>
                    <h3 className="text-3xl font-extrabold text-[#003366] mb-6">Solusi Transportasi Terintegrasi</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Zulzi Trans didirikan dengan visi untuk mempermudah mobilitas masyarakat dan logistik bisnis di Indonesia. Berawal dari 2 unit armada, kini kami telah melayani ribuan pelanggan dengan puluhan armada yang siap beroperasi 24 jam.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {[
                            "Respon Cepat", 
                            "Harga Transparan", 
                            "Armada Prima", 
                            "Supir Profesional"
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <CheckCircle className="text-[#00a3e0] fill-blue-50" size={20} />
                                <span className="font-bold text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- VISI MISI --- */}
      <section className="py-20 bg-[#f0f9ff]">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-[#003366] mb-6">
                        <Target size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#003366] mb-3">Visi Kami</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Menjadi perusahaan transportasi dan logistik terdepan di Indonesia yang dikenal karena kualitas pelayanan, keamanan, dan inovasi teknologi.
                    </p>
                </div>
                
                {/* Card 2 */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-[#003366] mb-6">
                        <Users size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#003366] mb-3">Misi Kami</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Memberikan pengalaman perjalanan yang aman dan nyaman, serta solusi logistik yang efisien bagi mitra bisnis kami melalui SDM yang unggul.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-[#003366] mb-6">
                        <Award size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#003366] mb-3">Nilai Kami</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Integritas, Profesionalisme, Keselamatan, dan Kepuasan Pelanggan adalah pilar utama dalam setiap langkah operasional kami.
                    </p>
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}