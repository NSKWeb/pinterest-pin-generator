// Pin Studio Page

'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/Header';
import { PinGeneratorForm } from '@/components/pins/PinGeneratorForm';
import { PinPreview } from '@/components/pins/PinPreview';
import { Image, Palette, Zap, Download } from 'lucide-react';

interface GeneratedPin {
  id: string;
  title: string;
  description: string;
  text: string;
  backgroundImage?: string;
  textPosition: { x: number; y: number };
  fontSize: number;
  fontColor: string;
  backgroundColor?: string;
  aspectRatio: '2:3' | '1:1' | '4:5';
  template?: string;
  createdAt: Date;
}

export default function PinsPage() {
  const [currentPin, setCurrentPin] = useState<GeneratedPin | null>(null);
  const [recentPins, setRecentPins] = useState<GeneratedPin[]>([]);

  const handlePinGenerated = (pin: GeneratedPin) => {
    setCurrentPin(pin);
    setRecentPins(prev => [pin, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader 
        title="Pin Studio" 
        subtitle="Design Pinterest pins with AI assistance" 
      />
      
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-600/20">
              <Image className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{recentPins.length}</p>
              <p className="text-sm text-gray-400">Total Pins</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-600/20">
              <Palette className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {recentPins.filter(p => p.createdAt > new Date(Date.now() - 86400000)).length}
              </p>
              <p className="text-sm text-gray-400">Today</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-600/20">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {recentPins.filter(p => p.template).length}
              </p>
              <p className="text-sm text-gray-400">Templates</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-600/20">
              <Download className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {recentPins.filter(p => p.backgroundImage).length}
              </p>
              <p className="text-sm text-gray-400">With Images</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <PinGeneratorForm onPinGenerated={handlePinGenerated} />
          
          {/* Preview */}
          {currentPin ? (
            <PinPreview pin={currentPin} />
          ) : (
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
              <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Pin Selected</h3>
              <p className="text-gray-400">
                Create a new pin to see it here
              </p>
            </div>
          )}
        </div>

        {/* Recent Pins */}
        {recentPins.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Pins</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentPins.slice(0, 12).map((pin) => (
                <div 
                  key={pin.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors cursor-pointer group"
                  onClick={() => setCurrentPin(pin)}
                >
                  <div className="aspect-[2/3] bg-gradient-to-br from-indigo-600 to-purple-600 p-4 flex items-end">
                    <p className="text-white font-medium text-sm line-clamp-2">{pin.text}</p>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-medium text-white line-clamp-1">{pin.title}</h4>
                    <p className="text-xs text-gray-400 capitalize">{pin.aspectRatio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}