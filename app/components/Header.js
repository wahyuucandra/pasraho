"use client";

export default function Header({ videoRef, canvasRef, locked, onToggleForce }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Mini Webcam */}
        <div className="relative">
          <div
            className={`h-12 w-12 overflow-hidden rounded-full border-[3px] shadow-md transition-all duration-700 ${
              locked
                ? "border-red-400 shadow-red-100"
                : "border-emerald-400 shadow-emerald-100"
            }`}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <span
            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white transition-colors duration-500 ${
              locked ? "bg-red-500" : "bg-emerald-500"
            }`}
          />
        </div>

        {/* Logo */}
        <div className="flex-1 px-4">
          <h1 className="text-xl font-bold tracking-tight">PasrahOMeter</h1>
          <p className="text-xs text-gray-500">Kata-kata Anda, disampaikan dengan santun</p>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-500 ${
            locked ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full transition-colors duration-500 ${
              locked ? "bg-red-500" : "bg-emerald-500"
            }`}
          />
          {locked ? "Terkunci" : "Siap Pak"}
        </div>

        {/* Backdoor */}
        <button
          onClick={onToggleForce}
          className="ml-3 h-3 w-3 rounded-full bg-gray-300 opacity-15 hover:opacity-40 transition-opacity"
          title="Force smile toggle"
        />
      </div>
    </header>
  );
}
