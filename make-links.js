// Usage:  node make-links.js https://your-site.netlify.app
// Reads config.json and writes links.csv with a personal invite link and a
// ready-to-click WhatsApp share link for every guest.
const fs = require('fs');
const base = (process.argv[2] || 'https://your-site.netlify.app').replace(/\/$/, '');
const c = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
const child = c.child.name.split(' ')[0];
const rows = [['name', 'mobile', 'invite_link', 'whatsapp_link']];
for (const [num, g] of Object.entries(c.guests)) {
  const name = typeof g === 'string' ? g : g.name;
  const digits = num.replace(/\D/g, '').slice(-10);
  const link = `${base}/?to=${digits}`;
  const msg = `Hi ${name.split(' ')[0]}! You're invited to ${child}'s birthday party 🎉 Open your invitation: ${link}`;
  rows.push([name, digits, link, `https://wa.me/${c.defaultCountryCode || '91'}${digits}?text=${encodeURIComponent(msg)}`]);
}
fs.writeFileSync(__dirname + '/links.csv', rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n'));
console.log(`Wrote links.csv with ${rows.length - 1} guests`);
