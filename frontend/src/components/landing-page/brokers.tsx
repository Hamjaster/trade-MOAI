export function Brokers() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            Options Brokers Supported
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 lg:grid-cols-4">
            <div className="flex items-center justify-center p-4">
              <span className="text-xl font-semibold">Fidelity</span>
            </div>
            <div className="flex items-center justify-center p-4">
              <span className="text-xl font-semibold">Charles Schwab</span>
            </div>
            <div className="flex items-center justify-center p-4">
              <span className="text-xl font-semibold">Robinhood</span>
            </div>
            <div className="flex items-center justify-center p-4">
              <span className="text-xl font-semibold">Webull</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
