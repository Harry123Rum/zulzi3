import React from 'react';

const Stepper = ({ currentStep }) => {
    const steps = [
        { id: 1, title: 'Pemesanan' },
        { id: 2, title: 'Pembayaran' },
        { id: 3, title: 'Konfirmasi' },
        { id: 4, title: 'Selesai' },
    ];

    return (
        <div className="flex justify-center items-center w-full mb-10">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    {/* Lingkaran Angka */}
                    <div className="flex flex-col items-center relative">
                        <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 
                            ${currentStep >= step.id 
                                ? 'bg-blue-400 border-blue-400 text-white' 
                                : 'bg-white border-gray-300 text-blue-400'}`}
                        >
                            {step.id}
                        </div>
                        <div className={`absolute top-12 text-xs font-semibold whitespace-nowrap 
                            ${currentStep >= step.id ? 'text-blue-400' : 'text-blue-300'}`}>
                            {step.title}
                        </div>
                    </div>

                    {/* Garis Penghubung (Garis tidak muncul setelah step terakhir) */}
                    {index !== steps.length - 1 && (
                        <div className={`w-16 h-1 mx-2 ${currentStep > step.id ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Stepper;