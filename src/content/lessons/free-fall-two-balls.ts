// src/content/lessons/free-fall-two-balls.ts
import type { Lesson } from '@/schema/lesson'

export const freeFallTwoBalls = {
  id: 'chute-libre-deux-billes',
  title: 'Quelle bille touche le sol en premier ?',
  level: 'college',

  hook: 'Aristote a écrit qu’une pierre dix fois plus lourde tombe dix fois plus vite. On l’a cru pendant deux mille ans. Devant toi : deux billes de même taille, l’une trente fois plus lourde que l’autre, à deux mètres du sol.',

  prediction: {
    kind: 'choice',
    question: 'Laquelle touche le sol en premier ?',
    observable: 'firstToLand',
    options: [
      {
        id: 'lourde', label: 'La lourde', expected: { kind: 'body', id: 'plomb' },
        reveal: 'Presque tout le monde répond ça. Aristote aussi. Regarde la chute au ralenti : elles restent côte à côte jusqu’au sol.',
      },
      {
        id: 'legere', label: 'La légère', expected: { kind: 'body', id: 'plastique' },
        reveal: 'Réponse rare. Tu as peut-être pensé que le poids freine la lourde. Regarde : elles restent côte à côte jusqu’au sol.',
      },
      {
        id: 'ensemble', label: 'En même temps', expected: { kind: 'tie' },
        reveal: 'C’est ce qui se passe. Mais est-ce que tu sais pourquoi ? La suite le montre, terme par terme.',
      },
    ],
  },

  simulation: {
    module: 'constantForceMotion',
    params: {
      gravity_m_s2: 9.81,
      releaseHeight_m: 2,
      tieTolerance_s: 0.02,
      bodies: [
        { id: 'plomb', label: 'bille de plomb', mass_kg: 0.117, initialVelocity_m_s: { x: 0, y: 0 }, drag: { radius_m: 0.0135 } },
        { id: 'plastique', label: 'bille de plastique', mass_kg: 0.004, initialVelocity_m_s: { x: 0, y: 0 }, drag: { radius_m: 0.0135 } },
      ],
      air: { enabled: false },
    },
  },

  observation: { launchLabel: 'Lâcher les billes' },

  explanation: [
    { kind: 'text', text: 'Elles arrivent ensemble. Pourtant la lourde est tirée vers le bas trente fois plus fort. Où passe cette force ?' },
    {
      kind: 'equation',
      steps: [
        {
          kind: 'write',
          line: { tokens: [
            { kind: 'symbol', text: 'F', meaning: 'le poids, la force qui tire vers le bas' },
            { kind: 'operator', text: '=' },
            { kind: 'symbol', text: 'm', meaning: 'la masse de la bille' },
            { kind: 'operator', text: '·' },
            { kind: 'symbol', text: 'g', meaning: 'la gravité, 9,81 m/s² sur Terre' },
          ] },
          text: 'Le poids tire la bille vers le bas. Plus elle est massive, plus il tire fort. Trente fois plus de masse, trente fois plus de force.',
        },
        {
          kind: 'write',
          line: { tokens: [
            { kind: 'symbol', text: 'a', meaning: 'l’accélération : à quel rythme la vitesse augmente' },
            { kind: 'operator', text: '=' },
            { kind: 'fraction',
              numerator: [{ kind: 'symbol', text: 'F', meaning: 'la force qu’on lui applique' }],
              denominator: [{ kind: 'symbol', text: 'm', meaning: 'la masse, qui résiste' }] },
          ] },
          text: 'Mais une force ne donne pas une vitesse. Elle donne une accélération. Et pour une même force, une grosse masse accélère moins : elle résiste. C’est la deuxième loi de Newton.',
        },
        {
          kind: 'substitute',
          symbol: 'F',
          by: [
            { kind: 'symbol', text: 'm', meaning: 'la masse' },
            { kind: 'operator', text: '·' },
            { kind: 'symbol', text: 'g', meaning: 'la gravité' },
          ],
          text: 'Remplace la force par le poids.',
        },
        {
          kind: 'cancel',
          symbol: 'm',
          text: 'La masse est en haut et en bas. Elle tire plus fort, et elle résiste autant. Elle s’annule.',
        },
        {
          kind: 'result',
          line: { tokens: [
            { kind: 'symbol', text: 'a', meaning: 'l’accélération' },
            { kind: 'operator', text: '=' },
            { kind: 'symbol', text: 'g', meaning: 'la gravité' },
          ] },
          text: 'Toutes les billes accélèrent pareil. Le plomb, le plastique, une plume : 9,81 m/s² sur Terre. À une condition : que rien d’autre ne les freine.',
        },
      ],
    },
  ],

  exercises: [
    {
      id: 'deux-hauteurs',
      question: 'Deux billes identiques. Tu lâches la première de 2 m et la seconde de 1 m. Laquelle a la plus grande accélération ?',
      options: [
        { id: 'haute', label: 'Celle lâchée de 2 m', misconception: 'Elle touche le sol à plus grande vitesse, c’est vrai : elle a eu plus de temps pour en prendre. Mais l’accélération, c’est le rythme auquel la vitesse augmente, et ce rythme est le même pour les deux.' },
        { id: 'basse', label: 'Celle lâchée de 1 m', misconception: 'Elle touche le sol plus tôt, mais pas parce qu’elle accélère plus : elle a simplement moins de chemin à faire.' },
        { id: 'meme', label: 'La même' },
      ],
      answerId: 'meme',
      correction: [
        'L’accélération d’une bille qui tombe vaut a = g, quelle que soit sa masse.',
        'La hauteur n’apparaît nulle part dans a = F / m : elle ne change ni la force, ni la masse.',
        'Ce que la hauteur change, c’est la durée de la chute, donc la vitesse à l’arrivée. Pas l’accélération.',
      ],
    },
    {
      id: 'feuille-boule',
      question: 'Une feuille de papier à plat, et la même feuille froissée en boule. Même masse. Tu les lâches ensemble. Laquelle touche le sol en premier ?',
      options: [
        { id: 'plat', label: 'La feuille à plat', misconception: 'Une feuille à plat ne tombe pas droit : elle plane, elle zigzague, l’air la porte. Elle arrive toujours après la boule.' },
        { id: 'boule', label: 'La boule' },
        { id: 'ensemble', label: 'En même temps', misconception: 'Ce serait vrai dans le vide, et c’est exactement ce que dit a = g. Mais dans l’air, la feuille à plat pousse beaucoup d’air devant elle, et l’air la freine. La boule, presque pas.' },
      ],
      answerId: 'boule',
      correction: [
        'Même masse, même poids, donc même accélération au départ : g.',
        'Mais l’air pousse contre tout ce qui avance dans lui. Cette force dépend de la forme et de la surface, pas de la masse.',
        'La feuille à plat offre une grande surface : l’air la freine fort. La boule, une petite : elle tombe presque comme dans le vide.',
        'C’est là que a = g cesse d’être toute l’histoire. Dans le bac à sable, active la résistance de l’air et baisse la masse d’une bille : l’air la freine bien plus qu’une lourde.',
      ],
    },
  ],

  sandbox: {
    controls: [
      { kind: 'slider', id: 'gravite', target: { param: 'gravity_m_s2' }, label: 'Gravité', min: -20, max: 50, scale: { kind: 'linear', step: 0.01 } },
      { kind: 'slider', id: 'hauteur', target: { param: 'releaseHeight_m' }, label: 'Hauteur', min: 0.5, max: 100, scale: { kind: 'linear', step: 0.5 } },
      { kind: 'slider', id: 'masse-plomb', target: { param: 'mass_kg', bodyId: 'plomb' }, label: 'Masse du plomb', min: 0.001, max: 0.5, scale: { kind: 'log', digits: 3 } },
      { kind: 'slider', id: 'masse-plastique', target: { param: 'mass_kg', bodyId: 'plastique' }, label: 'Masse du plastique', min: 0.001, max: 0.5, scale: { kind: 'log', digits: 3 } },
      { kind: 'toggle', id: 'air', target: { param: 'air.enabled' }, label: 'Résistance de l’air', on: 'avec', off: 'sans' },
    ],
    challenges: [
      { id: 'inverser', text: 'Trouve un réglage où la bille de plastique arrive nettement après l’autre. Puis un autre où elle arrive avant.' },
      { id: 'lune', text: 'Règle la gravité de la Lune, 1,62 m/s². Combien de temps dure la chute ?' },
      { id: 'cent-metres', text: 'Monte à 100 m avec la résistance de l’air. Lis les deux temps. Que dirait Aristote ?' },
    ],
  },

  notebook: {
    title: 'Deux billes, une seule chute',
    takeaway: 'La masse tire plus fort et résiste autant : elle s’annule. Sans air, tout tombe pareil.',
  },

  concepts: ['chute-libre', 'deuxieme-loi-de-newton', 'independance-de-la-masse', 'resistance-de-l-air'],
} satisfies Lesson<'constantForceMotion'>
