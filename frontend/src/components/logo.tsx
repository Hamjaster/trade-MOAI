import logo from "@/assets/logo.png";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="text-4xl font-bold">
        <span className="text-blue-500">Trade</span>
        <span className="text-gray-800">Moai</span>
      </div>

      <img
        src={logo}
        alt="Moai Logo"
        width={64}
        height={64}
        className="object-contain"
      />
    </div>
  );
}
