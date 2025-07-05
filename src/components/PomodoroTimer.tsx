
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TimeOption {
  label: string;
  minutes: number;
  seconds: number;
}

const timeOptions: TimeOption[] = [
  { label: '5 menit', minutes: 5, seconds: 300 },
  { label: '15 menit', minutes: 15, seconds: 900 },
  { label: '45 menit', minutes: 45, seconds: 2700 },
  { label: '1 jam', minutes: 60, seconds: 3600 },
  { label: '4 jam', minutes: 240, seconds: 14400 },
  { label: '24 jam', minutes: 1440, seconds: 86400 },
];

const PomodoroTimer = () => {
  const [selectedTime, setSelectedTime] = useState<TimeOption>(timeOptions[0]);
  const [timeLeft, setTimeLeft] = useState(selectedTime.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for notification
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLPdywGJnfH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLMeiYGKXfH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLMdywGJnfH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLMdywGJnfH8N2PMgcOXbTn66lWFApFn+DxvWkSCS1+zPLNeSsFJnjH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLNeSsFJnjH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLNeSsFJnjH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLNeSsFJnjH8N2QQAoUXbTp66hVFAlGn+DyvmgSCS1+zPLNeSsFJnjH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLNeSsFJnjH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLNeSsFJnjH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLNeSsFJnjH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zPLNeSsFJnjH8N2QQAoUXrTp66hVFApGn+DyvmgSCS1+zQ==');
    audioRef.current.volume = 0.3;
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            // Play notification sound
            if (audioRef.current) {
              audioRef.current.play().catch(() => {
                // Fallback if audio fails to play
                console.log('Timer completed!');
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimeSelect = (option: TimeOption) => {
    setSelectedTime(option);
    setTimeLeft(option.seconds);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const handlePlayPause = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedTime.seconds);
      setIsCompleted(false);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime.seconds);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((selectedTime.seconds - timeLeft) / selectedTime.seconds) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Pomodoro Timer</h1>
          <p className="text-slate-600">Tingkatkan produktivitas dengan teknik pomodoro</p>
        </div>

        {/* Time Selection */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">Pilih Durasi Timer</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {timeOptions.map((option) => (
                <Button
                  key={option.label}
                  variant={selectedTime.label === option.label ? "default" : "outline"}
                  onClick={() => handleTimeSelect(option)}
                  className={`h-12 text-sm font-medium transition-all duration-200 ${
                    selectedTime.label === option.label
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-md'
                      : 'bg-white/50 hover:bg-white/80 text-slate-700 border-slate-200'
                  }`}
                  disabled={isRunning}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timer Display */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center">
              <div className={`relative inline-block mb-6 ${isRunning ? 'pulse-animation' : ''}`}>
                <div className="text-6xl md:text-8xl font-mono font-bold text-slate-800 tabular-nums">
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <div className="mb-6">
                <Progress 
                  value={getProgress()} 
                  className="h-3 bg-slate-200"
                />
                <p className="text-sm text-slate-600 mt-2">
                  {isCompleted ? 'Timer selesai!' : `${selectedTime.label} - ${Math.round(getProgress())}% selesai`}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className={`h-14 px-8 text-lg font-medium transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-600 hover:bg-green-700'
                      : isRunning
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Mulai Lagi
                    </>
                  ) : isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Mulai
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg font-medium bg-white/50 hover:bg-white/80 text-slate-700 border-slate-200"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Tips Pomodoro</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Fokus penuh pada satu tugas selama timer berjalan</li>
              <li>• Matikan notifikasi dan gangguan lainnya</li>
              <li>• Istirahat sejenak setelah timer selesai</li>
              <li>• Gunakan waktu istirahat untuk peregangan atau minum air</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PomodoroTimer;
