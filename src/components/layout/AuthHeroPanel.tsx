interface AuthHeroPanelProps {
  note: string;
}

const AUTH_BACKGROUND_IMAGE =
  "https://img.freepik.com/free-photo/analyzing-statistical-data-with-colleagues_1098-17760.jpg";

export const AuthHeroPanel = ({ note }: AuthHeroPanelProps) => {
  return (
    <div
      className="relative hidden w-1/2 overflow-hidden md:flex"
      style={{
        backgroundImage: `url(${AUTH_BACKGROUND_IMAGE})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(7,18,16,0.28)_0%,_rgba(7,18,16,0.56)_55%,_rgba(7,18,16,0.74)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(4,12,10,0.78)_0%,_rgba(4,12,10,0.44)_36%,_rgba(4,12,10,0.08)_72%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(60,184,154,0.24),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(60,184,154,0.14),_transparent_30%)]" />

      <div className="relative flex h-full w-full flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-brand-light/40 bg-brand text-sm font-black tracking-[0.22em] text-white shadow-[0_12px_28px_rgba(60,184,154,0.35)]">
            TL
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              TrackLeads
            </p>
            <p className="text-lg font-semibold tracking-[0.18em] text-white">
              TRACKLEADS
            </p>
          </div>
        </div>

        <div className="max-w-lg">
          <h2 className="max-w-md text-4xl font-black leading-[1.02] text-white [text-shadow:0_12px_34px_rgba(0,0,0,0.52)]">
            Find qualified leads and turn outreach into momentum.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-white/84 [text-shadow:0_8px_24px_rgba(0,0,0,0.4)]">
            Keep prospecting, saved companies, calendars, and tasks inside one
            focused workflow built around the TrackLeads brand.
          </p>
        </div>

        <div className="max-w-[20rem] rounded-[28px] border border-white/12 bg-slate-950/24 p-5 backdrop-blur-sm shadow-[0_16px_38px_rgba(0,0,0,0.16)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-brand-light">
            Note:
          </p>
          <p className="text-sm leading-7 text-white/84">{note}</p>
        </div>
      </div>
    </div>
  );
};
