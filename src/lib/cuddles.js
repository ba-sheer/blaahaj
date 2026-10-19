const tiers = [
	{
		at: 1,
		msgs: [
			'he noticed you',
			'a tiny smile appears',
			'soft,very soft',
			'first pat.the shark approves',
			'hello, human',
			'blub',
			'ooh, that was nice'
		]
	},
	{
		at: 5,
		msgs: [
			'he is vibrating (happily)',
			'the shark leans into it',
			'warm fuzy shark noises',
			'he wiggles his tiny fins',
			'you have excellent pat technique',
			'still smiling still soft',
			'he blinked that means love',
			'a gentle shark hum'
		]
	},
	{
		at: 10,
		msgs: [
			'he likes you',
			'friendship level:rising',
			'he would like to introduce you to his friends',
			'the shark has told his friends about you',
			'you are no on his nice list',
			'he is doing a little happy spin',
			'the shark has stopped being a shark and become a pillow'
		]
	},
	{
		at: 25,
		msgs: [
			'besta friends besta friends',
			'he would cross ocean for you(slowly)',
			'maximum comfort achieved',
			'the shark has saved you a spot in the deep',
			'he is telling the fish about you',
			' a bond is stronger than polyester fill',
			'you are gis favorite human don not tell the others'
		]
	},
	{
		at: 50,
		msgs: [
			'certified shark whisperer',
			'he has give you an honarary fin',
			'the whole reef knows your name know',
			'you could pet him for hours and he would let you',
			'peak softness unlocked',
			'he is no longer a plush he is family',
			'the shark would like you to drink some water'
		]
	},
	{
		at: 100,
		msgs: [
			'the shark has retired from being shark scary forever',
			'you have unlocked :unconditional shark love',
			'the ocean has sent a thank you card',
			'he has written a poem very tiny,it just says "blub"',
			'achievement:very good friend',
			'go touch grass.then come back and pet me'
		]
	},
	{
		at: 200,
		msgs: [
			'this is a lot of cuddles he is thriving',
			'the shark is transcending',
			'you and the shark are now a legend in the lore',
			'you are the hero of chapter 7',
			'okay okay he is already the happiest shark alive'
		]
	}
];
const milestones = {
	1: 'first cuddle!',
	10: 'ten! he likes you',
	25: 'twenty five! best friend',
	50: 'fifty cuddles!honarary fin awarded',
	67: 'six seven!six seven!',
	69: 'nice',
	100: 'one hundred cuddles!',
	200: '250 you are unstoppable',
	500: '500 cuddles! the shark is speechless (he could never speak)'
};
let lastMsg = '';

export function cuddleMessage(n) {
	if (milestones[n]) {
		lastMsg = milestones[n];
		return lastMsg;
	}
	let tier = tiers[0];
	for (const t of tiers) if (n >= t.at) tier = t;
	const pool = tier.msgs.filter((m) => m !== lastMsg);
	lastMsg = pool[Math.floor(Math.random() * pool.length)];
	return lastMsg;
}
