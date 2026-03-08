export interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string[];
    date: string;
    readTime: string;
    category: string;
    imageColor: string;
    seoKeywords: string;
}

export const articles: Article[] = [
    {
        id: '1',
        slug: 'hdmi-port-problems-game-consoles',
        title: 'HDMI Port Problems on Game Consoles: Signs You Should Not Ignore',
        excerpt: 'A damaged HDMI port is one of the most common console repair issues. If your PlayStation, Xbox, or Nintendo Switch shows no image, flickering video, or only works when the cable is held at an angle, the HDMI port may be damaged.',
        content: [
            'A damaged HDMI port is one of the most common console repair issues. If your PlayStation, Xbox, or Nintendo Switch shows no image, flickering video, or only works when the cable is held at an angle, the HDMI port may be damaged.',
            'Many people keep using the console like that, and that is where the real mess starts. A bad HDMI connection can lead to more motherboard damage if the port gets worse over time. What starts as a simple HDMI port repair can become a more expensive board-level repair.',
            'At WE FIX CONSOLES, we repair HDMI port issues on gaming consoles with proper soldering and testing. If your console has no display, bring it in before the damage grows.'
        ],
        date: 'March 6, 2026',
        readTime: '3 min read',
        category: 'Hardware',
        imageColor: 'from-blue-500 to-cyan-400',
        seoKeywords: 'HDMI port repair, PlayStation HDMI repair, Xbox no signal, console no display, gaming console repair Houston'
    },
    {
        id: '2',
        slug: 'why-console-overheats-shuts-off',
        title: 'Why Your Console Overheats and Shuts Off While Gaming',
        excerpt: 'If your console gets too hot, turns off by itself, or sounds like a jet engine, it likely needs internal maintenance. Dust buildup, dried thermal paste, or failing liquid metal can cause overheating problems in modern consoles.',
        content: [
            'If your console gets too hot, turns off by itself, or sounds like a jet engine, it likely needs internal maintenance. Dust buildup, dried thermal paste, or failing liquid metal can cause overheating problems in modern consoles.',
            'This is common on PlayStation, Xbox, and other gaming systems that have not been cleaned in a long time. Heat is not just annoying. It slowly stresses internal components and can shorten the life of your console.',
            'A proper deep cleaning and thermal service can help restore cooling performance and make the console run more quietly and safely. If your system is overheating, do not wait until it becomes a no-power issue.'
        ],
        date: 'March 5, 2026',
        readTime: '4 min read',
        category: 'Maintenance',
        imageColor: 'from-red-500 to-orange-400',
        seoKeywords: 'console overheating repair, PS5 overheating, Xbox overheating fix, thermal service console, deep cleaning console'
    },
    {
        id: '3',
        slug: 'stick-drift-why-controller-moves',
        title: 'Stick Drift: Why Your Controller Moves by Itself',
        excerpt: 'Stick drift happens when your controller moves on screen even when you are not touching the joystick. This is one of the most common controller issues on PlayStation, Xbox, and Nintendo systems.',
        content: [
            'Stick drift happens when your controller moves on screen even when you are not touching the joystick. This is one of the most common controller issues on PlayStation, Xbox, and Nintendo systems.',
            'In some cases, the problem is dirt or wear inside the analog stick module. In other cases, the joystick itself is worn out and needs replacement. A lot of people try to ignore it, but drift usually gets worse, not better.',
            'A proper repair can restore control accuracy and make gaming feel normal again. If your aim feels off, your character walks alone, or menus move on their own, your controller probably has drift.'
        ],
        date: 'March 3, 2026',
        readTime: '3 min read',
        category: 'Controllers',
        imageColor: 'from-purple-500 to-pink-400',
        seoKeywords: 'stick drift repair, controller drift fix, PS5 controller repair, Xbox controller joystick repair, Nintendo controller drift'
    },
    {
        id: '4',
        slug: 'hall-effect-vs-standard-joysticks',
        title: 'Hall Effect vs Standard Joysticks: What Is Better for Stick Drift?',
        excerpt: 'A lot of people ask about Hall effect joysticks and anti-drift controller sticks. Here is the simple version: standard joysticks use physical contact parts that wear down over time, while Hall effect joysticks use magnetic sensing to read movement.',
        content: [
            'A lot of people ask about Hall effect joysticks and anti-drift controller sticks. Here is the simple version: standard joysticks use physical contact parts that wear down over time, while Hall effect joysticks use magnetic sensing to read movement.',
            'Because Hall effect sticks have less physical wear in the sensing system, they are often promoted as anti-drift or drift-resistant. That does not mean they are magic unicorn parts from another galaxy. They can still have issues from bad installation, damage, poor quality control, or other controller problems.',
            'Standard joysticks are still common and work well, but Hall effect options are becoming more popular for people who want better long-term durability. The best choice depends on the controller model, part quality, and whether the installation is done correctly.',
            'If you want help deciding between standard and Hall effect joystick replacement, WE FIX CONSOLES can point you in the right direction.'
        ],
        date: 'February 28, 2026',
        readTime: '4 min read',
        category: 'Components',
        imageColor: 'from-green-500 to-emerald-400',
        seoKeywords: 'Hall effect joysticks, anti-drift joysticks, controller joystick replacement, stick drift solution, Hall effect vs standard joystick'
    },
    {
        id: '5',
        slug: 'no-power-console-more-than-bad-cable',
        title: 'No Power Console? It May Be More Than a Bad Cable',
        excerpt: 'If your console does not turn on, many people assume the charger, cable, or power supply is the problem. Sometimes that is true. Sometimes the real issue is deeper on the motherboard.',
        content: [
            'If your console does not turn on, many people assume the charger, cable, or power supply is the problem. Sometimes that is true. Sometimes the real issue is deeper on the motherboard.',
            'No-power problems can come from shorts, damaged ports, failed power circuits, or board-level faults. That is why guessing is a bad idea. Replacing random parts without diagnosis can waste time and money.',
            'A proper diagnosis helps find the actual fault before repair begins. If your PlayStation, Xbox, Nintendo Switch, or handheld console shows no signs of power, it is best to have it checked by a repair specialist who understands console hardware.'
        ],
        date: 'February 20, 2026',
        readTime: '3 min read',
        category: 'Troubleshooting',
        imageColor: 'from-yellow-500 to-amber-400',
        seoKeywords: 'console no power, gaming console repair, console diagnosis, motherboard repair, console repair Houston'
    }
];

export function getArticleBySlug(slug: string): Article | undefined {
    return articles.find(article => article.slug === slug);
}
