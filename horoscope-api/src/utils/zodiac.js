export function getZodiacSign(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid birthdate');
  const day = d.getUTCDate();
  const month = d.getUTCMonth() + 1; // 1-12

  // Aries: Mar 21 - Apr 19
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  // Taurus: Apr 20 - May 20
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  // Gemini: May 21 - Jun 20
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  // Cancer: Jun 21 - Jul 22
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  // Leo: Jul 23 - Aug 22
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  // Virgo: Aug 23 - Sep 22
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  // Libra: Sep 23 - Oct 22
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  // Scorpio: Oct 23 - Nov 21
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  // Sagittarius: Nov 22 - Dec 21
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  // Capricorn: Dec 22 - Jan 19
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  // Aquarius: Jan 20 - Feb 18
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  // Pisces: Feb 19 - Mar 20
  return 'Pisces';
}
