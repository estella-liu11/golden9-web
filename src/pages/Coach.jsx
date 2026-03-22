import { useMemo, useState } from 'react';
import coachData from '../content/coach.json';
import coachBio from '../content/coach.md?raw';
import parkPiao from '../assets/ParkPiao.jpg';
import coachFallback from '../assets/coach1.svg';

const stripTitle = (text) => text.replace(/^#\s+.*\n+/, '').trim();

export default function Coach() {
  const [imgSrc, setImgSrc] = useState(parkPiao);
  const bio = useMemo(() => stripTitle(coachBio), []);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="grid gap-10 p-8 md:grid-cols-[minmax(0,320px)_1fr] md:p-12">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img
                  src={imgSrc}
                  alt={coachData.name}
                  className="h-80 w-full object-cover"
                  onError={() => setImgSrc(coachFallback)}
                />
              </div>
              <div className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white">
                Available for 1:1 sessions and match prep
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Coach Profile
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                  {coachData.name}
                </h1>
                <p className="mt-2 text-lg text-primary">{coachData.title}</p>
              </div>

              <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                {bio}
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {coachData.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {stat.label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {coachData.cta.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                  >
                    {action.label}
                  </a>
                ))}
              </div>

              <div id="focus" className="rounded-2xl border border-slate-200 bg-white px-6 py-6">
                <h2 className="text-lg font-semibold text-slate-900">Coaching Focus</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {coachData.coachingFocus.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
