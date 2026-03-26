'use client';

export default function PersonalSection() {
  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="max-w-2xl mx-auto">
        <div className="border-l-4 border-yellow-400 pl-8 py-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            What&apos;s Different
          </h2>

          <div className="space-y-5 text-slate-300 text-lg leading-relaxed">
            <p>
              I don&apos;t run a boosting team. There&apos;s no rotating pool of accounts, no outsourcing, no randomness.
            </p>

            <p>
              Every game you climb is played by me. That means consistent playstyle, same decision-making, and full accountability for your account&apos;s progress.
            </p>

            <p>
              My focus is on clean climbs. I play careful TFT — proper economy, flex comps, and adaptation to whatever lobby throws at me. No forcing meta, no coinflip plays.
            </p>

            <p>
              You get a high-level player who understands the game deeply and treats your account with the same care I&apos;d treat my own.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
