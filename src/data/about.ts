/** The story before the first commit, and life off the keyboard. Rendered by About.astro and the terminal's `about`. */
export type Chapter = { when: string; text: string };
export type Activity = {
  id: string;
  label: string;
  /** One-line version, used by the terminal and the card face. */
  one: string;
  /** Mono status tag on the card. */
  status: string;
  /** Longer caption shown with the picture. */
  caption: string;
  image?: { src: string; alt: string; width: number; height: number };
  accent: 'mint' | 'lavender' | 'butter';
};

export const about = {
  portrait: { src: '/about/rohan.webp', alt: 'Rohan Paul standing in a white shirt, on a dark background', width: 321, height: 1100 },
  story: [
    {
      when: '2021',
      text: 'Finished 10th with QBasic, MS Excel and a keen interest in anything with a screen. Like every other student I wanted a prestigious government university.',
    },
    {
      when: '2023',
      text: 'Ended up at a private one instead, with nothing but basic Python and SQL. It was harder than I ever expected, and a thousand self-doubts came along for the ride.',
    },
    {
      when: '2023',
      text: 'First semester at SRM, Cloud Computing specialisation. Wrote a healthcare system in Java Swing with a MySQL backend and learned what a stack trace really wants from you.',
    },
    {
      when: '2025',
      text: 'Moved from desktop Java to full-stack JavaScript and cloud deploys. Interned at ION Aerospace on drone navigation, where a bug is not a red line in the console but a drone in a bush.',
    },
    {
      when: '2026',
      text: 'Shipped VoltRoute, Scriptorium and CreditClear within three months of each other. Picked up ServiceNow CAD/CSA, DP-900 and Fortinet Cloud Security on the way. CGPA 9.43, doubts still present, deployments too.',
    },
    {
      when: 'now',
      text: 'Final stretch of the degree, Power BI in progress, and a growing habit of writing postmortems for things that worked.',
    },
  ] as Chapter[],
  activities: [
    {
      id: 'rides',
      label: 'long rides',
      one: 'a few long ones so far, more once the bike is mine',
      status: 'fleet: 0 · PR open',
      caption:
        'A few long rides so far, all on borrowed machines. The pull request for a bike of my own is still open. Until it merges, the sunsets are rented.',
      image: { src: '/about/rides.webp', alt: 'Rohan on a KTM Duke at a quarry edge, helmet on, looking at an orange sunset', width: 1200, height: 1428 },
      accent: 'butter',
    },
    {
      id: 'badminton',
      label: 'badminton',
      one: 'a must-have in my day',
      status: 'cron: 0 18 * * *',
      caption:
        'Non-negotiable. A day without a badminton game is a day with a failed health check. Smashes are the only thing I ship without a test.',
      image: { src: '/about/badminton.webp', alt: 'Rohan in a sports hall holding a badminton racket and giving a thumbs up', width: 1200, height: 1159 },
      accent: 'mint',
    },
    {
      id: 'music',
      label: 'keyboard',
      one: 'the one with 61 keys, not 104',
      status: 'input: 61 keys',
      caption:
        'Off the QWERTY, onto the other keyboard. No photo yet, which is the only part of this site without evidence. Chords are just data structures you can hear.',
      accent: 'lavender',
    },
  ] as Activity[],
};
