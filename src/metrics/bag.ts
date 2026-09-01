/**
 * Talisman metrics/bag
 * =====================
 *
 * Function computing the bag distance which works likewise which is the max
 * of the difference of multiset a & multiset b and the difference of
 * multiset b & multiset a.
 *
 * [Reference]:
 * http://www-db.disi.unibo.it/research/papers/SPIRE02.pdf
 *
 * [Article]:
 * String Matching with Metric Trees Using an Approximate Distance.
 * Ilaria Bartolini, Paolo Ciaccia, and Marco Patella.
 *
 * [Tags]: metric, string metric.
 */
import type {Sequence} from '../types.js';

/**
 * Function returning the bag distance.
 *
 * @param a - The first sequence.
 * @param b - The second sequence.
 * @return The bag distance.
 */
export default function bag<T>(a: Sequence<T>, b: Sequence<T>): number {
  if (a === b)
    return 0;

  const ma: Record<string, number> = Object.create(null),
        mb: Record<string, number> = Object.create(null);

  let da = a.length,
      db = b.length;

  if (!da)
    return db;
  if (!db)
    return da;

  const longest = Math.max(da, db);

  for (let i = 0; i < longest; i++) {
    if (i < da) {
      const value = String(a[i]);

      if (!ma[value])
        ma[value] = 0;
      ma[value]++;
    }

    if (i < db) {
      const value = String(b[i]);

      if (!mb[value])
        mb[value] = 0;
      mb[value]++;
    }
  }

  for (const k in ma) {
    if (mb[k])
      da -= Math.min(ma[k], mb[k]);
  }

  for (const k in mb) {
    if (ma[k])
      db -= Math.min(mb[k], ma[k]);
  }

  return Math.max(da, db);
}
